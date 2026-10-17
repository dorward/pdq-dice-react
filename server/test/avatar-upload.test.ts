import { afterAll, beforeAll, expect, test, vi } from 'vitest';
import express from 'express';
import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import { startTestServer } from './http-server';

vi.hoisted(() => {
    process.env.AVATAR_URL = 'https://example.test/avatars';
    process.env.AVATAR_PATH = '/tmp/test-avatars';
});
vi.mock('fs/promises', () => ({ writeFile: vi.fn() }));
vi.mock('../src/util/authHelper', () => ({ default: async () => ({ userId: 'user' }) }));
vi.mock('../src/dbConfig/dbConnector', () => ({ default: { query: vi.fn() } }));
import router from '../src/routers/userRouter';

const app = express();
app.use(express.json());
app.use('/user', router);
let http: Awaited<ReturnType<typeof startTestServer>>;
beforeAll(async () => {
    http = await startTestServer(app);
});
afterAll(() => http?.close());
const upload = (image: unknown) =>
    fetch(`${http.base}/user/user/code/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
    });

test.each([
    undefined,
    null,
    123,
    {},
    'not a data URL',
    'data:image/png;base64,%%%%',
    `data:text/html;base64,${Buffer.from('<script>alert(1)</script>').toString('base64')}`,
    `data:image/png;base64,${Buffer.from('<script>alert(1)</script>').toString('base64')}`,
    'data:image/png;base64,iVBORw0KGgo=',
])('rejects invalid avatar data without writing it: %j', async (image) => {
    const response = await upload(image);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Please upload a valid image.' });
    expect(writeFile).not.toHaveBeenCalled();
});

test('decodes and re-encodes valid image contents as PNG', async () => {
    const jpeg = await sharp({
        create: { width: 2, height: 2, channels: 3, background: 'red' },
    })
        .jpeg()
        .toBuffer();
    const response = await upload(`data:image/jpeg;base64,${jpeg.toString('base64')}`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
        path: expect.stringMatching(/\.png$/),
        url: expect.stringMatching(/\.png$/),
    });
    expect(writeFile).toHaveBeenCalledTimes(1);
    const written = vi.mocked(writeFile).mock.calls[0][1] as Buffer;
    expect(await sharp(written).metadata()).toMatchObject({
        format: 'png',
        width: 2,
        height: 2,
    });
});

test('filesystem failures remain server errors', async () => {
    vi.mocked(writeFile).mockRejectedValueOnce(new Error('Disk full'));
    const png = await sharp({ create: { width: 1, height: 1, channels: 3, background: 'red' } })
        .png()
        .toBuffer();
    expect((await upload(`data:image/png;base64,${png.toString('base64')}`)).status).toBe(500);
});
