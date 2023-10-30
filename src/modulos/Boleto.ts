import Result from "./Result";

module.exports = class Boleto {
  private code: string;
  private bloco1: string;
  private bloco2: string;
  private bloco3: string;
  private bloco4: string;
  private bloco5: string;
  private blocos123: string[];
  private dv123: number[] = [];
  private codigoDeBarra: string[];

  constructor(code: string) {
    this.code = code;
    this.bloco1 = this.code.slice(0, 10);
    this.bloco2 = this.code.slice(10, 21);
    this.bloco3 = this.code.slice(21, 32);
    this.bloco4 = this.code[32];
    this.bloco5 = this.code.slice(33, 47);
    this.blocos123 = [this.bloco1, this.bloco2, this.bloco3];
    this.dv123 = [
      Number(this.blocos123[0][9]),
      Number(this.blocos123[1][10]),
      Number(this.blocos123[2][10]),
    ];
    this.codigoDeBarra = [
      ...this.bloco1.slice(0, 4),
      ...this.bloco4,
      ...this.bloco5,
      ...this.bloco1.slice(4, 9),
      ...this.bloco2.slice(0, 6),
      ...this.bloco2.slice(6, 10),
      ...this.bloco3.slice(0, 10),
    ];
  }

  private gerarVerificadores123(): number[] {
    const blocos = this.blocos123;

    // cálculo dos verificadores (blocos: 1, 2 e 3)
    let soma: number = 0;
    let produto: number;

    // Armazena os 3 primeriros dígitos verificadores calculados dos blocos 1, 2 e 3
    let dv123calc: number[] = [];

    //Gerrar os três digitos verificadores e armazenar em dv123calc
    for (let bloco of blocos) {
      let blocoInv: string[] = [];

      // criar bloco invertido para cálculo do verificador
      for (let i = bloco.length - 2; i >= 0; i--) {
        blocoInv.push(bloco[i]);
      }

      for (let i = 0; i < blocoInv.length; i++) {
        i % 2 === 0
          ? (produto = parseInt(blocoInv[i]) * 2)
          : (produto = parseInt(blocoInv[i]) * 1);

        produto > 9
          ? (produto =
              Number(produto.toString()[0]) + Number(produto.toString()[1]))
          : produto;
        soma += produto;
      }

      let resultDv: number = (soma / 10 + 1) * 10 - soma;

      if (resultDv === 10) resultDv = 0;

      dv123calc.push(resultDv);
      soma = 0;
    }

    return dv123calc;
  }

  // Validar verificadores dos blocos 1, 2 e 3
  // Cálculo - módulo 10 de boleto bancário
  private validarVerificadores123(): boolean {
    const dv123calc: number[] = this.gerarVerificadores123();

    // Avalia os dígitos verificadores calculados com os capturados da linha digitável
    for (let i = 0; i < 3; i++) {
      if (this.dv123[i] !== dv123calc[i]) {
        console.log(this.dv123[i], " --- ", dv123calc[i]);
        return false;
      }
    }

    return true;
  }

  // Valor do Boleto
  private valorBoleto(): string {
    const valorBruto: number = parseInt(this.bloco5.slice(4, 14));

    const valorReal = (valorBruto / 100).toFixed(2);
    return valorReal;
  }

  // Data de Vencimento
  private dataVencimento(): string {
    // Fator de Vencimento extraido da linha digitável
    const fatorVencimento: number = Number(this.bloco5.slice(0, 4)) - 1000;
    // 07/10/1997 Data Base - (Fator 0000)
    // 03/07/2000 Data Base que usaremos - Fator (1000)

    const fatorVencimentoMs: number = fatorVencimento * 24 * 60 * 60 * 1000;

    // Datas de base segundo as especificações técnicas
    const dataBaseMs: number = new Date("2000-07-03").getTime();
    // let dataBaseMs = new Date('2025-02-22').getTime() // Para uso a partir de 22/02/2025 (fator 1000)

    const dataVencimentoMs: number = dataBaseMs + fatorVencimentoMs;
    const dataVencimento: Date = new Date(dataVencimentoMs);

    const ano: number = dataVencimento.getFullYear();

    let mes: number | string = dataVencimento.getMonth() + 1;
    if (mes < 10) mes = "0" + mes;

    let dia: number | string = dataVencimento.getDate() + 1;
    if (dia < 10) dia = "0" + dia;

    let dataFormatada = `${ano}-${mes}-${dia}`;

    return dataFormatada;
  }

  // Cálculo e Validação do Dígito Verificador Geral (Código de barra)
  private dvCodigoDeBarra(): boolean {
    let DVReal = parseInt(this.codigoDeBarra[4]); // DV retirada da linha digitável
    let DVcalc: string | number; // DV que será calculada

    // bloco de 43 posições do código de barra retirando o DV
    let bloco: string[] = [
      ...this.codigoDeBarra.slice(0, 4),
      ...this.codigoDeBarra.slice(5, 45),
    ];

    // blocoDAC invertido
    let blocoInv: string[] = [];

    // criar bloco invertido para uso no cálculo do verificador
    for (let i = bloco.length - 1; i >= 0; i--) {
      blocoInv.push(bloco[i]);
    }

    let soma: number = 0;

    // Calculo do DV pelo MÓDULO 11 - Boletos
    let i: number = 0;
    let j: number = 2; //J será os Multiplicadores

    while (blocoInv[i]) {
      soma += parseInt(blocoInv[i]) * j;

      j++;
      if (j === 10) j = 2;

      i++;
    }

    DVcalc = 11 - (soma % 11);

    if (DVcalc === 0 || DVcalc === 10 || DVcalc === 11) DVcalc = 1;

    return DVcalc == DVReal ? true : false;
  }

  // Avaliar se a linha digitável contém apenas números
  private avaliacaoNumerica(): boolean {
    const apenasNumeros: RegExp = /^\d+$/;

    return apenasNumeros.test(this.code);
  }

  // Validar n° de caracteres (47) da linha digitável
  private tamanhoDaLinha() {
    return this.code.length === 47 ? true : false;
  }

  // Validação do boleto e retorno das informações
  validacaoBoleto(): boolean | Result {
    if (
      // Verificar a função validarVerificadores está retornando valor booleano errado
      this.validarVerificadores123() === true &&
      this.tamanhoDaLinha() === true &&
      this.avaliacaoNumerica() === true &&
      this.dvCodigoDeBarra() === true
    ) {
        
      const result: Result = {
        code: this.code,
        amount: parseFloat(this.valorBoleto()),
        expirationDate: this.dataVencimento(),
      };

      return result;
    }

    // console.log(
    //   this.validarVerificadores123(),
    //   this.tamanhoDaLinha(),
    //   this.avaliacaoNumerica(),
    //   this.dvCodigoDeBarra()
    // );

    return false;
  }

  // Para uso nos testes
  testeBoleto() {
    const results = {
      tamanhoBoleto: this.tamanhoDaLinha(), // Boolen
      apenasNumeros: this.avaliacaoNumerica(), // Boolen
      DVsValidos: this.validarVerificadores123(), // Boolen
      DVbarCode: this.dvCodigoDeBarra(), // Boolean
      barCode: this.codigoDeBarra, // String
      amount: this.valorBoleto(), // String
      expirationDate: this.dataVencimento(), // String
    };

    return results;
  }
};
