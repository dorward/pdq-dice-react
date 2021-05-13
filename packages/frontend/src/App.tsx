import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './index.scss';

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Button, Intent, Spinner } from '@blueprintjs/core';
import Home from './components/home';
import Login from './components/login';

const App: React.FC = () => {
	return (
		<Router>
			<Route exact path="/">
				<Home />
			</Route>
			<Route path="/login">
				<Login />
			</Route>
		</Router>
	);
};

export default App;
