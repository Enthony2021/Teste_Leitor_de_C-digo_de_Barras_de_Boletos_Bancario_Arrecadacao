import Result from "./Result";

module.exports = class Arrecadacao {
    public code: string;
    private bloco1: string;
    private idValorReferencia: number; // Identificador de Valor/Referência
    private barCode: string;

    constructor(code: string) {
        this.code = code;
        this.barCode = `${this.code.slice(0, 11)}${this.code.slice(12, 23)}${this.code.slice(24, 35)}${this.code.slice(36, 47)}`;
        this.bloco1 = this.code.slice(0, 11);
        this.idValorReferencia = parseInt(this.barCode[2]);
    }

    // Validaçao - Se é boleto de Concessionária/Arrecadação(8) (primeiro digito: 8 - tamanho (48)
    public validacaoArrecadacaoTamanho(): boolean {
        return parseInt(this.bloco1[0]) == 8 && this.code.length === 48 ? true : false;
    }

    // Validação Numérica (Se contém apenas números)
    private avaliacaoNumerica(): boolean {
        return !isNaN(parseInt(this.code)) === true ? true : false
    }

    
    // Cálculo e Validação do Dígito Verificador Geral (Código de barra) 
    private validacaoDV(): boolean {
        let DVReal: number = parseInt(this.barCode[3]) // DV retirada do Código de Barra
        let DVcalc: number // DV que será calculada
        
        // bloco de 43 posições do código de barra retirando o DV (DAC dígito de Auto-Conferência)
        let blocoDAC: string[] = [
            ...this.barCode.slice(0, 3),
            ...this.barCode.slice(4, 45)
        ];

        // blocoDAC invertido
        let blocoDACInv: string[] = [];

        // criar bloco invertido para uso no cálculo do verificador
        for (let i = blocoDAC.length - 1; i >= 0; i--) {
            blocoDACInv.push(blocoDAC[i]);
        }

        let produto: number;
        let soma: number = 0;

        // se getIdValorReferência() 6 / 7 --> Calculo do DV pelo MÓDULO 10
        if (this.idValorReferencia === 6 || this.idValorReferencia === 7) {

            // cálculo da soma usando os multiplicadores
            for (let i = 0; i < blocoDACInv.length; i++) {
                i % 2 === 0 ? produto = parseInt(blocoDACInv[i]) * 2 : produto = parseInt(blocoDACInv[i]) * 1 ;
                
                produto > 9 ? produto = Number(produto.toString()[0]) + Number(produto.toString()[1]) : produto;
                soma += produto;
            } 
            
            DVcalc = 10 - (soma%10);
            return DVcalc == DVReal ? true : false;
        }

        
        // se getIdValorReferência() 8 / 9 --> Calculo do DV pelo MÓDULO 11
        if (this.idValorReferencia === 8 || this.idValorReferencia === 9) {

            // cálculo da soma usando os multiplicadores
            let i: number = 0
            let j: number = 2 //J será os Multiplicadores
            while(blocoDACInv[i]) {

                soma += parseInt(blocoDACInv[i])*j;

                j++;
                if(j === 10) j = 2;
                i++;
            }

            DVcalc = 11 - (soma%11);

            if (DVcalc === 0 || DVcalc === 10 ) DVcalc = 0;
            if (DVcalc === 10) DVcalc = 1;
            if ( DVcalc == DVReal) {
                return true;
            }
        }         
        
        return false;
    }

    // Valor (posição 5-15)
    private getValor(): number | null {
        // Valor a ser cobrado
        if (this.idValorReferencia === 6 || this.idValorReferencia === 8) {
            const valor: number = parseFloat((parseInt(this.code.slice(4, 15)) / 100).toFixed(2));
            
            return valor;
        }

        // Valor por Referência: Quantidade de moeda / Zeros / Valor a ser ajustado por índice
        if (this.idValorReferencia === 7 || this.idValorReferencia === 9) {
            return null;
        }

        return null;
    }


    // Tipo do Segmento (2° posição do código de barra)
    private getSegmento(): number | boolean {
        const segmento: number = parseInt(this.code[1]);

        if (segmento === 0 || segmento === 8) {
            return false; // não pertence a nenhum seguimento listado
        }
        
        return segmento;
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
    private getDataDeVencimento(): number | null {
        let dataVencimento: number;

        if (this.getSegmento() === 9) { // Segmento Bancário
            return dataVencimento = parseInt(this.code.slice(19, 27));
        }

        // Outros segmentos (CNPJ / Contribuintes MF)
        if (this.getSegmento() !== 9) {
            return dataVencimento = parseInt(this.code.slice(19, 27));
        }
        return null;
    }


    // Validação do Boleto-Arrecadacao e retorno das informações
    validacaoArrecadacao(): Result | boolean {

        if (this.validacaoArrecadacaoTamanho() === true && 
            this.validacaoDV() === true && 
            this.getSegmento() &&
            this.avaliacaoNumerica() === true) {

            const result: Result = {
                code: this.code, 
                amount: this.getValor(), 
                expirationDate: " --- " 
            }

            return result;
        }

        return false;
    }


    // Para uso nos testes
    testeBoleto() {
        const results = {
            tamanhoBoleto: this.validacaoArrecadacaoTamanho(), // Boolean 
            apenasNumeros: this.avaliacaoNumerica(), // Boolean
            DVbarCode: this.validacaoDV(), // Boolean
            code: this.code, // String
            amount: this.getValor(), // String ou null
            expirationDate: this.getDataDeVencimento() // String ou null
        } 

        return results;
    }
}


