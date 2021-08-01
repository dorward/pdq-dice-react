import discord, { TextChannel, Channel } from 'discord.js';
import { SkillCheckResponseBody, User } from '../types';
import client from './';
import dice from './dice';

const isTextChannel = (channel: Channel): channel is TextChannel => channel?.type === 'text';

const successToColor = (success: boolean | undefined) => {
	if (typeof success === 'undefined') return '#FFFF00';
	if (success) return '#76B947';
	return '#FF2511';
};

const sendDiscordMessage = async (user: User, response: SkillCheckResponseBody) => {
	const index = response.diceResult.rolls.join('') as keyof typeof dice;
	const thumbnail = dice[index];

	const { success } = response;
	console.log({ index, thumbnail, success });

	const embed = new discord.MessageEmbed()
		.setColor(successToColor(success))
		.setTitle(response.description || 'Skill check')
		.setAuthor(response.rollFor.name, response.rollFor.avatar)
		.setThumbnail(thumbnail);

	response.results.forEach(result => embed.addFields(result));

	if (response.diceResult.rolls.length === 2) embed.addFields({ name: 'Total', value: response.total, inline: false });

	if (typeof success !== 'undefined') {
		embed.addFields({ name: 'Success', value: success ? 'Yes' : 'No', inline: false });
	}
	embed.setFooter('⚀ ⚁ ⚂ ⚃ ⚄ ⚅ '.repeat(5)); // Padding
	embed.setTimestamp();
	const channel = await client.channels.fetch(user.channel.id);
	if (isTextChannel(channel)) channel.send(embed);
};

export default sendDiscordMessage;
