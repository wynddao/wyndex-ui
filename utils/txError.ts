export class TxError extends Error {
  constructor(msg: string) {
    super(msg);
    console.debug(msg);
  }

  pretty() {
    const [msg] = this.message.split("Unknown desc =")[1]?.split("[CosmWasm");
    if (msg.includes("contract: ")) return this.formatContractErr(msg);
    // Support new cases
    return "Something wen't wrong";
  }

  private formatContractErr(msg: string): string {
    this.cause = "contract";
    return msg.split("contract: ")[1];
  }
}
