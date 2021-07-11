import React, { useEffect } from 'react';
import { Intent, Spinner, Callout, H1 } from '@blueprintjs/core';
import axios from 'axios';
import useQuery from '../hooks/use-query';
import { useHistory } from 'react-router-dom';
import { set as setUser, selectUser } from '../data/user-slice';
import { useSelector, useDispatch } from 'react-redux';

const Login = () => {
	const query = useQuery();
	const history = useHistory();
	const code = query.get('code');
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	useEffect(() => {
		if (!code) {
			dispatch(setUser(new Error("You don't seem to have provided a login code. Try logging in using Discord again.")));
			return;
		} else if (!user) {
			(async () => {
				try {
					const API_URL = process.env.API_URL;
					const url = `${API_URL}user/${code}`;
					const response = await axios.get(url);
					const user = response.data;
					if (user) {
						dispatch(setUser(user));
					} else {
						setUser(
							new Error(
								"The code you provided doesn't match our records. It might be out of date. Try logging in using Discord again."
							)
						);
					}
				} catch {
					dispatch(setUser(new Error('There was an unexpected error. Try logging in using Discord again.')));
				}
			})();
		} else if (!(user instanceof Error)) {
			setTimeout(() => {
				history.push('/dashboard');
			}, 2000);
		}
	}, [user, code]);

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
			<div className="v-center">
				<main className="tiny">
					<H1>PDQ Dice</H1>
					<Callout intent={Intent.SUCCESS} title="Login successful">
						<p>Welcome {user.nickname || user.userTag}</p>
						<img src={user.avatar} height={128} width={128} />
						<p>Transferring you to your dashboard…</p>
					</Callout>
				</main>
			</div>
		);
	}

	return (
		<div className="v-center">
			<main className="tiny">
				<H1>PDQ Dice</H1>
				<p>Trying to log you in</p>
				<Spinner intent={Intent.PRIMARY} />
			</main>{' '}
		</div>
	);
};

export default Login;
