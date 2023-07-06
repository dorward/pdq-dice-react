import express from 'express';

import pool from './dbConfig/dbConnector';
import apiRouter from './routers/apiRouter';
import rootRouter from './routers/rootRouter';
import { avatarPaths } from './util/saveDataUrl';

class Server {
    private app;

    constructor() {
        this.app = express();
        this.middlewareConfig();
        this.routerConfig();
        this.dbConnect();
    }

    private middlewareConfig() {
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.static('/var/pdq/static/'));
        this.app.use('/avatars', express.static(avatarPaths.AVATAR_PATH + '/'));
    }

    private dbConnect() {
        pool.connect(function (err) {
            if (err) throw err;
            console.log('Connected');
        });
    }

    private routerConfig() {
        console.log('Add the router configs');
        this.app.use('/', rootRouter);
        this.app.use('/api', apiRouter);
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            console.log('Trying to listen on port', port);
            this.app
                .listen({ hostname: '127.0.0.1', port }, () => {
                    resolve(port);
                })
                .on('error', (err: Error) => reject(err));
        });
    };
}

export default Server;
