import { HighLowStatisticsReport } from '../types';
import { colours } from './colours';
import { createSvg } from './svg';

const highLowChart = (data: HighLowStatisticsReport[]) => {
    const parsedData = data.map((d) => ({
        ...d,
        total_rolls: Number(d.total_rolls),
        successful_rolls: Number(d.successful_rolls),
        high_rolls: Number(d.high_rolls),
    }));

    const width = 800;
    const height = 500;
    const svg = createSvg(width, height);
    const gridLines = svg.ele('g');
    const yAxis = svg.ele('g');
    const bars = svg.ele('g');
    const legend = svg.ele('g');
    const margin = { top: 60, right: 30, bottom: 80, left: 60 };
    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;

    const statColours = {
        total: colours[0],
        success: colours[1],
        high: colours[2],
    };

    const numGroups = parsedData.length;
    const spacingRatio = 0.6;
    const maxGroupWidth = 60;
    const maxSpacing = maxGroupWidth * spacingRatio;
    const maxTotalWidth = numGroups * maxGroupWidth + (numGroups - 1) * maxSpacing;

    let groupWidth;
    if (maxTotalWidth <= chartWidth) {
        groupWidth = maxGroupWidth;
    } else {
        const scaledGroupWidth = chartWidth / (numGroups + spacingRatio * (numGroups - 1));
        groupWidth = scaledGroupWidth;
    }

    const totalBarWidth = groupWidth * 0.6;
    const subBarWidth = totalBarWidth * 0.6;

    const rawMax = Math.max(...parsedData.map((d) => d.total_rolls));
    const maxRolls = Math.ceil(rawMax / 5) * 5;
    const scaleY = chartHeight / maxRolls;

    const step = chartWidth / numGroups;

    parsedData.forEach((d, i) => {
        const groupX = margin.left + i * step + step / 2 - groupWidth / 2;
        const baseY = margin.top + chartHeight;

        const totalHeight = d.total_rolls * scaleY;
        const successHeight = d.successful_rolls * scaleY;
        const highHeight = d.high_rolls * scaleY;

        const totalX = groupX + (groupWidth - totalBarWidth) / 2;
        const successX = totalX - subBarWidth / 2;
        const highX = totalX + totalBarWidth - subBarWidth / 2;

        bars.ele('rect', {
            x: totalX,
            y: baseY - totalHeight,
            width: totalBarWidth,
            height: totalHeight,
            fill: statColours.total,
            rx: '4',
        });
        bars.ele('rect', {
            x: successX,
            y: baseY - successHeight,
            width: subBarWidth,
            height: successHeight,
            fill: statColours.success,
            rx: '3',
        });
        bars.ele('rect', {
            x: highX,
            y: baseY - highHeight,
            width: subBarWidth,
            height: highHeight,
            fill: statColours.high,
            rx: '3',
        });
        bars.ele('text', {
            x: groupX + groupWidth / 2,
            y: baseY + 15,
            fill: 'white',
            'font-size': '12',
            'text-anchor': 'middle',
        }).txt(`${d.most_common_charactername}`);
    });

    const tickInterval = 5;
    const numTicks = maxRolls / tickInterval;

    for (let i = 0; i <= numTicks; i++) {
        const val = i * tickInterval;
        const y = margin.top + chartHeight - val * scaleY;

        yAxis.ele('line', {
            x1: margin.left - 5,
            y1: y,
            x2: margin.left,
            y2: y,
            stroke: 'white',
            'stroke-width': '1',
        });
        yAxis
            .ele('text', {
                x: margin.left - 10,
                y: y + 4,
                fill: 'white',
                'font-size': '12',
                'text-anchor': 'end',
            })
            .txt(`${val}`);

        gridLines.ele('line', {
            x1: margin.left,
            y1: y,
            x2: width - margin.right,
            y2: y,
            stroke: '#333',
            'stroke-width': '1',
        });
    }

    const legendItems = [
        { label: 'Total Rolls', colour: statColours.total },
        { label: 'Successful Rolls', colour: statColours.success },
        { label: 'High Rolls', colour: statColours.high },
    ];

    const legendY = height - 30;
    const legendSpacing = 30; // space between entries
    const labelFontSize = 12;

    // Estimate widths based on text lengths (simple approximation)
    const labelWidths = legendItems.map((item) => 15 + 5 + item.label.length * 7); // box + gap + text
    const totalLegendWidth =
        labelWidths.reduce((a, b) => a + b, 0) + legendSpacing * (legendItems.length - 1);

    const legendStartX = (width - totalLegendWidth) / 2;

    let currentX = legendStartX;

    legendItems.forEach((item, i) => {
        legend.ele('rect', {
            x: currentX,
            y: legendY,
            width: '15',
            height: '15',
            fill: item.colour,
            rx: '2',
        });
        legend
            .ele('text', {
                x: currentX + 20,
                y: legendY + 12,
                fill: 'white',
                'font-size': labelFontSize,
            })
            .txt(`${item.label}`);
        currentX += labelWidths[i] + legendSpacing;
    });

    return svg.end({ headless: true });
};

export default highLowChart;
