import { SkillCheckStatisticsReport } from '../types';
import { colours } from './colours';
import { createSvg } from './svg';

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
    const svg = createSvg(width, height);
    const grid = svg.ele('g');
    const yAxis = svg.ele('g');
    const bars = svg.ele('g');
    const legend = svg.ele('g');
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
    const spacing = numGroups > 1 ? (chartWidth - numGroups * groupWidth) / (numGroups - 1) : 0;

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

    parsedData.forEach((d, i) => {
        const groupX =
            margin.left +
            (numGroups === 1 ? (chartWidth - groupWidth) / 2 : i * (groupWidth + spacing));
        const values = [
            {
                key: 'Roll',
                val: d.highest_roll,
                desc: d.highest_roll_description,
                colour: statColours.roll,
            },
            {
                key: 'Bonus',
                val: d.highest_bonus_sum,
                desc: d.highest_bonus_sum_description,
                colour: statColours.bonus,
            },
            {
                key: 'Total',
                val: d.highest_total,
                desc: d.highest_total_description,
                colour: statColours.total,
            },
            {
                key: 'Bonuses',
                val: d.most_bonus_types,
                desc: d.most_bonus_types_description,
                colour: statColours.bonuses,
            },
        ];

        values.forEach((v, j) => {
            const x = groupX + j * (barWidth + 5);
            const barHeight = v.val * scaleY;
            bars.ele('rect', {
                x: x,
                y: baseY - barHeight,
                width: barWidth,
                height: barHeight,
                fill: v.colour,
                rx: '3',
            });
            bars.ele('title').txt(
                `${d.charactername}: ${v.key} = ${v.val}${v.desc ? ` – ${v.desc}` : ''}`,
            );
        });

        // Character label
        bars.ele('text', {
            x: groupX + (barWidth * 4) / 2,
            y: baseY + 20,
            fill: 'white',
            'font-size': '12',
            'text-anchor': 'middle',
        }).txt(`${d.charactername}`);
        bars.ele('text', {
            x: groupX + (barWidth * 4) / 2,
            y: baseY + 35,
            fill: '#aaa',
            'font-size': '10',
            'text-anchor': 'middle',
        }).txt(`(${d.rolls_with_benny} bennies)`);
    });

    // Simple Y-axis ticks and grid lines
    const tickInterval = 5;
    const numTicks = Math.ceil(maxValue / tickInterval);
    for (let i = 0; i <= numTicks; i++) {
        const val = i * tickInterval;
        const y = margin.top + chartHeight - val * scaleY;
        grid.ele('line', {
            x1: margin.left,
            y1: y,
            x2: width - margin.right,
            y2: y,
            stroke: '#333',
        });
        yAxis.ele('line', {
            x1: margin.left - 5,
            y1: y,
            x2: margin.left,
            y2: y,
            stroke: 'white',
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
    }

    // Legend
    const legendItems = [
        { label: 'Highest Roll', colour: statColours.roll },
        { label: 'Highest Bonus Sum', colour: statColours.bonus },
        { label: 'Highest Total', colour: statColours.total },
        { label: 'Most Bonus Types', colour: statColours.bonuses },
    ];

    const legendY = height - 30;
    let currentX = (width - legendItems.length * 150) / 2;
    legendItems.forEach((item) => {
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
                'font-size': '12',
            })
            .txt(`${item.label}`);
        currentX += 150;
    });

    return svg.end({ headless: true });
};

export default skillCheckChart;
