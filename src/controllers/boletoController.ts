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
    const code: string = req.params.code; // Aqui assumimos que 'code' é do tipo string
    const boleto: typeof Boleto = new Boleto(code);
    const arrecadacao: typeof Arrecadacao = new Arrecadacao(code);

    const dataArrecadacao: typeof Result = arrecadacao.validacaoArrecadacao();;
    const dataBoleto: typeof Result = boleto.validacaoBoleto();
    console.log(dataBoleto);
    console.log(dataArrecadacao);

    // Responde pela função que retornar algum objeto
    if (dataBoleto) {
      return res.status(200).json(dataBoleto);
    }

    if (dataArrecadacao) {
      return res.status(200).json(dataArrecadacao);
    }
  }
  return res.status(400).send('<h1 style="text-align: center">Erro: 400</h1>');
}
