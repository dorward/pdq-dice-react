import { ActivityType, Client, GatewayIntentBits } from 'discord.js';

import { handleMessage } from './commands';

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

client.once('clientReady', () => {
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

client.on('messageCreate', handleMessage);

client.login(config.token).catch((error: unknown) => {
    console.error('Discord connection failed', error);
});

export default client;
