import { type Message, TextChannel } from 'discord.js';
import login from './login';
import getStatistics from '../model/getStatistics';
import { E_NO_SESSIONS } from '../errors';
import { sendStatisticsMessage } from './sendDiscordMessage';

// Discord's event emitter does not await listener promises. Handle every command
// failure here, including failures from nested database and message operations.
export const handleMessage = async (msg: Message) => {
    try {
        const { content, channel, member } = msg;
        if (!(channel instanceof TextChannel) || !['login', 'stats'].includes(content)) return;
        if (!member) {
            console.error('Missing member');
            return;
        }
        if (content === 'login') {
            const code = await login({ channel, member });
            if (code) {
                await msg.author.send(`Login at ${process.env.FRONTEND_URL}login?code=${code}

This token will remain valid until you refresh it by running the login command as well.

It will also be saved in your browser, so you can simply bookmark \`${process.env.FRONTEND_URL}\` and go directly to the app in future.`);
            }
            return;
        }
        const stats = await getStatistics();
        if (stats === E_NO_SESSIONS) return;
        await sendStatisticsMessage(channel, stats);
    } catch (error) {
        console.error('Discord command failed', error);
    }
};
