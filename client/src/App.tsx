import Dashboard from './components/dashboard';
import Home from './components/home';
import Login from './components/login';
import store from './data/redux-store';
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './index.scss';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Callout, Intent } from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import { SAVE_ERROR_EVENT } from './api/save-to-server';

const App: React.FC = () => {
    const [saveError, setSaveError] = useState('');
    useEffect(() => {
        const onSaveError = (event: Event) =>
            setSaveError((event as CustomEvent<string>).detail);
        window.addEventListener(SAVE_ERROR_EVENT, onSaveError);
        return () => window.removeEventListener(SAVE_ERROR_EVENT, onSaveError);
    }, []);
    return (
        <Provider store={store}>
            {saveError && (
                <Callout intent={Intent.DANGER} title="Changes not saved">
                    {saveError}
                </Callout>
            )}
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
