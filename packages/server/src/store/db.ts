import { User } from '../types';
import sqlite3 from 'sqlite3';
const sqlite3init = sqlite3.verbose();

const db = new sqlite3init.Database(process.env.DB_PATH);

db.serialize(function () {
	db.run(`CREATE TABLE IF NOT EXISTS user_data (
		userId VARCHAR(40),
		code VARCHAR(100),
		data TEXT
	)`);
});

export const getUserById = (userId: User['userId']) => {
	return new Promise((res, rej) => {
		db.serialize(function () {
			db.get('SELECT * FROM user_data WHERE userId=?', [userId], (err, row) => {
				if (err) rej(err);
				else res(row);
			});
		});
	});
};

export const getUserByCode = (code: User['code']) => {
	return new Promise((res, rej) => {
		db.serialize(function () {
			db.get('SELECT * FROM user_data WHERE code=?', [code], (err, row) => {
				if (err) rej(err);
				else res(row);
			});
		});
	});
};

export const getAllUsers = (): Promise<User[]> => {
	return new Promise((res, rej) => {
		db.serialize(function () {
			db.all('SELECT data FROM user_data', (err, rows) => {
				if (err) {
					rej(err);
				} else res(rows.map(row => JSON.parse(row.data)));
			});
		});
	});
};

export const addOrUpdateUser = (userId: string, code: string, data: User) => {
	return new Promise(async (res, rej) => {
		const user = await getUserById(userId);
		db.serialize(function () {
			const callback = function (err: Error) {
				if (err) rej(err);
				else res(this);
			};
			if (user) {
				db.run(
					'UPDATE user_data SET code=?, data=json(?) WHERE userId=?',
					[code, JSON.stringify(data), userId],
					callback
				);
			} else {
				db.run('INSERT INTO user_data VALUES(?, ?, json(?))', [userId, code, JSON.stringify(data)], callback);
			}
		});
	});
};
