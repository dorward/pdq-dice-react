import discord, { TextChannel } from 'discord.js';
import login from './login';

const config = {
	FRONTEND_URL: process.env.FRONTEND_URL,
	API_URL: process.env.API_URL,
	token: process.env.TOKEN,
	db_path: process.env.DB_PATH,
};

console.log({ config });

const client = new discord.Client();

client.on('ready', () => {
	void client.user.setPresence({
		status: 'online',
		activity: {
			name: 'Legends Walk',
			type: 'PLAYING',
		},
	});
});

client.on('message', msg => {
	const { content, channel, member } = msg;
	if (!(channel instanceof TextChannel) || content !== 'login') {
		return;
	}
	const code = login({ channel, member });
	if (code) {
		void msg.author.send(`Login at ${config.FRONTEND_URL}login?code=${code}`);
	}
});

void client.login(config.token);

export default client;
