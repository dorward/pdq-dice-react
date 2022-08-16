import { ActivityType, Client, GatewayIntentBits, TextChannel } from 'discord.js';

import login from './login';

const config = {
    FRONTEND_URL: process.env.FRONTEND_URL,
    API_URL: process.env.API_URL,
    token: process.env.TOKEN,
    db_path: process.env.DB_PATH,
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
});

if (!client) {
    throw new Error('Could not connect to Discord');
}

client.once('ready', () => {
    if (!client.user) {
        throw new Error('Could not establish a user');
    }

    console.log('Ready!');

    void client.user.setPresence({
        status: 'online',
        activities: [
            {
                name: 'Legends Walk',
                type: ActivityType.Playing,
            },
        ],
    });
});

client.on('messageCreate', (msg) => {
    const { content, channel, member } = msg;
    if (!(channel instanceof TextChannel) || content !== 'login') {
        return;
    }
    if (!member) {
        console.error('Missing member');
        return;
    }

    const code = login({ channel, member });
    if (code) {
        void msg.author.send(`Login at ${config.FRONTEND_URL}login?code=${code}`);
    }
});

void client.login(config.token);

export default client;
