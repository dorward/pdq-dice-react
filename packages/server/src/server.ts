import express from 'express';
import cors from 'cors';
import discord from './discord';

import { User } from './types';
import { getAllUsers } from './store/db';

discord.on('ready', () => {
	console.log(`Logged in as ${discord.user.tag}!`);
});

const app = express();
const port = 3000;
app.use(
	cors({
		origin: 'http://localhost:1234', // We only need CORS in development as in production the app will be served from the same origin
	})
);

const example: User = {
	avatar: 'ASD',
	characters: [],
	code: 'asdf',
	nickname: 'asdf',
	userId: 'asdf',
	userTag: 'asdf',
	channel: {
		id: 'a',
		name: 'a',
		guild: 'a',
		avatar: 'a',
	},
};

app.get('/', (req, res) => {
	res.json(example);
});

app.get('/api/allUsers', async (req, res) => {
	// const channel = bot.channels.get("ID");
	const users = await getAllUsers();
	res.json({ users });
});

app.listen(port, () => {
	console.log(`PDQ listening at http://localhost:${port}`);
});
