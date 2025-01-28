import express from 'express';
import { AppDataSource } from './data-source';
import routes from './routes/users';
import routerTransaction from './routes/transactionRoutes';
import corsMiddleware from 'cors';

AppDataSource.initialize().then(() => {

    const app = express();
    app.use(corsMiddleware());
    app.use(express.json());
    app.use(routes);
    app.use(routerTransaction);
    app.listen(process.env.PORT, () => {
        console.log(
            `Server is running on port  http://localhost:${process.env.PORT}`
        );
    });
});


