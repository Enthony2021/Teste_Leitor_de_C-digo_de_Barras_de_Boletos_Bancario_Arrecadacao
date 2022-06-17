
module.exports = class Arrecadacao {
    constructor(code) {
        this.code = code
    }

    getBloco1() {
        const bloco1 = this.code.slice(0, 11)
        return bloco1
    }

    getBloco2() {
        const bloco2 = this.code.slice(12, 23)
        return bloco2
    }

    getBloco3() {
        const bloco3 = this.code.slice(24, 35)
        return bloco3
    }

    getBloco4() {
        const bloco4 = this.code.slice(36, 47)
        return bloco4
    }

    // Código de barras
    getBarCode() {
        let codigoDeBarra = [
            ...this.getBloco1(),
            ...this.getBloco2(),
            ...this.getBloco3(),
            ...this.getBloco4()
        ]

        codigoDeBarra = String(codigoDeBarra).replace(/,/g, '')
        return codigoDeBarra
    }

    // Validaçao - Se é boleto de Concessionária/Arrecadação(8) (primeiro digito: 8 - tamanho (48)
    validacaoArrecadacaoTamanho() {
        return this.getBloco1()[0] == 8 && this.code.length === 48 ? true : false   
    }

    // Validação Numérica (Se contém apenas números)
    avaliacaoNumerica() {
        return !isNaN(this.code) === true ? true : false
    }

    // Identificador de Valor/Referência
    getIdValorReferencia() {
        const IdValorReferencia = this.getBarCode()[2]
        
        return IdValorReferencia
    }

    // Cálculo e Validação do Dígito Verificador Geral (Código de barra) 
    validacaoDV() {
        let DVReal = this.getBarCode()[3] // DV retirada do Código de Barra
        let DVcalc // DV que será calculada
        
        // bloco de 43 posições do código de barra retirando o DV (DAC dígito de Auto-Conferência)
        let blocoDAC = [
            ...this.getBarCode().slice(0, 3),
            ...this.getBarCode().slice(4, 45)
        ] 

        // blocoDAC invertido
        let blocoDACInv = []

        // criar bloco invertido para uso no cálculo do verificador
        for (let i = blocoDAC.length - 1; i >= 0; i--) {
            blocoDACInv.push(blocoDAC[i])
        }

        let produto
        let soma = 0


        // se getIdValorReferência() 6 / 7 --> Calculo do DV pelo MÓDULO 10
        if (this.getIdValorReferencia() == 6 || this.getIdValorReferencia() == 7) {

            // cálculo da soma usando os multiplicadores
            for (let i = 0; i < blocoDACInv.length; i++) {
                i % 2 === 0 ? produto = blocoDACInv[i] * 2 : produto = blocoDACInv[i] * 1 
                
                produto > 9 ? produto = Number(produto.toString()[0]) + Number(produto.toString()[1]) : produto
                soma += produto
            } 
            
            DVcalc = 10 - (soma%10)

            return DVcalc == DVReal ? true : false
        }

        
        // se getIdValorReferência() 8 / 9 --> Calculo do DV pelo MÓDULO 11
        if (this.getIdValorReferencia() == 8 || this.getIdValorReferencia() == 9) {

            // cálculo da soma usando os multiplicadores
            let i = 0
            let j = 2 //J será os Multiplicadores
            while(blocoDACInv[i]) {

                soma += blocoDACInv[i]*j

                j++ 
                if(j === 10) j = 2
                
                i++
            }

            DVcalc = 11 - (soma%11)

            if (DVcalc === 0 || DVcalc === 10 ) DVcalc = 0
            if (DVcalc === 10) DVcalc = 1

            if ( DVcalc == DVReal) {
                return true 
            } else {
                return false
            }

        }         
        
    }

    // Valor (posição 5-15)
    getValor() {
        // Valor a ser cobrado
        if (this.getIdValorReferencia() == 6 || this.getIdValorReferencia() == 8) {
            const valor = ((this.getBarCode().slice(4, 15)) / 100).toFixed(2)
            return valor
        }

        // Valor por Referência: Quantidade de moeda / Zeros / Valor a ser ajustado por índice
        if (this.getIdValorReferencia() == 7 || this.getIdValorReferencia() == 9) {
            return null
        }

    }


    // Tipo do Segmento (2° posição do código de barra) 
    getSegmento() {
        const segmento = this.getBarCode()[1]
        if (segmento == 0 || segmento == 8) {
            return false // não pertence a nenhum seguimento listado
        } else {
            return segmento
        }
        // *********************************
        //
        //  1 - Prefeitura
        //  2 - Saneamento
        //  3 - Energia Elétrica e Gás
        //  4 - Telecomunicações
        //  5 - Órgão Governamental
        //  6 - Empresas diversas (CNPJ)
        //  7 - Multa de Transito
        //  9 - Banco
        //
        // *********************************
    }


    // DatadeVencimento
    getDataDeVencimento() {

        let dataVencimento
        if (this.getSegmento() == 9) { // Segmento Bancário
            dataVencimento = this.getBarCode().slice(19, 27)
            return null
        }

        // Outros segmentos (CNPJ / Contribuintes MF)
        if (this.getSegmento() !== 9) {
            dataVencimento = this.getBarCode().slice(19, 27)
            return null
        }
    }


    // Validação do Boleto-Arrecadacao e retorno das informações
    validacaoArrecadacao() {

        if (this.validacaoArrecadacaoTamanho() === true && 
            this.validacaoDV() === true && 
            this.getSegmento() &&
            this.avaliacaoNumerica() === true) {
            return {
                barCode: this.getBarCode(), 
                amount: this.getValor(), 
                expirationDate: this.getDataDeVencimento() 
            }
        } else {
            return false
        }
    }


    // Para uso nos testes
    testeBoleto() {

        const results = {
            tamanhoBoleto: this.validacaoArrecadacaoTamanho(), // Boolen 
            apenasNumeros: this.avaliacaoNumerica(), // Boolen
            DVbarCode: this.validacaoDV(), // Boolean
            barCode: this.getBarCode(), // String
            amount: this.getValor(), // String ou null
            expirationDate: this.getDataDeVencimento() // String ou null
        } 

        return results;
    }
}


