import { ActivityType, Client, GatewayIntentBits, TextChannel } from 'discord.js';

import login from './login';
import getStatistics from '../model/getStatistics';
import { E_NO_SESSIONS } from '../errors';
import { sendStatisticsMessage } from './sendDiscordMessage';

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

const commands = ['login', '!stats'];

client.on('messageCreate', async (msg) => {
    const { content, channel, member } = msg;
    console.log({ content });
    if (!(channel instanceof TextChannel) || !commands.includes(content)) {
        return;
    }
    if (!member) {
        console.error('Missing member');
        return;
    }

    if (content.toLowerCase() === 'login') {
        const code = login({ channel, member });
        if (code) {
            void msg.author.send(`Login at ${config.FRONTEND_URL}login?code=${code}

This token will remain valid until you refresh it by running the login command as well.

It will also be saved in your browser, so you can simply bookmark \`${config.FRONTEND_URL}\` and go directly to the app in future.`);
        }
        return;
    }

    if (content.toLowerCase() === '!stats') {
        const stats = await getStatistics();
        console.dir({ stats }, { depth: 8 });
        if (stats === E_NO_SESSIONS) {
            console.log('Handle this error');
            return;
        }
        sendStatisticsMessage(channel, stats);
        return;
    }
});

void client.login(config.token);

export default client;
