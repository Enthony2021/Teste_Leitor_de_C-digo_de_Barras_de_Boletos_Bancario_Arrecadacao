import Boleto from "../src/modulos/boleto";

/* 
    A intenção é testar as características das linhas digitáveis,
    são elas: N° de caracteres, Contém apenas números.

    Testar também se os Dígitos Verificadores calculados
    correspondem aqueles que estão nas linhas digitáveis 
*/


// *********************** Boletos Bancários ***************************
//Algumas Linhas Digitáveis Válidas para o teste (Boletos Bancários)
// ______________________________________________________
// Linha: 00190500954014481606906809350314337370000000100 
// ______________________________________________________
// Linha: 10492767919600010004800001478411386260000027895
// ______________________________________________________
// Linha: 75691123400112345670700004940045777960000000500
// ______________________________________________________



// Testes para Boletos Bancários Válidos
describe('Testes de Boleto Bancário Válido', () => {
    // Aqui coloca-se o código a ser testado em const code = ??????
    const code = '00190500954014481606906809350314337370000000100' // Código Válido
    const boleto = new Boleto(code)

    it ('Tem tamanho de 47 caracteres --> boleto Bancário ', () => {

        const result = boleto.testeBoleto()['tamanhoBoleto']
        expect(result).toBe(true)
    })


    it ('Os caracteres contém apenas números', () => {
    
        const result = boleto.testeBoleto()['apenasNumeros']
        expect(result).toBe(true)
    })


    it ('Digitos verificadores dos blocos 1, 2 e 3, Válidos', () => {
    
        const result = boleto.testeBoleto()['DVsValidos']
        expect(result).toBe(true)
    })


    it ('Digito Verificador do código de barra válido', () => {
    
        const result = boleto.testeBoleto()['DVbarCode']
        expect(result).toBe(true)
    })

})

// ***************************************************************

// Testando Boletos Bancários Inválidos
// Usei linhas digitáveis inválidas aqui
describe('Testes de Boletos Bancário com linha digitável INVÁLIDA', () => {

    it ('Tem tamanho diferente de 47 caracteres --> Linha Inválida ', () => {
        const code = '7569112340011234567070000494004577796000000050'
        const boleto = new Boleto(code)
        const result = boleto.testeBoleto()['tamanhoBoleto']
        expect(result).toBe(false)
    })


    it ('Há caracteres NÃO-NUMÉRICOS na linha digitável', () => {
        const code = '75691123*00112345%707000049400457779+0000000500'
        const boleto = new Boleto(code)
        const result = boleto.testeBoleto()['apenasNumeros']
        expect(result).toBe(false)
    })


    it ('Ao menos um dígito verificador é INVÁLIDO na Linha Digitável', () => {
        const code = '75691123420112345670800004940049777960000000500'
        const boleto = new Boleto(code)
        const result = boleto.testeBoleto()['DVsValidos']
        expect(result).toBe(false)
    })
    

    it ('Digito Verificador do código de barra INVÁLIDO', () => {
        const code = '75691123400112345670700004940045177960000000500' 
        //                * DV quinto dígito(1)       * Numero alterado (7 -> 1)
        const boleto = new Boleto(code)
        const result = boleto.testeBoleto()['DVbarCode']
        expect(result).toBe(false)
    })

})

