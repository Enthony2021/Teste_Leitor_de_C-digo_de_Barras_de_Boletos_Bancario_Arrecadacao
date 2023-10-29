import express, {Application} from 'express';
import boletoRoutes from './routes/boletoRoutes';

class App {
    app: Application;

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


