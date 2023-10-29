const Boleto = require("./modulos/boleto");
const Arrecadacao = require("./modulos/arrecadacao");

export class BoletoController {
  main(req: any, res: any) {
    const code = req.params.code;
    const boleto = new Boleto(code);
    const arrecadacao = new Arrecadacao(code);

    let dataArrecadacao;
    let dataBoleto;

    dataBoleto = boleto.validacaoBoleto();
    dataArrecadacao = arrecadacao.validacaoArrecadacao();

    // Responde pela função que retornar algum objeto
    if (dataBoleto) {
      res.status(200).json(dataBoleto);
    } else if (dataArrecadacao) {
      res.status(200).json(dataArrecadacao);
    } else {
      res.status(400).send('<h1 style="text-align: center">Erro: 400</h1>');
    }
  }
}
