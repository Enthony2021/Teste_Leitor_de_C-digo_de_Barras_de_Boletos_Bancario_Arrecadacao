class Result {
  barCode: string;
  amount: number | null;
  expirationDate: number | null;

  constructor(barCode: string, amount: number | null, expirationDate: number | null) {
    this.barCode = barCode;
    this.amount = amount;
    this.expirationDate = expirationDate; 
  }
}

export default Result;