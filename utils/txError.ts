export class TxError extends Error {
  constructor(msg: string) {
    super(msg);
    console.debug(msg);
  }

  pretty() {
    const parsedMsg = this.parser();
    console.log(parsedMsg[0]);
    if (!Array.isArray(parsedMsg)) return parsedMsg;
    const [msg] = parsedMsg;

    // Support new cases
    if (msg.includes("contract: ")) return this.formatContractErr(msg);
    if (msg.includes("exceeds max spread limit")) return "Operation exceeds max spread limit.";

    return "Something wen't wrong";
  }

  parser() {
    const match = this.re.exec(this.message);

    if (this.message.includes("Unknown desc =")) {
      return this.message.split("Unknown desc =")[1]?.split("[CosmWasm");
    }

    if (match != null) {
      return match[1];
    }

    return "Something wen't wrong";
  }

  private formatContractErr(msg: string): string {
    this.cause = "contract";
    return msg.split("contract: ")[1];
  }

  private re = /message index: [0-9]: (.+?):/;
}
