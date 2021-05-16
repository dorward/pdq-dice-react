import React, { useState, useEffect } from 'react';
import { Intent, Spinner, Callout, H1 } from '@blueprintjs/core';
import axios from 'axios';
import useQuery from '../hooks/use-query';
import { useHistory } from 'react-router-dom';
import { PossibleUser, User, UserData } from '../types';
import UserMenu from './user-menu';
import Characters from './characters';
import GetStarted from './get-started';

type ErrorCheckingProps = {
	user: PossibleUser;
	userData: UserData;
};

type Props = {
	user: User;
	userData: UserData;
};

const Dashboard = ({ user, userData }: Props) => {
	const { userTag, nickname, avatar, characters } = user;
	return (
		<>
			<header>
				<H1>PDQ Dice</H1>
				<UserMenu {...{ userTag, nickname, avatar }} />
			</header>
			<main>
				{characters.length ? (
					<Characters userData={userData} characters={characters} />
				) : (
					<GetStarted userData={userData} />
				)}
			</main>
		</>
	);
};

const ErrorCheckingDashboard = ({ user, userData }: ErrorCheckingProps) => {
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
		return <Dashboard user={user} userData={userData} />;
	}

	return (
		<main className="tiny">
			<p>This should redirect to the homepage</p>
		</main>
	);
};

export default ErrorCheckingDashboard;
