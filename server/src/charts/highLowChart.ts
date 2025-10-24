import { HighLowStatisticsReport } from '../types';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const AileronUltraLight = readFileSync(join(__dirname, '../../fonts/Aileron-UltraLight.otf'));
const base64Font = AileronUltraLight.toString('base64');
const fontMime = 'font/otf';

const highLowChart = (data: HighLowStatisticsReport[]) => {
    const parsedData = data.map((d) => ({
        ...d,
        total_rolls: Number(d.total_rolls),
        successful_rolls: Number(d.successful_rolls),
        high_rolls: Number(d.high_rolls),
    }));

    const width = 800;
    const height = 500;
    const margin = { top: 60, right: 30, bottom: 80, left: 60 };
    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;

    const colors = {
        total: '#88ccff',
        success: '#66ff99',
        high: '#ffbb33',
    };

    const numGroups = parsedData.length;
    const spacingRatio = 0.6;
    const maxGroupWidth = 60;
    const maxSpacing = maxGroupWidth * spacingRatio;
    const maxTotalWidth = numGroups * maxGroupWidth + (numGroups - 1) * maxSpacing;

    let groupWidth, spacing;
    if (maxTotalWidth <= chartWidth) {
        groupWidth = maxGroupWidth;
        spacing = maxSpacing;
    } else {
        const scaledGroupWidth = chartWidth / (numGroups + spacingRatio * (numGroups - 1));
        groupWidth = scaledGroupWidth;
        spacing = groupWidth * spacingRatio;
    }

    const totalBarWidth = groupWidth * 0.6;
    const subBarWidth = totalBarWidth * 0.6;

    const rawMax = Math.max(...parsedData.map((d) => d.total_rolls));
    const maxRolls = Math.ceil(rawMax / 5) * 5;
    const scaleY = chartHeight / maxRolls;

    const step = chartWidth / numGroups;

    let bars = '';
    parsedData.forEach((d, i) => {
        const groupX = margin.left + i * step + step / 2 - groupWidth / 2;
        const baseY = margin.top + chartHeight;

        const totalHeight = d.total_rolls * scaleY;
        const successHeight = d.successful_rolls * scaleY;
        const highHeight = d.high_rolls * scaleY;

        const totalX = groupX + (groupWidth - totalBarWidth) / 2;
        const successX = totalX - subBarWidth / 2;
        const highX = totalX + totalBarWidth - subBarWidth / 2;

        bars += `
      <rect x="${totalX}" y="${baseY - totalHeight}" width="${totalBarWidth}" height="${totalHeight}" fill="${colors.total}" rx="4"/>
      <rect x="${successX}" y="${baseY - successHeight}" width="${subBarWidth}" height="${successHeight}" fill="${colors.success}" rx="3"/>
      <rect x="${highX}" y="${baseY - highHeight}" width="${subBarWidth}" height="${highHeight}" fill="${colors.high}" rx="3"/>
      <text x="${groupX + groupWidth / 2}" y="${baseY + 15}" fill="white" font-size="12" text-anchor="middle">${d.most_common_charactername}</text>
    `;
    });

    const tickInterval = 5;
    const numTicks = maxRolls / tickInterval;
    let yAxis = '';
    let gridLines = '';

    for (let i = 0; i <= numTicks; i++) {
        const val = i * tickInterval;
        const y = margin.top + chartHeight - val * scaleY;

        yAxis += `
      <line x1="${margin.left - 5}" y1="${y}" x2="${margin.left}" y2="${y}" stroke="white" stroke-width="1"/>
      <text x="${margin.left - 10}" y="${y + 4}" fill="white" font-size="12" text-anchor="end">${val}</text>
    `;

        gridLines += `
      <line x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" stroke="#333" stroke-width="1"/>
    `;
    }

    const legendItems = [
        { label: 'Total Rolls', color: colors.total },
        { label: 'Successful Rolls', color: colors.success },
        { label: 'High Rolls', color: colors.high },
    ];

    const legendY = height - 30;
    const legendSpacing = 30; // space between entries
    const labelFontSize = 12;

    // Estimate widths based on text lengths (simple approximation)
    const labelWidths = legendItems.map((item) => 15 + 5 + item.label.length * 7); // box + gap + text
    const totalLegendWidth =
        labelWidths.reduce((a, b) => a + b, 0) + legendSpacing * (legendItems.length - 1);

    const legendStartX = (width - totalLegendWidth) / 2;

    let legend = '';
    let currentX = legendStartX;

    legendItems.forEach((item, i) => {
        legend += `
          <rect x="${currentX}" y="${legendY}" width="15" height="15" fill="${item.color}" rx="2"/>
          <text x="${currentX + 20}" y="${legendY + 12}" fill="white" font-size="${labelFontSize}">${item.label}</text>
        `;
        currentX += labelWidths[i] + legendSpacing;
    });

    // Final SVG output
    const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
        @font-face {
        font-family: 'MyFont';
        src: url('data:${fontMime};base64,${base64Font}') format('opentype');
        }
        text {
        font-family: 'MyFont';
        }
    </style>
    <rect width="100%" height="100%" fill="black" />
    <g>${gridLines}</g>
    <g>${yAxis}</g>
    <g>${bars}</g>
    <g>${legend}</g>
  </svg>
  `;

    return svg;
};

export default highLowChart;
