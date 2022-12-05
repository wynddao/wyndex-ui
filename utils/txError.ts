export class TxError extends Error {
  constructor(msg: string) {
    super(msg);
    console.debug(msg);
  }

  pretty() {
    const parsedMsg = this.parser();
    if (!Array.isArray(parsedMsg)) return parsedMsg;
    const [msg] = parsedMsg;
    if (msg.includes("contract: ")) return this.formatContractErr(msg);
    // Support new cases
    return "Something wen't wrong";
  }

  parser() {
    if (this.message.includes("Unknown desc ="))
      return this.message.split("Unknown desc =")[1]?.split("[CosmWasm");
    if (this.message.includes("Failed to retrieve")) return this.message.slice(7);
    return "Something wen't wrong";
  }

  private formatContractErr(msg: string): string {
    this.cause = "contract";
    return msg.split("contract: ")[1];
  }
}
