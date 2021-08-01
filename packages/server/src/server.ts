import express from 'express';
import cors from 'cors';
import discord from './discord';
import d6 from './util/d6';
import { getAllUsers, getUserByCode, addOrUpdateUser } from './store/db';
import { SkillCheckRequestBody, SkillCheckResponseBody, SkillCheckBonus, DiceRollBonus } from './types';
import sendDiscordMessage from './discord/send-message';

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

const supportedDice = ['1d6', '2d6'];

// TODO say what character this is for too!
app.post('/api/roll/:id/:code', async (req, res) => {
	const requestBody = req.body;
	console.log('request body', JSON.stringify(requestBody, undefined, 2));

	// Get User
	const user = await getUserByCode(req.params.code);
	if (!user || user.userId !== req.params.id) {
		return res.sendStatus(401);
	}

	// Get Character
	const { characterId } = req.body;
	const character = user.characters.find(c => c.id === characterId);
	const rollFor = {
		name: character?.name || user.nickname || user.userTag,
		avatar: 'http://placekitten.com/120/120', // TODO use character avatar
	};

	// Calculate result
	const { dice, high, bonuses = [], description } = req.body as SkillCheckRequestBody;
	// console.log(req.body);
	if (!supportedDice.includes(dice)) return res.sendStatus(400);
	const rolls: DiceRollBonus['rolls'] = [d6(), d6()];
	const diceResult: SkillCheckBonus =
		dice === '1d6'
			? { name: 'Roll', value: rolls[0], rolls: rolls }
			: {
					name: `Roll (${rolls[0]} + ${rolls[1]})`,
					value: rolls[0] + rolls[1],
					rolls: rolls,
			  };
	let success;
	if (typeof high !== 'undefined') {
		success = false;
		if (high && rolls[0] >= 4) success = true;
		if (!high && rolls[0] <= 3) success = true;
	}
	const results = [diceResult, ...bonuses];
	const total = results.reduce((acc, cur) => {
		return acc + +cur.value;
	}, 0);

	// Compile the result
	const response: SkillCheckResponseBody = { results, total, success, description, rollFor, diceResult };
	sendDiscordMessage(user, response);
	res.json(response);
});

app.listen(port, () => {
	console.log(`PDQ listening at http://localhost:${port}`);
});
