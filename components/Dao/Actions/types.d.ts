export interface MsgType {
  type: "create-pool" | "execute" | "migrate" | unknown;
  msg: string;
  msgBeautified: string;
  contract_addr: string;
  rawMsg: CosmosMsg_for_Empty;
  new_code_id?: string;
}
