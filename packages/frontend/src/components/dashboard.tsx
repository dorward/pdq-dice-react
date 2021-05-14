import React, { useState, useEffect } from 'react';
import { Intent, Spinner, Callout, H1 } from '@blueprintjs/core';
import axios from 'axios';
import useQuery from '../hooks/use-query';
import { useHistory } from 'react-router-dom';
import { PossibleUser, User } from '../types';
import UserMenu from './user-menu';
import Characters from './characters';
import GetStarted from './get-started';

type ErrorCheckingProps = {
	user: PossibleUser;
};

type Props = {
	user: User;
};

const Dashboard = ({ user }: Props) => {
	const { userTag, nickname, avatar, characters } = user;
	return (
		<>
			<header>
				<H1>PDQ Dice</H1>
				<UserMenu {...{ userTag, nickname, avatar }} />
			</header>
			<main>{characters.length ? <Characters characters={characters} /> : <GetStarted />}</main>
		</>
	);
};

const ErrorCheckingDashboard = ({ user }: ErrorCheckingProps) => {
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
		return <Dashboard user={user} />;
	}

	return (
		<main className="tiny">
			<p>This should redirect to the homepage</p>
		</main>
	);
};

export default ErrorCheckingDashboard;
