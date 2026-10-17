import { afterAll, beforeAll, expect, test, vi } from 'vitest';
import express from 'express';
import { startTestServer } from './http-server';
const mocks = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('../src/dbConfig/dbConnector', () => ({ default: { query: mocks.query } }));
vi.mock('../src/util/saveDataUrl', () => ({ default: async () => undefined }));
import router from '../src/routers/userRouter';
const app = express();
app.use(express.json());
app.use('/user', router);
let http: Awaited<ReturnType<typeof startTestServer>>;
beforeAll(async () => {
    http = await startTestServer(app);
});
afterAll(() => http.close());
const user = { userId: 'user', code: 'secret', revision: 2, characters: [] };
const login = () => fetch(`${http.base}/user/secret`);

test('database failures during login return 500 rather than an empty success', async () => {
    const failure = new Error('Database unavailable');
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.query.mockRejectedValueOnce(failure);
    const response = await login();
    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Something went wrong');
    expect(logged).toHaveBeenCalledWith(failure);
    expect(mocks.query).toHaveBeenCalledExactlyOnceWith(
        'SELECT data FROM user_data WHERE data @> $1;',
        [{ code: 'secret' }],
    );
});

test('an unknown login code still returns 404', async () => {
    mocks.query.mockResolvedValueOnce({ rows: [] });
    const response = await login();
    expect(response.status).toBe(404);
    expect(await response.text()).toBe('Could not find a user with that code');
});

test('successful login still returns the user', async () => {
    mocks.query.mockResolvedValueOnce({ rows: [{ data: user }] });
    const response = await login();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(user);
});

const post = () =>
    fetch(`${http.base}/user/user/secret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });

test('failed writes return 500 instead of a save acknowledgement', async () => {
    const failure = new Error('Database unavailable');
    const logged = vi.spyOn(console, 'log').mockImplementation(() => {});
    mocks.query.mockRejectedValue(failure);
    const response = await post();
    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Internal Server Error');
    expect(mocks.query).toHaveBeenCalledTimes(1);
    expect(logged).toHaveBeenCalledWith(failure);
});
test('a failed follow-up lookup returns 500 rather than success, 401 or 409', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mocks.query
        .mockResolvedValueOnce({ rowCount: 0, rows: [] })
        .mockRejectedValueOnce(new Error('Lookup failed'));
    expect((await post()).status).toBe(500);
    expect(mocks.query).toHaveBeenCalledTimes(2);
    expect(mocks.query.mock.calls[0][0]).toMatch(/^UPDATE/);
    expect(mocks.query.mock.calls[1][0]).toMatch(/^SELECT/);
});
test('a successful save acknowledges the returned revision', async () => {
    mocks.query.mockResolvedValue({ rowCount: 1, rows: [{ data: { ...user, revision: 3 } }] });
    const response = await post();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ revision: 3 });
});
test.each([
    ['unknown user', { rowCount: 0, rows: [] }, 401],
    ['wrong code', { rowCount: 1, rows: [{ data: { ...user, code: 'different' } }] }, 401],
    ['stale revision', { rowCount: 1, rows: [{ data: { ...user, revision: 3 } }] }, 409],
] as const)('%s keeps its specific HTTP status', async (_name, existing, status) => {
    mocks.query
        .mockResolvedValueOnce({ rowCount: 0, rows: [] })
        .mockResolvedValueOnce(existing);
    expect((await post()).status).toBe(status);
    expect(mocks.query).toHaveBeenCalledTimes(2);
});
