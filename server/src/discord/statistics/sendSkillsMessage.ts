import { AttachmentBuilder, TextChannel } from 'discord.js';
import sharp from 'sharp';
import { AlignmentEnum, AsciiTable3 } from 'ascii-table3';
import skillCheckChart from '../../charts/skillCheckChart';
import { SkillCheckStatisticsReport } from '../../types';

const sendSkillCheckMessage = async (
    stats: SkillCheckStatisticsReport[] | string,
    label: string,
    channel: TextChannel,
) => {
    if (typeof stats === 'string') {
        await channel.send({
            content: `There was an error generating the ${label} report.`,
        });
        return;
    }

    // === Generate chart image ===
    const svg = skillCheckChart(stats);
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    const attachment = new AttachmentBuilder(pngBuffer, {
        name: 'skillCheck.png',
        description: 'Skill Check Statistics',
    });

    // === Flatten data for sorting by stat type ===
    type FlatRow = {
        statType: string;
        character: string;
        description: string | null;
        value: number | string;
    };

    const flatRows: FlatRow[] = [];

    stats.forEach((row) => {
        flatRows.push(
            {
                statType: 'Highest Roll',
                character: row.charactername,
                description: row.highest_roll_description,
                value: row.highest_roll,
            },
            {
                statType: 'Highest Bonus Sum',
                character: row.charactername,
                description: row.highest_bonus_sum_description,
                value: row.highest_bonus_sum,
            },
            {
                statType: 'Highest Total',
                character: row.charactername,
                description: row.highest_total_description,
                value: row.highest_total,
            },
            {
                statType: 'Most Bonus Types',
                character: row.charactername,
                description: row.most_bonus_types_description,
                value: row.most_bonus_types,
            },
            {
                statType: 'Benny Uses',
                character: row.charactername,
                description: null,
                value: row.rolls_with_benny,
            },
        );
    });

    // Sort alphabetically by stat type, then by character
    flatRows.sort((a, b) => {
        if (a.statType === b.statType) return a.character.localeCompare(b.character);
        return a.statType.localeCompare(b.statType);
    });

    // === Build ASCII table ===
    const table = new AsciiTable3(label)
        .setHeading('Stat Type', 'Character', 'Description', 'Value')
        .setAligns([
            AlignmentEnum.LEFT,
            AlignmentEnum.LEFT,
            AlignmentEnum.LEFT,
            AlignmentEnum.RIGHT,
        ])
        .addRowMatrix(
            flatRows.map((r) => [r.statType, r.character, r.description ?? '—', r.value]),
        );

    await channel.send({
        content: '```' + table + '```',
        files: [attachment],
    });
};

export default sendSkillCheckMessage;
