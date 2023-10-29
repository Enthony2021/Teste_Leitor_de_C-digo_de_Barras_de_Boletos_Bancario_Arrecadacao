import express from 'express';
import boletoRoutes from './routes/boletoRoutes';


const app = express();

class App {
    app: any;

    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    private middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes() {
        this.app.use('/boleto', boletoRoutes);
    }
}

export default new App().app;


