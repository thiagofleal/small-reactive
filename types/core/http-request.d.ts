import { RegistryManagerReturn } from "../utils/registry-manager"
import { Service } from "./service"

export declare class HttpRequest extends Service {
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

  getResponse<T = any>(url: string, args?: RequestInit): Promise<Response<T>>;
	get<T = any>(url: string, args?: RequestInit): Promise<T>;

	postResponse<T = any>(url: string, body: any, args?: RequestInit): Promise<Response<T>>;
	post<T = any>(url: string, body: any, args?: RequestInit): Promise<T>;

	putResponse<T = any>(url: string, body: any, args?: RequestInit): Promise<Response<T>>;
  put<T = any>(url: string, body: any, args?: RequestInit): Promise<T>;

	deleteResponse<T = any>(url: string, args?: RequestInit): Promise<Response<T>>;
	delete<T = any>(url: string, args?: RequestInit): Promise<T>;
}
