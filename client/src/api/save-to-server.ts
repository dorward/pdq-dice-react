import type { User } from '../types';
import axios from 'axios';
import { createSaveQueue } from './save-queue';

export const SAVE_ERROR_EVENT = 'pdq-save-error';

const enqueue = createSaveQueue(async (user) => {
    const url = `${import.meta.env.VITE_API_URL}user/${user.userId}/${user.code}`;
    const response = await axios.post<{ revision: number }>(url, user);
    return response.data;
});

export const flushPendingSaves = (user: Pick<User, 'userId' | 'code'>) => enqueue.flush(user);

const saveToServer = (user: User) =>
    enqueue(user).catch((error: unknown) => {
        const conflict = axios.isAxiosError(error) && error.response?.status === 409;
        const message = conflict
            ? 'Your data changed in another session. Saving has stopped. Export your unsaved characters before reloading.'
            : 'Your changes could not be saved. Saving has stopped. Export your unsaved characters before reloading.';
        window.dispatchEvent(new CustomEvent(SAVE_ERROR_EVENT, { detail: message }));
    });

export default saveToServer;
