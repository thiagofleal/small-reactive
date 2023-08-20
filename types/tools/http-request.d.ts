import { RegistryManagerReturn } from "../utils/registry-manager"
import { Service } from "../../core"

type ResponseCallback<T> = (response: Response) => T | Promise<T>;
type CustomRequestInit = RequestInit & { json?: boolean };

export declare class HttpRequest<T = any> extends Service<T> {
  constructor();

  registerBeforeSendCallback(
    callback: (
      url?: string,
      method?: string,
      body?: any,
      opts?: CustomRequestInit
    ) => {
      url?: string,
      method?: string,
      body?: any,
      opts?: CustomRequestInit
    } | undefined
  ): RegistryManagerReturn;

  registerAfterSendCallback<T = any, R = any>(
    callback: (value: T) => R
  ): RegistryManagerReturn;

  request<T = any>(
    url: string,
    method: string,
    body?: any,
    opts?: CustomRequestInit
  ): Promise<T>;

  getResponse(url: string, args?: RequestInit): Promise<Response>;

	get(url: string, args?: RequestInit): Promise<Response>;
	get<T>(url: string, args: RequestInit, cb: ResponseCallback<T>): Promise<T>;

	postResponse(url: string, body: any, args?: CustomRequestInit): Promise<Response>;

  post(url: string, body: any, args?: CustomRequestInit): Promise<Response>;
	post<T>(url: string, body: any, args: CustomRequestInit, cb: ResponseCallback<T>): Promise<T>;

	putResponse(url: string, body: any, args?: CustomRequestInit): Promise<Response>;

  put(url: string, body: any, args?: CustomRequestInit): Promise<Response>;
  put<T>(url: string, body: any, args: CustomRequestInit, cb: ResponseCallback<T>): Promise<T>;

	patchResponse(url: string, body: any, args?: CustomRequestInit): Promise<Response>;

  patch(url: string, body: any, args?: CustomRequestInit): Promise<Response>;
  patch<T>(url: string, body: any, args: CustomRequestInit, cb: ResponseCallback<T>): Promise<T>;

	deleteResponse(url: string, args?: CustomRequestInit): Promise<Response>;

  delete(url: string, args?: RequestInit): Promise<Response>;
	delete<T>(url: string, args: RequestInit, cb: ResponseCallback<T>): Promise<T>;
}
