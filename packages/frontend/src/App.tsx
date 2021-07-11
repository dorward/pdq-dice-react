import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';
import './index.scss';

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Home from './components/home';
import Login from './components/login';
import Dashboard from './components/dashboard';
import store from './data/redux-store';

const App: React.FC = () => {
	return (
		<Provider store={store}>
			<Router>
				<Route exact path="/">
					<Home />
				</Route>
				<Route path="/login">
					<Login />
				</Route>
				<Route exact path="/dashboard">
					<Dashboard />
				</Route>
			</Router>
		</Provider>
	);
};

export default App;
