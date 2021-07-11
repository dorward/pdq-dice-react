import React from 'react';
import { Intent, Callout, H1 } from '@blueprintjs/core';
import { User } from '../types';
import UserMenu from './user-menu';
import Characters from './characters';
import GetStarted from './get-started';
import { selectUser } from '../data/user-slice';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Results from './results';

const Dashboard = () => {
	const { userTag, nickname, avatar, characters } = useSelector(selectUser) as User;

	return (
		<>
			<header>
				<H1>PDQ Dice</H1>
				<UserMenu {...{ userTag, nickname, avatar }} />
			</header>
			<main>{characters.length ? <Characters /> : <GetStarted />}</main>
			<Results />
		</>
	);
};

const ErrorCheckingDashboard = () => {
	const user = useSelector(selectUser);

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
		return <Dashboard />;
	}

	return <Redirect to="/" />;
};

export default ErrorCheckingDashboard;
