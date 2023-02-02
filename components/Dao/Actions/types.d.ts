export interface MsgType {
  type: "execute" | "migrate" | unknown;
  msg: string;
  msgBeautified: string;
  contract_addr: string;
  rawMsg: Record<string, any>;
}
