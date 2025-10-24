import { AttachmentBuilder, TextChannel } from 'discord.js';
import sharp from 'sharp';
import { AlignmentEnum, AsciiTable3 } from 'ascii-table3';
import highLowChart from '../../charts/highLowChart';
import { HighLowStatisticsReport } from '../../types';

const sendHighLowMessage = async (
    stats: HighLowStatisticsReport[] | string,
    label: string,
    channel: TextChannel,
) => {
    if (typeof stats === 'string') {
        channel.send({
            content: `There was an error generating the ${label} report`,
        });
        return;
    }
    const svg = highLowChart(stats);
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    const attachment = new AttachmentBuilder(pngBuffer, {
        name: 'highLow.png',
        description: 'Statistics',
    });

    const table = new AsciiTable3(label)
        .setHeading('Character', 'Rolls', 'Successful', '%', 'High', '%')
        .setAligns([
            AlignmentEnum.LEFT,
            AlignmentEnum.RIGHT,
            AlignmentEnum.RIGHT,
            AlignmentEnum.RIGHT,
            AlignmentEnum.RIGHT,
        ])
        .addRowMatrix(
            stats.map((row) => [
                row.most_common_charactername,
                row.total_rolls,
                `${row.successful_rolls}`,
                `${((100 * +row.successful_rolls) / +row.total_rolls).toFixed(0)}%`,
                `${row.high_rolls}`,
                `${((100 * +row.high_rolls) / +row.total_rolls).toFixed(0)}%`,
            ]),
        );

    channel.send({
        content: '```' + table + '```',
        files: [attachment],
    });
};

export default sendHighLowMessage;
