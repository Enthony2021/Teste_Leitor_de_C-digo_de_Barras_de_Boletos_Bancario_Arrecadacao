import Arrecadacao from "../src/modulos/Arrecadacao";


// *********************** Boletos de Arrecadação ***************************
//Algumas Linhas Digitáveis Válidas para o teste (Boletos de Arrecadação)
// _______________________________________________________
// Linha: 846100000013086000240209024081022634618270411027 
// _______________________________________________________
// Linha: 858700000006648003280910100107091069025107070001
// _______________________________________________________
// Linha: 818600000064088435692015707100101404021660170380
// _______________________________________________________


// Testes para Boletos de Arrecadação Válidos
describe('Testes de Boleto de Arrecadação Válido', () => {
    const code: string = '846100000013086000240209024081022634618270411027' // Código Válido
    const arrecadacao: Arrecadacao = new Arrecadacao(code);
    

    it ('Tem tamanho de 48 caracteres --> boleto de Arrecadação ', () => {
        const result = arrecadacao.testeBoleto()['tamanhoBoleto']
        expect(result).toBe(true)
    })

    it ('Os caracteres contém apenas números', () => {
        const result = arrecadacao.testeBoleto()['apenasNumeros']
        expect(result).toBe(true)
    })


    it ('Digito Verificador do código de barra válido', () => {
        const result = arrecadacao.testeBoleto()['DVbarCode']
        expect(result).toBe(true)
    })

})


// Testando Boletos Arrecadação Inválidos
// Usei linhas digitáveis inválidas aqui
describe('Testes de Boletos de Arrecadação com linha digitável INVÁLIDA', () => {

    it ('Tem tamanho diferente de 48 caracteres --> Linha Inválida ', () => {
        const code = '84610000001308600024020902408102263461827041102783'
        const arrecadacao = new Arrecadacao(code)
        const result = arrecadacao.testeBoleto()['tamanhoBoleto']
        expect(result).toBe(false)
    })


    it ('Há caracteres NÃO-NUMÉRICOS na linha digitável', () => {
        const code = '8461000-001308600024020902408102263461/8270411027'
        const arrecadacao = new Arrecadacao(code)
        const result = arrecadacao.testeBoleto()['apenasNumeros']
        expect(result).toBe(false)
    })
    

    it ('Digito Verificador do código de barra INVÁLIDO', () => {
        const code = '858200000006648003280910100107091069025107070001' 
        //               * DV quarto dígito alterado de 7 para 2
        const arrecadacao = new Arrecadacao(code)
        const result = arrecadacao.testeBoleto()['DVbarCode']
        expect(result).toBe(false)
    })

})
