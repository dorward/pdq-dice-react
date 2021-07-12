import express from 'express';
import cors from 'cors';
import discord from './discord';
import d6 from './util/d6';
import { getAllUsers, getUserByCode, addOrUpdateUser } from './store/db';

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

app.use(express.json());

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

app.post('/api/user/:id/:code', async (req, res) => {
	console.log('Trying to update user');
	try {
		await addOrUpdateUser(req.params.id, req.params.code, req.body);
	} catch (e) {
		if (e.message === 'Attempt to update user with improper code') {
			return res.sendStatus(401);
		}
		console.log(e);
		res.sendStatus(500);
	}
});

app.get('/api/allUsers', async (req, res) => {
	const users = await getAllUsers();
	res.json({ users });
});

// TODO say what character this is for too!
app.post('/api/roll/:id/:code/d6', async (req, res) => {
	const user = await getUserByCode(req.params.code);
	if (!user || user.userId !== req.params.id) {
		return res.sendStatus(401);
	}
	const result = d6();
	res.json({ result });
});

app.listen(port, () => {
	console.log(`PDQ listening at http://localhost:${port}`);
});
