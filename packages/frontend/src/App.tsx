import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';
import './index.scss';

import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Button, Intent, Spinner } from '@blueprintjs/core';
import Home from './components/home';
import Login from './components/login';
import Dashboard from './components/dashboard';
import useUser from './data/use-user';

const App: React.FC = () => {
	const { user, setUser, userData } = useUser();

	return (
		<Router>
			<Route exact path="/">
				<Home user={user} />
			</Route>
			<Route path="/login">
				<Login user={user} setUser={setUser} />
			</Route>
			<Route exact path="/dashboard">
				<Dashboard user={user} userData={userData} />
			</Route>
		</Router>
	);
};

export default App;
