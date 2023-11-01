const Boleto = require("../modulos/Boleto");
const Arrecadacao = require("../modulos/Arrecadacao");
const Result = require("../modulos/Result");
import { Request, Response } from "express";

export function main(req: Request, res: Response) {
  if (!req.params || !req.params.code) {
    return res
      .status(400)
      .send('<h1 style="text-align: center">Erro: 400</h1>');
  }

  if (req.params.code) {
    const code: string = req.params.code;
    const arrecadacao: typeof Arrecadacao = new Arrecadacao(code);

    let dataBoleto: typeof Result;
    let dataArrecadacao: typeof Result;

    // Testa primeiramente se o tipo do boleto é de arrecadação (ou boleto comum)
    if (arrecadacao.validacaoArrecadacaoTamanho()) {

      dataArrecadacao = arrecadacao.validacaoArrecadacao();

    } else {

      const boleto: typeof Boleto = new Boleto(code);
      dataBoleto = boleto.validacaoBoleto();
      
    }

    // Responde pelo que retornar algum objeto do tipo Result
    if (dataBoleto) {
      return res.status(200).json(dataBoleto);
    }

    if (dataArrecadacao) {
      return res.status(200).json(dataArrecadacao);
    }
  }
  
  return res.status(400).send('<h1 style="text-align: center">Erro: 400</h1>');
}
