import React, { useState, useEffect } from 'react';
import { Intent, Spinner, Callout, H1 } from '@blueprintjs/core';
import axios from 'axios';
import useQuery from '../hooks/use-query';
import { useHistory } from 'react-router-dom';
import { User } from '../types';

/*
 *
 * Note to self:
 *
 *    Store the code in storage and refetch on the logged in page if it isn't in the local store already
 *
 */

const Login = () => {
	const [user, setUser] = useState<null | Error | User>(null);
	const query = useQuery();
	const history = useHistory();
	const code = query.get('code');

	useEffect(() => {
		if (!code) {
			setUser(new Error("You don't seem to have provided a login code. Try logging in using Discord again."));
			return;
		}
		(async () => {
			try {
				const API_URL = process.env.API_URL;
				console.log({ API_URL });
				const url = `${API_URL}user/${code}`;
				const response = await axios.get(url);
				const user = response.data;
				if (user) {
					setUser(user);
				} else {
					setUser(
						new Error(
							"The code you provided doesn't match our records. It might be out of date. Try logging in using Discord again."
						)
					);
				}
			} catch {
				setUser(new Error('There was an unexpected error. Try logging in using Discord again.'));
			}
		})();
	}, []);

	if (user instanceof Error) {
		return (
			<main className="tiny">
				<H1>PDQ Dice</H1>
				<Callout intent={Intent.WARNING} title="Something went wrong">
					<p>{user.message}</p>
				</Callout>
			</main>
		);
	}

	if (user) {
		return (
			<main className="tiny">
				<H1>PDQ Dice</H1>
				<Callout intent={Intent.SUCCESS} title="Login successful">
					<p>Welcome {user.nickname || user.userTag}</p>
					<img src={user.avatar} height={128} width={128} />
				</Callout>
			</main>
		);
	}

	return (
		<main className="tiny">
			<H1>PDQ Dice</H1>
			<p>Trying to log you in</p>
			<Spinner intent={Intent.PRIMARY} />
		</main>
	);
};

export default Login;
