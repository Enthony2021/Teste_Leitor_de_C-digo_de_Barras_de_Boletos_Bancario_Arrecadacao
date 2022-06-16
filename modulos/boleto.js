
module.exports = class Boleto {
    constructor(code) {
        this.code = code
    }

    getBloco1() {
        const bloco1 = this.code.slice(0, 10)
        return bloco1
    }

    getBloco2() {
        const bloco2 = this.code.slice(10, 21)
        return bloco2
    }

    getBloco3() {
        const bloco3 = this.code.slice(21, 32)
        return bloco3
    }

    getBloco4() {
        const bloco4 = this.code[32]
        return bloco4
    }

    getBloco5() {
        const bloco5 = this.code.slice(33, 47)
        return bloco5
    }

    blocos123() {
        let blocos123 = [this.getBloco1(), this.getBloco2(), this.getBloco3()]
        return blocos123
    }

    dv123() {
        let blocos = this.blocos123()
        let dv123 = [Number(blocos[0][9]), Number(blocos[1][10]), Number(blocos[2][10])]
        return dv123
    }

    gerarVerificadores123() {
        const blocos = this.blocos123()
        // cálculo dos verificadores (blocos: 1, 2 e 3)
        let soma = 0
        let produto

        // Armazena os 3 primeriros dígitos verificadores calculados dos blocos 1, 2 e 3
        let dv123calc = []


        //Gerrar os três digitos verificadores e armazenar em dv123calc
        for (let bloco of blocos) {
            let blocoInv = []

            // criar bloco invertido para cálculo do verificador
            for (let i = bloco.length - 2; i >= 0; i--) {
                blocoInv.push(bloco[i])
            }

            for (let i = 0; i < blocoInv.length; i++) {
                i % 2 === 0 ? produto = blocoInv[i] * 2 : produto = blocoInv[i] * 1

                produto > 9 ? produto = Number(produto.toString()[0]) + Number(produto.toString()[1]) : produto
                soma += produto
            }

            let resultDv = (parseInt(soma / 10) + 1) * 10 - soma

            if (resultDv === 10) resultDv = 0

            dv123calc.push(resultDv)
            soma = 0;
        }

        return dv123calc;
    }


    // Validar verificadores dos blocos 1, 2 e 3
    // Cálculo - módulo 10 de boleto bancário
    validarVerificadores123() {
        const dv123 = this.dv123()
        let dv123calc = this.gerarVerificadores123()

        // Avalia os dígitos verificadores calculados com os capturados da linha digitável
        for (let i = 0; i < 3; i++) {
            if (dv123[i] !== dv123calc[i]) {
                return false
            }
        }

        return true
    }


    // Valor do Boleto
    valorBoleto() {
        let valorBruto = this.getBloco5().slice(4, 14)
        valorBruto = Number(valorBruto)

        let valorReal = (valorBruto / 100).toFixed(2)
        return valorReal
    }


    // Data de Vencimento
    dataVencimento() {
        // Fator de Vencimento extraido da linha digitável
        let fatorVencimento = (Number(this.getBloco5().slice(0, 4))) - 1000
        // 07/10/1997 Data Base - (Fator 0000)
        // 03/07/2000 Data Base que usaremos - Fator (1000) 

        let fatorVencimentoMs = fatorVencimento * 24 * 60 * 60 * 1000

        // Datas de base segundo as especificações técnicas
        let dataBaseMs = new Date('2000-07-03').getTime()
        // let dataBaseMs = new Date('2025-02-22').getTime() // Para uso a partir de 22/02/2025 (fator 1000)

        let dataVencimentoMs = dataBaseMs + fatorVencimentoMs
        let dataVencimento = new Date(dataVencimentoMs)

        let ano = dataVencimento.getFullYear()

        let mes = dataVencimento.getMonth() + 1
        if (mes < 10) mes = '0' + mes

        let dia = dataVencimento.getDate() + 1
        if (dia < 10) dia = '0' + dia

        let dataFormatada = `${ano}-${mes}-${dia}`

        return dataFormatada
    }

    // Gera código de Barra
    getCodigoDeBarra() {
        let codigoDeBarra = [
            ...this.getBloco1().slice(0, 4),
            ...this.getBloco4(),
            ...this.getBloco5(),
            ...this.getBloco1().slice(4, 9),
            ...this.getBloco2().slice(0, 6),
            ...this.getBloco2().slice(6, 10),
            ...this.getBloco3().slice(0, 10)
        ]

        codigoDeBarra = String(codigoDeBarra).replace(/,/g, '')

        return codigoDeBarra
    }

    // Cálculo e Validação do Dígito Verificador Geral (Código de barra) 
    dvCodigoDeBarra() {

        let DVReal = this.getCodigoDeBarra()[4] // DV retirada da linha digitável
        let DVcalc // DV que será calculada

        // bloco de 43 posições do código de barra retirando o DV
        let bloco = [
            ...this.getCodigoDeBarra().slice(0, 4),
            ...this.getCodigoDeBarra().slice(5, 45)
        ]

        // blocoDAC invertido
        let blocoInv = []

        // criar bloco invertido para uso no cálculo do verificador
        for (let i = bloco.length - 1; i >= 0; i--) {
            blocoInv.push(bloco[i])
        }

        let soma = 0

        // Calculo do DV pelo MÓDULO 11 - Boletos
        let i = 0
        let j = 2 //J será os Multiplicadores
        
        while (blocoInv[i]) {

            soma += blocoInv[i] * j

            j++
            if (j === 10) j = 2

            i++
        }

        DVcalc = 11 - (soma % 11)

        if (DVcalc === 0 || DVcalc === 10 || DVcalc === 11) DVcalc = 1

        return DVcalc == DVReal ? true : false
    }


    // Avaliar se a linha digitável contém apenas números 
    avaliacaoNumerica() {
        let codeDigitado = this.code

        return !isNaN(this.code) === true ? true : false
    }


    // Validar n° de caracteres (47) da linha digitável
    tamanhoDaLinha() {
        return this.code.length === 47 ? true : false
    }


    // Cálculo módulo 10 de boleto bancário
    validarVerificadores123() {
        const dv123 = this.dv123()
        let dv123calc = this.gerarVerificadores123()

        // Avalia os dígitos verificadores calculados com os capturados da linha digitável
        for (let i = 0; i < 3; i++) {
            if (dv123[i] !== dv123calc[i]) {
                return false
            }
        }

        return true
    }


    // Validação do boleto e retorno das informações
    validacaoBoleto() {
        if (
            this.validarVerificadores123() === true && 
            this.tamanhoDaLinha() === true && 
            this.avaliacaoNumerica() === true &&
            this.dvCodigoDeBarra() === true
            ) {
            return {
                barCode: this.getCodigoDeBarra(),
                amount: this.valorBoleto(),
                expirationDate: this.dataVencimento()
            }

        } else {
            return false
        }
    }

    // Para uso nos testes
    testeBoleto() {

        const results = {
            tamanhoBoleto: this.tamanhoDaLinha(), // Boolen 
            apenasNumeros: this.avaliacaoNumerica(), // Boolen 
            DVsValidos: this.validarVerificadores123(), // Boolen
            DVbarCode: this.dvCodigoDeBarra(), // Boolean
            barCode: this.getCodigoDeBarra(), // String
            amount: this.valorBoleto(), // String
            expirationDate: this.dataVencimento() // String
        } 

        return results;
    }

}


