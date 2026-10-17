import type { User } from '../types';

type SaveResponse = { revision: number };
type Send = (user: User) => Promise<SaveResponse>;

export const createSaveQueue = (send: Send) => {
    const sessions = new Map<
        string,
        { tail: Promise<void>; revision: number; failed: boolean }
    >();
    const enqueue = (user: User): Promise<void> => {
        const snapshot: User = structuredClone(user);
        const key = JSON.stringify([user.userId, user.code]);
        let session = sessions.get(key);
        if (!session) {
            session = { tail: Promise.resolve(), revision: user.revision ?? 0, failed: false };
            sessions.set(key, session);
        }
        const current = session;
        const save = current.tail.then(async () => {
            if (current.failed) throw new Error('Saving stopped after an earlier failure.');
            try {
                const result = await send({ ...snapshot, revision: current.revision });
                current.revision = result.revision;
            } catch (error) {
                current.failed = true;
                throw error;
            }
        });
        // Keep the queue settled without hiding errors from the caller.
        current.tail = save.catch(() => {});
        return save;
    };
    const flush = async (user: Pick<User, 'userId' | 'code'>): Promise<void> => {
        const session = sessions.get(JSON.stringify([user.userId, user.code]));
        if (!session) return;
        let tail: Promise<void>;
        do {
            tail = session.tail;
            await tail;
            if (session.failed) throw new Error('Saving stopped after an earlier failure.');
        } while (tail !== session.tail);
    };
    return Object.assign(enqueue, { flush });
};
