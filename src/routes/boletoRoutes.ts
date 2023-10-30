const Router = require('express');
const boletoController = require("../controllers/BoletoController");

const router = new Router();

router.get('/boleto/:code', boletoController.main);

export default router;

