export interface IClient {
  name: string;
  zip: string;
  vat: string;
  email: string;
  l10n_mx_edi_fiscal_regime: number;
}

export interface IClientResponse {
  error: boolean;
  message?: string;
  partner?: IClient;
}

export interface IOdooClientResponse {
  id: number;
  jsonrpc: string;
  result: IClientResponse;
}