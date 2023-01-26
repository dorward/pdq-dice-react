import { Callout, H1, Intent } from '@blueprintjs/core';
import { Navigate } from 'react-router-dom';
import { User } from '../types';
import { selectUser } from '../data/user-slice';
import { useSelector } from 'react-redux';
import Characters from './characters';

import Results from './results';
import UserMenu from './user-menu';

const Dashboard = () => {
	const { userTag, nickname, avatar } = useSelector(selectUser) as User;

	return (
		<>
			<header>
				<H1>PDQ Dice</H1>
				<UserMenu {...{ userTag, nickname, avatar }} />
			</header>
			<main>
				<Characters />
			</main>
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

	return <Navigate to="/" />;
};

export default ErrorCheckingDashboard;
