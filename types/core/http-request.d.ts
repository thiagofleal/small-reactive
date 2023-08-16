import { RegistryManagerReturn } from "../utils/registry-manager"
import { Service } from "./service"

export declare class HttpRequest<T = any> extends Service<T> {
  constructor();

  registerBeforeSendCallback(
    callback: (
      url?: string,
      method?: string,
      body?: any,
      opts?: RequestInit | undefined
    ) => {
      url?: string,
      method?: string,
      body?: any,
      opts?: RequestInit
    } | undefined
  ): RegistryManagerReturn;

  registerAfterSendCallback<T = any, R = any>(
    callback: (value: T) => R
  ): RegistryManagerReturn;

  request<T = any>(
    url: string,
    method: string,
    body?: any,
    opts?: RequestInit
  ): Promise<T>;

  getResponse(url: string, args?: RequestInit): Promise<Response>;
	get<T = any>(url: string, args?: RequestInit): Promise<T>;

	postResponse(url: string, body: any, args?: RequestInit): Promise<Response>;
	post<T = any>(url: string, body: any, args?: RequestInit): Promise<T>;

	putResponse(url: string, body: any, args?: RequestInit): Promise<Response>;
  put<T = any>(url: string, body: any, args?: RequestInit): Promise<T>;

	deleteResponse(url: string, args?: RequestInit): Promise<Response>;
	delete<T = any>(url: string, args?: RequestInit): Promise<T>;
}
