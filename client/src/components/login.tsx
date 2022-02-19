import { Callout, H1, Intent } from '@blueprintjs/core';
import { selectUser, set as setUser, setUserError, selectUserError } from '../data/user-slice';
import { setUserCreds } from '../data/whoami-slice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from './loading';
import React, { useEffect } from 'react';
import axios from 'axios';
import useQuery from '../hooks/use-query';
import useLocalStorage from 'use-local-storage';

const Login = () => {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const userError = useSelector(selectUserError);
	const query = useQuery();
	const navigate = useNavigate();

	const queryCode = query.get('code');
	const [savedCode, setCode] = useLocalStorage('code', '');
	const code = queryCode || savedCode;

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
						setCode(code);
						dispatch(setUser(user));
						dispatch(setUserCreds({ userId: user.userId, code: user.code }));
					} else {
						setCode('');
						setUser();
						setUserError(
							"The code you provided doesn't match our records. It might be out of date. Try logging in using Discord again."
						);
					}
				} catch (e) {
					console.error(e);
					dispatch(setUserError('There was an unexpected error. Try logging in using Discord again.'));
				}
			})();
		} else if (!(user instanceof Error)) {
			setTimeout(() => {
				navigate('/dashboard');
			}, 2000);
		}
	}, [user, code]);

	if (userError) {
		return (
			<main className="tiny">
				<H1>PDQ Dice</H1>
				<Callout intent={Intent.WARNING} title="Something went wrong">
					<p>{userError}</p>
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
				<p style={{ textAlign: 'center' }}>Trying to log you in</p>
				<Loading />
			</main>
		</div>
	);
};

export default Login;
