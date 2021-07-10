import { User } from '../types';
import sqlite3 from 'sqlite3';
const sqlite3init = sqlite3.verbose();

const DB_PATH = process.env.DB_PATH;
if (!DB_PATH) {
	throw new Error('DB_PATH is not set. Aborting');
}
const db = new sqlite3init.Database(DB_PATH);

db.serialize(function () {
	db.run(`CREATE TABLE IF NOT EXISTS user_data (
		userId VARCHAR(40),
		code VARCHAR(100),
		data TEXT
	)`);
});

export const getUserById = (userId: User['userId']): Promise<User | undefined> => {
	console.log('getUserById');
	return new Promise((res, rej) => {
		db.serialize(function () {
			db.get('SELECT data FROM user_data WHERE userId=?', [userId], (err, row) => {
				if (err) {
					console.log('Rejecting due to error', err);
					rej(err);
				} else if (!row) {
					res(undefined);
				} else {
					console.log({ row });
					res(JSON.parse(row.data));
				}
			});
		});
	});
};

export const getUserByCode = (code: User['code']): Promise<User | undefined> => {
	console.log('getUserByCode');
	return new Promise((res, rej) => {
		db.serialize(function () {
			db.get('SELECT data FROM user_data WHERE code=?', [code], (err, row) => {
				if (err) {
					console.log('Rejecting due to error', err);
					rej(err);
				} else if (!row) {
					res(undefined);
				} else {
					console.log({ row });
					res(JSON.parse(row.data));
				}
			});
		});
	});
};

export const getAllUsers = (): Promise<User[]> => {
	console.log('getAllUsers');
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
	console.log('addOrUpdateUser');
	return new Promise(async (res, rej) => {
		const user = await getUserById(userId);
		db.serialize(function () {
			const callback = function (err: Error) {
				if (err) rej(err);
				else res(this);
			};
			if (user) {
				if (user.code !== code) { 
					throw new Error("Attempt to update user with improper code");
				}
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
