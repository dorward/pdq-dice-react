import type { Application } from 'express';
import type { AddressInfo } from 'node:net';

export const startTestServer = async (app: Application) => {
    const server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve, reject) => {
        server.once('listening', resolve);
        server.once('error', reject);
    });
    return {
        base: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
        close: () =>
            new Promise<void>((resolve, reject) =>
                server.close((error) => (error ? reject(error) : resolve())),
            ),
    };
};
