import { expect, test } from 'vitest';
import { create } from 'xmlbuilder2';
import sharp from 'sharp';
import highLowChart from '../src/charts/highLowChart';
import skillCheckChart from '../src/charts/skillCheckChart';
import type { HighLowStatisticsReport, SkillCheckStatisticsReport } from '../src/types';

const name = `Sword & Shield <Mage> "quoted" 'apostrophe' </text><script>test</script>`;
const description = `Compare A < B & C > D; </title><script>test</script> ]]>`;
const highLow: HighLowStatisticsReport = {
    userid: 'user',
    most_common_charactername: name,
    total_rolls: '10',
    successful_rolls: '6',
    high_rolls: '7',
};
const skill: SkillCheckStatisticsReport = {
    userid: 'user',
    charactername: name,
    highest_roll: 8,
    highest_roll_description: description,
    highest_bonus_sum: 3,
    highest_bonus_sum_description: description,
    highest_total: 11,
    highest_total_description: description,
    most_bonus_types: 2,
    most_bonus_types_description: description,
    rolls_with_benny: 1,
};

test('high/low charts preserve XML characters as text and render as PNG', async () => {
    const svg = highLowChart([highLow]);
    expect(create(svg).root().node.textContent).toContain(name);
    expect(svg).not.toContain('<script>');
    const { info } = await sharp(Buffer.from(svg)).png().toBuffer({ resolveWithObject: true });
    expect(info).toMatchObject({ format: 'png', width: 800, height: 500 });
});

test('skill charts preserve names and all descriptions as text and render as PNG', async () => {
    const svg = skillCheckChart([
        skill,
        { ...skill, userid: 'second', charactername: 'Second hero' },
    ]);
    const content = create(svg).root().node.textContent;
    expect(content).toContain(name);
    expect(content?.split(description)).toHaveLength(9);
    expect(svg).not.toContain('<script>');
    const { info } = await sharp(Buffer.from(svg)).png().toBuffer({ resolveWithObject: true });
    expect(info).toMatchObject({ format: 'png', width: 900, height: 500 });
});

test('a single character produces visible, centred skill bars with finite coordinates', async () => {
    const svg = skillCheckChart([skill]);
    expect(svg).not.toMatch(/NaN|Infinity/);
    const rects = create(svg)
        .root()
        .filter((node) => node.node.nodeName === 'rect', false, true);
    // Skip the background; the next four rectangles are the character's bars.
    const bars = rects
        .slice(1, 5)
        .map(
            (node) => node.node as unknown as { getAttribute: (name: string) => string | null },
        );
    expect(bars).toHaveLength(4);
    const left = Number(bars[0].getAttribute('x'));
    const right = Number(bars[3].getAttribute('x')) + Number(bars[3].getAttribute('width'));
    expect(left).toBeGreaterThan(70);
    expect(right).toBeLessThan(860);
    expect(Math.abs((left + right) / 2 - (70 + 860) / 2)).toBeLessThan(5);
    for (const bar of bars) {
        expect(Number(bar.getAttribute('height'))).toBeGreaterThan(0);
    }
    const { info } = await sharp(Buffer.from(svg)).png().toBuffer({ resolveWithObject: true });
    expect(info).toMatchObject({ format: 'png', width: 900, height: 500 });
});
