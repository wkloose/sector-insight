export type BrokerCategory =
  | "Asing-Institusional"
  | "Asing-Ritel"
  | "Domestik-Institusional"
  | "Domestik-Ritel"

export interface Broker {
  code: string
  name: string
  category: BrokerCategory | string
  netValue?: number
  volume?: number
  action?: "net_buy" | "net_sell" | "neutral"
}
