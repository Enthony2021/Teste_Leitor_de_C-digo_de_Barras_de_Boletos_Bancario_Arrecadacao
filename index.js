const express = require('express')
const server = express()
const Boleto = require('./modulos/boleto')
const Arrecadacao = require('./modulos/arrecadacao')

server.get('/boleto/:code', (req, res) => {
    const code = req.params.code
    const boleto = new Boleto(code)
    const arrecadacao = new Arrecadacao(code)
    let dataArrecadacao
    let dataBoleto

    // Filtra a linha digitável pelo tamanho para instanciar o método de validacao para cada tipo de classe
    // Se não instanciar alguma classe retorna status 400
    if(code.length === 47) {
        dataBoleto = boleto.validacaoBoleto()
    } else if(code.length === 48) {
        dataArrecadacao = arrecadacao.validacaoArrecadacao()
    } else {
        res.status(400).send('<h1 style="text-align: center">Erro: 400</h1>')
    }


    // Responde pela função que retornar algum objeto
    if(dataBoleto) {
        res.status(200).json(dataBoleto)
    }

    if(dataArrecadacao) {
        res.status(200).json(dataArrecadacao)
    }

    if (!dataArrecadacao && !dataBoleto) {
        res.status(400).send('<h1 style="text-align: center">Erro: 400</h1>')
    }

    
})

server.listen(8080, () => {
    console.log('Server Funcionando: http://localhost:8080')
})