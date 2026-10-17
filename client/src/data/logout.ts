import store from './redux-store';
import { clearSession } from './session';
import { flushPendingSaves } from '../api/save-to-server';

export const logout = async () => {
    const user = store.getState().user.user;
    if (user) await flushPendingSaves(user);
    window.localStorage.removeItem('code');
    store.dispatch(clearSession());
    // Reload to discard account-specific queues and in-flight UI state as well.
    window.location.replace('/');
};
