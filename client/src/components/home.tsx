import { H1 } from '@blueprintjs/core';

import useLocalStorage from 'use-local-storage';
import { Navigate } from 'react-router-dom';

const Home = () => {
    const [code] = useLocalStorage('code', '');
    if (code) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="v-center">
            <main className="tiny logged-out-home">
                <H1>PDQ Dice</H1>
                <p>
                    To login, visit a Discord channel where the bot is active and type{' '}
                    <kbd>login</kbd>. Then click the link in the DM the bot will send you.
                </p>
            </main>
        </div>
    );
};

export default Home;
