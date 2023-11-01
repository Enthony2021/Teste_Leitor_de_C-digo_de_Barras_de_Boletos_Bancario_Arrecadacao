const Arrecadacao = require('../src/modulos/Arrecadacao');

// Teste dos valores (Código de Barra, valor e data de vencimento) gerados:

// Exemplos: linha de código digitável e retorno esperado.
// _______________________________________________________
// code: '846100000013086000240209024081022634618270411027'
// Código de Barra: '84610000001086000240200240810226361827041102'
// Valor: '108.60'
// Data de Vencimento: null
// _______________________________________________________
//
// _______________________________________________________
// code: '858700000006648003280910100107091069025107070001'
// Código de Barra: '85870000000648003280911001070910602510707000'
// Valor: '64.80'
// Data de Vencimento: null
// _______________________________________________________


// Testes com códigos válidos
describe('Retorno dos Boletos de Arrecadação', () => {
    const code = '846100000013086000240209024081022634618270411027'
    const arrecadacao = new Arrecadacao(code)
    
    it('Código de Barra - Arrecadação', () => {
        const result = arrecadacao.testeBoleto()['code']
        expect(result).toBe('84610000001086000240200240810226361827041102')
    })


    it('Valor - Arrecadação', () => {
        const result = arrecadacao.testeBoleto()['amount']
        expect(result).toBe('108.60')
    })

    it('Data de Vencimento - Arrecadação', () => {
        const result = arrecadacao.testeBoleto()['expirationDate']
        expect(result).toBe(null)
    })
})

