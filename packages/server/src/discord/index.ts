import discord, { TextChannel } from 'discord.js';
import login from './login';

const config = {
	client_url: process.env.CLIENT_URL,
	base_url: process.env.BASE_URL,
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
	console.log({ content });
	const code = login({ channel, member });
	if (code) {
		void msg.author.send(`Your login code is ${code} enter it at ${config.base_url}/login?code=${code}`);
	}
});

void client.login(config.token);

export default client;
