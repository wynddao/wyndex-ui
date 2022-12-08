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
    console.log(this.message);
    const match = this.re.exec(this.message);
    if (match != null) {
      return match[1];
    }
    if (this.message.includes("Unknown desc ="))
      return this.message.split("Unknown desc =")[1]?.split("[CosmWasm");
    return "Something wen't wrong";
  }

  private formatContractErr(msg: string): string {
    this.cause = "contract";
    return msg.split("contract: ")[1];
  }

  private re = /message index: [0-9]: (.+?):/;
}
