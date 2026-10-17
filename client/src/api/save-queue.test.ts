import { describe, expect, it, vi } from 'vitest';
import { createSaveQueue } from './save-queue';
import type { User } from '../types';

const user = { userId: 'user', code: 'code', revision: 3, characters: [] } as User;

describe('save queue', () => {
    it('flush waits for every queued save, including changes queued while waiting', async () => {
        let firstDone!: (result: { revision: number }) => void;
        let secondDone!: (result: { revision: number }) => void;
        const send = vi
            .fn()
            .mockImplementationOnce(
                () =>
                    new Promise((resolve) => {
                        firstDone = resolve;
                    }),
            )
            .mockImplementationOnce(
                () =>
                    new Promise((resolve) => {
                        secondDone = resolve;
                    }),
            );
        const save = createSaveQueue(send);
        const first = save(user);
        let flushed = false;
        const flushing = save.flush(user).then(() => {
            flushed = true;
        });
        const second = save({ ...user, nickname: 'Latest edit' });
        await Promise.resolve();
        expect(flushed).toBe(false);
        firstDone({ revision: 4 });
        await first;
        await Promise.resolve();
        expect(flushed).toBe(false);
        secondDone({ revision: 5 });
        await Promise.all([second, flushing]);
        expect(flushed).toBe(true);
        expect(send.mock.calls[1][0]).toMatchObject({ revision: 4, nickname: 'Latest edit' });
    });

    it.each([409, 500])(
        'flush rejects both pending and previously failed saves (HTTP %s)',
        async (status) => {
            const save = createSaveQueue(vi.fn().mockRejectedValue({ status }));
            const saving = save(user);
            await expect(save.flush(user)).rejects.toThrow('Saving stopped');
            await expect(saving).rejects.toEqual({ status });
            await expect(save.flush(user)).rejects.toThrow('Saving stopped');
            await expect(save.flush({ ...user, code: 'other' })).resolves.toBeUndefined();
        },
    );

    it('serializes snapshots and uses the acknowledged revision for the next save', async () => {
        let complete: (result: { revision: number }) => void;
        const send = vi
            .fn()
            .mockImplementationOnce(
                () =>
                    new Promise((resolve) => {
                        complete = resolve;
                    }),
            )
            .mockResolvedValueOnce({ revision: 5 });
        const save = createSaveQueue(send);
        const first = save(user);
        const snapshot = { ...user, nickname: 'new name' };
        const second = save(snapshot);
        snapshot.nickname = 'later mutation';
        await Promise.resolve();
        expect(send).toHaveBeenCalledTimes(1);
        complete({ revision: 4 });
        await Promise.all([first, second]);
        expect(send.mock.calls[1][0]).toMatchObject({ revision: 4, nickname: 'new name' });
    });

    it.each([409, 500])('stops queued and subsequent saves after HTTP %s', async (status) => {
        const send = vi.fn().mockRejectedValue({ status });
        const save = createSaveQueue(send);
        const results = await Promise.allSettled([save(user), save(user)]);
        expect(results.map((result) => result.status)).toEqual(['rejected', 'rejected']);
        await expect(save(user)).rejects.toThrow('Saving stopped');
        expect(send).toHaveBeenCalledTimes(1);
    });

    it('keeps sessions separate and supports documents without a revision', async () => {
        const send = vi.fn().mockResolvedValue({ revision: 1 });
        const save = createSaveQueue(send);
        await Promise.all([
            save({ ...user, revision: undefined }),
            save({ ...user, code: 'other' }),
        ]);
        expect(send.mock.calls[0][0].revision).toBe(0);
        expect(send.mock.calls[1][0].revision).toBe(3);
    });
});
