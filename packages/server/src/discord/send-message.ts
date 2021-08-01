import discord, { TextChannel, Channel } from 'discord.js';
import { SkillCheckResponseBody, User } from '../types';
import client from './';
import dice from './dice';

const isTextChannel = (channel: Channel): channel is TextChannel => channel?.type === 'text';

const sendDiscordMessage = async (user: User, response: SkillCheckResponseBody) => {
	const index = response.diceResult.rolls.join('') as keyof typeof dice;
	const thumbnail = dice[index];

	const embed = new discord.MessageEmbed()
		.setColor('#006600')
		.setTitle(response.description || 'Skill check')
		.setAuthor(response.rollFor.name, response.rollFor.avatar)
		.setDescription(response.description || `Just some roll`)
		.setThumbnail(thumbnail);

	response.results.forEach(result => embed.addFields(result));

	embed.addFields({ name: 'Total', value: response.total, inline: false });
	embed.setFooter('⚀ ⚁ ⚂ ⚃ ⚄ ⚅ '.repeat(5)); // Padding
	embed.setTimestamp();
	const channel = await client.channels.fetch(user.channel.id);
	if (isTextChannel(channel)) channel.send(embed);
};

export default sendDiscordMessage;
