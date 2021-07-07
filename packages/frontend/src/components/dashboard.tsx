import React, { useState, useEffect } from 'react';
import { Intent, Spinner, Callout, H1 } from '@blueprintjs/core';
import axios from 'axios';
import useQuery from '../hooks/use-query';
import { useHistory } from 'react-router-dom';
import { PossibleUser, User, UserData } from '../types';
import UserMenu from './user-menu';
import Characters from './characters';
import GetStarted from './get-started';
import { set as setUser, selectUser } from '../data/user-slice';
import { useSelector, useDispatch } from 'react-redux';

const Dashboard = () => {
	const { userTag, nickname, avatar, characters } = useSelector(selectUser) as User;
	return (
		<>
			<header>
				<H1>PDQ Dice</H1>
				<UserMenu {...{ userTag, nickname, avatar }} />
			</header>
			<main>{characters.length ? <Characters /> : <GetStarted />}</main>
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

	return (
		<main className="tiny">
			<p>This should redirect to the homepage</p>
		</main>
	);
};

export default ErrorCheckingDashboard;
