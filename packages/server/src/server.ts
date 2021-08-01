import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

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

app.use('/', express.static(process.env.DIST_PATH));
app.use('/avatars', express.static(process.env.AVATAR_PATH));

const splitDataUrl = /^data:.+\/(.+);base64,(.*)$/;

app.post('/api/user/:id/:code/avatar', express.json({ limit: '10MB' }), async (req, res) => {
	console.log('Trying to update user avatar');
	const userId = req.params.id;
	const code = req.params.code;
	const { characterId, image } = req.body;

	var matches = image.match(splitDataUrl);
	var ext = matches[1];
	var data = matches[2];
	var buffer = Buffer.from(data, 'base64');

	const filename = `${uuidv4()}.${ext}`;
	const path = `${process.env.AVATAR_PATH.replace(/\/$/, '')}/${filename}`;
	const url = `${process.env.AVATAR_URL.replace(/\/$/, '')}/${filename}`;
	const response = { test: true, userId, code, characterId, image, url };
	console.log(response);
	fs.writeFileSync(path, buffer);
	res.json(response);
	console.log('DONE');
});

app.use(express.json());

app.get('/', (req, res) => {
	res.json({ hello: 'world' });
});

app.get('/api/user/:code', async (req, res) => {
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

app.post('/api/roll/:id/:code', async (req, res) => {
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
		avatar: character?.avatar ?? user.avatar,
	};

	// Calculate result
	const { dice, high, bonuses = [], description, rollType } = req.body as SkillCheckRequestBody;
	// console.log(req.body);
	if (!supportedDice.includes(dice)) return res.sendStatus(400);
	const rolls: DiceRollBonus['rolls'] = dice === '1d6' ? [d6()] : [d6(), d6()];
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
	const response: SkillCheckResponseBody = { results, total, success, description, rollFor, rollType, diceResult };
	sendDiscordMessage(user, response);
	res.json(response);
});

app.get('*', (req, res) => {
	res.sendFile(`${process.env.DIST_PATH}/index.html`);
});

app.listen(port, () => {
	console.log(`PDQ listening at http://localhost:${port}`);
});
