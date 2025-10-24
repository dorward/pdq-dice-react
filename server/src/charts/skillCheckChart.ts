import { SkillCheckStatisticsReport } from '../types';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { colours } from './colors';

const AileronUltraLight = readFileSync(join(__dirname, '../../fonts/Aileron-UltraLight.otf'));
const base64Font = AileronUltraLight.toString('base64');
const fontMime = 'font/otf';

const skillCheckChart = (data: SkillCheckStatisticsReport[]) => {
    const parsedData = data.map((d) => ({
        ...d,
        highest_roll: Number(d.highest_roll),
        highest_bonus_sum: Number(d.highest_bonus_sum),
        highest_total: Number(d.highest_total),
        most_bonus_types: Number(d.most_bonus_types),
        rolls_with_benny: Number(d.rolls_with_benny),
    }));

    const width = 900;
    const height = 500;
    const margin = { top: 70, right: 40, bottom: 100, left: 70 };
    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;

    const statColours = {
        roll: colours[0],
        bonus: colours[1],
        total: colours[2],
        bonuses: colours[3],
    };

    const numGroups = parsedData.length;
    const barWidth = Math.min(40, chartWidth / (numGroups * 5));
    const groupWidth = barWidth * 4 + 10;
    const spacing = (chartWidth - numGroups * groupWidth) / (numGroups - 1);

    const maxValue = Math.max(
        ...parsedData.flatMap((d) => [
            d.highest_roll,
            d.highest_bonus_sum,
            d.highest_total,
            d.most_bonus_types,
        ]),
    );

    const scaleY = chartHeight / (Math.ceil(maxValue / 5) * 5);
    const baseY = margin.top + chartHeight;

    let bars = '';
    parsedData.forEach((d, i) => {
        const groupX = margin.left + i * (groupWidth + spacing);
        const values = [
            {
                key: 'Roll',
                val: d.highest_roll,
                desc: d.highest_roll_description,
                color: statColours.roll,
            },
            {
                key: 'Bonus',
                val: d.highest_bonus_sum,
                desc: d.highest_bonus_sum_description,
                color: statColours.bonus,
            },
            {
                key: 'Total',
                val: d.highest_total,
                desc: d.highest_total_description,
                color: statColours.total,
            },
            {
                key: 'Bonuses',
                val: d.most_bonus_types,
                desc: d.most_bonus_types_description,
                color: statColours.bonuses,
            },
        ];

        values.forEach((v, j) => {
            const x = groupX + j * (barWidth + 5);
            const barHeight = v.val * scaleY;
            bars += `
        <rect x="${x}" y="${baseY - barHeight}" width="${barWidth}" height="${barHeight}" fill="${v.color}" rx="3"/>
        <title>${d.charactername}: ${v.key} = ${v.val}${v.desc ? ` – ${v.desc}` : ''}</title>
      `;
        });

        // Character label
        bars += `
      <text x="${groupX + (barWidth * 4) / 2}" y="${baseY + 20}" fill="white" font-size="12" text-anchor="middle">${d.charactername}</text>
      <text x="${groupX + (barWidth * 4) / 2}" y="${baseY + 35}" fill="#aaa" font-size="10" text-anchor="middle">(${d.rolls_with_benny} bennies)</text>
    `;
    });

    // Simple Y-axis ticks and grid lines
    const tickInterval = 5;
    const numTicks = Math.ceil(maxValue / tickInterval);
    let yAxis = '';
    let grid = '';
    for (let i = 0; i <= numTicks; i++) {
        const val = i * tickInterval;
        const y = margin.top + chartHeight - val * scaleY;
        grid += `<line x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" stroke="#333"/>`;
        yAxis += `
      <line x1="${margin.left - 5}" y1="${y}" x2="${margin.left}" y2="${y}" stroke="white"/>
      <text x="${margin.left - 10}" y="${y + 4}" fill="white" font-size="12" text-anchor="end">${val}</text>
    `;
    }

    // Legend
    const legendItems = [
        { label: 'Highest Roll', color: statColours.roll },
        { label: 'Highest Bonus Sum', color: statColours.bonus },
        { label: 'Highest Total', color: statColours.total },
        { label: 'Most Bonus Types', color: statColours.bonuses },
    ];

    const legendY = height - 30;
    let legend = '';
    let currentX = (width - legendItems.length * 150) / 2;
    legendItems.forEach((item) => {
        legend += `
      <rect x="${currentX}" y="${legendY}" width="15" height="15" fill="${item.color}" rx="2"/>
      <text x="${currentX + 20}" y="${legendY + 12}" fill="white" font-size="12">${item.label}</text>
    `;
        currentX += 150;
    });

    // Final SVG output
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @font-face {
          font-family: 'MyFont';
          src: url('data:${fontMime};base64,${base64Font}') format('opentype');
        }
        text { font-family: 'MyFont'; }
      </style>
      <rect width="100%" height="100%" fill="black" />
      <g>${grid}</g>
      <g>${yAxis}</g>
      <g>${bars}</g>
      <g>${legend}</g>
    </svg>
  `;

    return svg;
};

export default skillCheckChart;
