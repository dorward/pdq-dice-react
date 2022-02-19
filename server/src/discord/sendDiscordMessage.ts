import {
    AnyChannel,
    EmbedAuthorData,
    EmbedFieldData,
    MessageEmbed,
    TextChannel,
} from 'discord.js';

import client from '.';
import { SkillCheckResponseBody, User } from '../types';
import dice from './dice';

const isTextChannel = (channel: AnyChannel | null): channel is TextChannel =>
    channel?.type === 'GUILD_TEXT';

const successToColor = (success: boolean | undefined) => {
    if (typeof success === 'undefined') return '#FFFF00';
    if (success) return '#76B947';
    return '#FF2511';
};

const footer = { text: '⚀ ⚁ ⚂ ⚃ ⚄ ⚅ '.repeat(5) };

const sendDiscordMessage = async (user: User, response: SkillCheckResponseBody) => {
    const index = response.diceResult.rolls.join('') as keyof typeof dice;
    const thumbnail = dice[index];

    const { success } = response;

    const author: EmbedAuthorData = {
        name: response.rollFor.name,
        iconURL: response.rollFor.avatar ?? user.avatar ?? undefined,
    };

    const embed = new MessageEmbed()
        .setColor(successToColor(success))
        .setTitle(response.rollType)
        .setDescription(response.description ?? 'Just some roll')
        .setAuthor(author)
        .setThumbnail(thumbnail);

    const embeds: EmbedFieldData[] = response.results.map((result) => {
        const { name, value } = result;
        return { name, value: `${value}` };
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
