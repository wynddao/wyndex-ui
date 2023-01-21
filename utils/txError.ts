export class TxError extends Error {
  constructor(msg: string) {
    super(msg);
    console.debug(msg);
  }

  pretty() {
    const parsedMsg = this.parser();

    if (!Array.isArray(parsedMsg)) return parsedMsg;
    const [msg] = parsedMsg;

    if(msg.includes('The transfer would have moved tokens still locked by a vesting schedule')) return 'The transfer would have moved tokens still locked by a vesting schedule.';

    // Support new cases
    if (msg.includes("contract: ")) return this.formatContractErr(msg);
    if (msg.includes("exceeds max spread limit")) return "The operation has exceeded the slippage limit";

    return "Something went wrong";
  }

  parser() {
    const match = this.re.exec(this.message);

    if (this.message.includes("Unknown desc =")) {
      return this.message.split("Unknown desc =")[1]?.split("[CosmWasm");
    }

    if (match != null) {
      return match[1];
    }

    return "Something went wrong";
  }

  private formatContractErr(msg: string): string {
    this.cause = "contract";
    return msg.split("contract: ")[1];
  }

  private re = /message index: [0-9]: (.+?):/;
}
