import { Channel, ChannelType, EmbedAuthorData, EmbedBuilder, TextChannel } from 'discord.js';
import a from 'indefinite';
import client from '.';
import {
    BennyRollResponseBody,
    ExpendResponseBody,
    SkillCheckResponseBody,
    User,
} from '../types';
import dice from './dice';

const isTextChannel = (channel: Channel | null): channel is TextChannel =>
    channel?.type === ChannelType.GuildText;

const COLOR_NEUTRAL = '#FFFF00';
const COLOR_POSITIVE = '#76B947';
const COLOR_NEGATIVE = '#FF2511';

const successToColor = (success: boolean | undefined) => {
    if (typeof success === 'undefined') return COLOR_NEUTRAL;
    if (success) return COLOR_POSITIVE;
    return COLOR_NEGATIVE;
};

const resultIndicator = (success: boolean | undefined, total: number) => {
    if (typeof success === 'undefined') return total;
    if (success) return '👍';
    return '👎';
};

const footer = { text: '⚀ ⚁ ⚂ ⚃ ⚄ ⚅ '.repeat(5) };

export const sendDiscordExpendNotification = async (
    user: User,
    response: ExpendResponseBody,
) => {
    const author: EmbedAuthorData = {
        name: response.expendFor.name,
        iconURL: response.expendFor.avatar ?? user.avatar ?? undefined,
    };

    const embed = new EmbedBuilder()
        .setColor(COLOR_NEUTRAL)
        .setTitle('Expending!')
        .setDescription(
            `Using ${a(
                response.extraName
                    .split('')
                    .map((char, index) => (index ? char : char.toLowerCase()))
                    .join(''),
            )}`,
        )
        .setAuthor(author)
        .setTimestamp();

    const channel = await client.channels.fetch(user.channel.id);
    if (isTextChannel(channel)) channel.send({ embeds: [embed] });
};

export const sendBennyRollDiscordMessage = async (
    user: User,
    response: BennyRollResponseBody,
) => {
    const index = response.diceResult.join('') as keyof typeof dice;
    const thumbnail = dice[index];
    const author: EmbedAuthorData = {
        name: response.rollFor.name,
        iconURL: response.rollFor.avatar ?? user.avatar ?? undefined,
    };

    const embed = new EmbedBuilder()
        .setTitle('Reset Bennies')
        .setDescription(`${response.total} bennies`)
        .setAuthor(author);

    if (thumbnail) {
        embed.setThumbnail(thumbnail);
    }

    embed.setFooter(footer);
    embed.setTimestamp();
    const channel = await client.channels.fetch(user.channel.id);
    if (isTextChannel(channel)) channel.send({ embeds: [embed] });
};

const sendDiscordMessage = async (user: User, response: SkillCheckResponseBody) => {
    const index = response.diceResult.rolls.join('') as keyof typeof dice;
    const thumbnail = dice[index];

    const { success } = response;

    const author: EmbedAuthorData = {
        name: response.rollFor.name,
        iconURL: response.rollFor.avatar ?? user.avatar ?? undefined,
    };

    const embed = new EmbedBuilder()
        .setColor(successToColor(success))
        .setTitle(response.rollType)
        .setDescription(
            `${response.description || 'Just some roll'} (${resultIndicator(
                success,
                response.total,
            )})`,
        )
        .setAuthor(author)
        .setThumbnail(thumbnail);

    const embeds = response.results.map((result) => {
        const { name, value } = result;
        return { name: name || '-', value: `${value}` || '-' };
    });

    embed.addFields(embeds);

    if (response.diceResult.rolls.length === 2)
        embed.addFields({ name: 'Total', value: `${response.total}`, inline: false });

    if (typeof success !== 'undefined') {
        embed.addFields({ name: 'Success', value: success ? 'Yes' : 'No', inline: false });
    }
    embed.setFooter(footer);
    embed.setTimestamp();
    const channel = await client.channels.fetch(user.channel.id);
    if (isTextChannel(channel)) channel.send({ embeds: [embed] });
};

export default sendDiscordMessage;
