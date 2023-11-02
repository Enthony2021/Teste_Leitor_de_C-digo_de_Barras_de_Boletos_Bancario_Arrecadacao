import Boleto from "../src/modulos/boleto";

// Teste dos valores (Código de Barra, valor e data de vencimento) gerados.

// Exemplos: linha de código digitável e retorno esperado.
// _______________________________________________________
// code: '00190500954014481606906809350314337370000000100'
// Código de Barra: '00193373700000001000500940144816060680935031'
// Valor: '1.00'
// Data de Vencimento: '2007-12-31'
// _______________________________________________________
//
// _______________________________________________________
// code: '10492767919600010004800001478411386260000027895'
// Código de Barra: '10493862600000278952767996000100040000147841'
// Valor: '278.95'
// Data de Vencimento: '2021-05-20'
// _______________________________________________________


// Testes com códigos válidos
describe('Retorno de Boletos Bancários', () => {
    const code = '10492767919600010004800001478411386260000027895'
    const boleto = new Boleto(code)
    
    it('Código de Barra - Bancário', () => {
        const result = boleto.testeBoleto()['barCode']
        expect(result).toBe('10493862600000278952767996000100040000147841')
    })


    it('Valor - Bancário', () => {
        const result = boleto.testeBoleto()['amount']
        expect(result).toBe('278.95')
    })

    it('Data de Vencimento - Bancário', () => {
        const result = boleto.testeBoleto()['expirationDate']
        expect(result).toBe('2021-05-20')
    })
})