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

    dataBoleto = boleto.validacaoBoleto()
    dataArrecadacao = arrecadacao.validacaoArrecadacao()

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