import { RegistryManagerReturn } from "../utils/registry-manager"
import { Service } from "../../core"

type Transform<T> = { transform: (response: Response) => T | Promise<T> };

export type RequestInitJson = RequestInit & { json?: boolean };
export type RequestInitTransform<T> = RequestInit & Transform<T>;
export type RequestInitJsonTransform<T> = RequestInitJson & Transform<T>;

export declare class HttpRequest<E = any> extends Service<E> {
  constructor(context: unknown);

  registerBeforeSendCallback(
    callback: (
      url?: string,
      method?: string,
      body?: any,
      opts?: RequestInitJson
    ) => {
      url?: string,
      method?: string,
      body?: any,
      opts?: RequestInitJson
    } | undefined
  ): RegistryManagerReturn;

  registerAfterSendCallback<T = any, R = any>(
    callback: (value: T) => R
  ): RegistryManagerReturn;

  request<T = any>(
    url: string,
    method: string,
    body?: any,
    opts?: RequestInitJson
  ): Promise<T>;

  getResponse(url: string, args?: RequestInit): Promise<Response>;
	get(url: string, args?: RequestInit): Promise<Response>;
	get<T>(url: string, args: RequestInitTransform<T>): Promise<T>;

	postResponse(url: string, body: any, args?: RequestInitJson): Promise<Response>;
	post(url: string, body: any, args?: RequestInitJson): Promise<Response>;
	post<T>(url: string, body: any, args?: RequestInitJsonTransform<T>): Promise<T>;

	putResponse(url: string, body: any, args?: RequestInitJson): Promise<Response>;
  put(url: string, body: any, args?: RequestInitJson): Promise<Response>;
  put<T>(url: string, body: any, args?: RequestInitJsonTransform<T>): Promise<T>;

	patchResponse(url: string, body: any, args?: RequestInitJson): Promise<Response>;
  patch(url: string, body: any, args?: RequestInitJson): Promise<Response>;
  patch<T>(url: string, body: any, args?: RequestInitJsonTransform<T>): Promise<T>;

	deleteResponse(url: string, args?: RequestInit): Promise<Response>;
	delete(url: string, args?: RequestInit): Promise<Response>;
	delete<T>(url: string, args?: RequestInitTransform<T>): Promise<T>;
}
