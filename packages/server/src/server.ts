import express from 'express';
import cors from 'cors';
import discord from './discord';

import { User } from './types';
import { getAllUsers, getUserByCode } from './store/db';

discord.on('ready', () => {
	console.log(`Logged in as ${discord.user.tag}!`);
});

const app = express();
const port = 3000;
app.use(
	cors({
		origin: process.env.FRONTEND_URL.replace(/\/$/, ''),
	})
);

app.get('/', (req, res) => {
	res.json({ hello: 'world' });
});

app.get('/api/user/:code', async (req, res) => {
	// const channel = bot.channels.get("ID");
	try {
		const user = await getUserByCode(req.params.code);
		res.json(user);
	} catch {
		res.sendStatus(500);
	}
});

app.get('/api/allUsers', async (req, res) => {
	// const channel = bot.channels.get("ID");
	const users = await getAllUsers();
	res.json({ users });
});

app.listen(port, () => {
	console.log(`PDQ listening at http://localhost:${port}`);
});
