import Boleto from '../modulos/Boleto';
import Arrecadacao from '../modulos/Arrecadacao';
import Result from '../modulos/Result';
import { Request, Response } from "express";

export function main(req: Request, res: Response) {
  if (!req.params || !req.params.code) {
    return res
      .status(400)
      .send('<h1 style="text-align: center">Erro: 400</h1>');
  }

  if (req.params.code) {
    const code: string = req.params.code;
    const arrecadacao: Arrecadacao = new Arrecadacao(code);

    let dataBoleto:  Result | boolean;
    let dataArrecadacao:  Result | boolean;

    // Testa primeiramente se o tipo do boleto é de arrecadação (ou boleto comum)
    if (arrecadacao.validacaoArrecadacaoTamanho()) {

      dataArrecadacao = arrecadacao.validacaoArrecadacao();

      if (dataArrecadacao) {
        return res.status(200).json(dataArrecadacao);
      }

    } else {

      const boleto: Boleto = new Boleto(code);
      dataBoleto = boleto.validacaoBoleto();

      if (dataBoleto) {
        return res.status(200).json(dataBoleto);
      }
      
    }
    
  }
  
  return res.status(400).send('<h1 style="text-align: center">Erro: 400</h1>');
}
