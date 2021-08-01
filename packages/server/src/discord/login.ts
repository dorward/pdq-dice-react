import { GuildMember, TextChannel, ImageURLOptions } from 'discord.js';
import store from '../store';
import { v4 as uuidv4 } from 'uuid';

type LoginArgs = {
	member: GuildMember;
	channel: TextChannel;
};

const imageOptions: ImageURLOptions = { format: 'png', size: 128 };

const login = ({ channel, member }: LoginArgs): string => {
	if (!channel) return;
	if (!member) return;
	const userId = member.user.id;
	const userTag = member.user.tag;
	const { nickname } = member;
	const avatar = member.user.avatarURL(imageOptions); //`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.jpeg`;
	const code = uuidv4();
	const serializableChannel = {
		id: channel.id,
		name: channel.name,
		guild: channel.guild.name,
		avatar: channel.guild.iconURL(imageOptions),
	};
	store.addOrUpdateUser(
		{
			avatar,
			channel: serializableChannel,
			code,
			nickname,
			userId,
			userTag,
		},
		true
	);
	return code;
};

export default login;
