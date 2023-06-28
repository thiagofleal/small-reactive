import { Service } from "../../core.js"
import { RegistryManager } from "../utils/registry-manager.js";

export class HttpRequest extends Service {

  #beforeSendCallbacks = new RegistryManager();
  #afterSendCallbacks = new RegistryManager();

  constructor() {
    super();
  }

  #send(url, opts) {
		return fetch(url, opts);
	}

  registerBeforeSendCallback(callback) {
    return this.#beforeSendCallbacks.registry(callback);
  }

  registerAfterSendCallback(callback) {
    return this.#afterSendCallbacks.registry(callback);
  }

  async request(url, method, body, opts) {
    const before = this.#beforeSendCallbacks.getAll();
    const after = this.#afterSendCallbacks.getAll();

    for (let i = 0; i < before.length; i++) {
      const callback = before[i];
      const callbackReturn = await callback(url, method, body, opts);

      if (callbackReturn) {
        if (callbackReturn.url) url = callbackReturn.url;
        if (callbackReturn.method) method = callbackReturn.method;
        if (callbackReturn.body !== void 0) {
          body = callbackReturn.body ? callbackReturn.body : void 0;
        }
        if (callbackReturn.opts !== void 0) {
          opts = callbackReturn.opts ? callbackReturn.opts : void 0;
        }
      }
    }
		if (opts === null || opts === undefined || typeof opts !== "object") {
			opts = {};
		}
		opts.method = method;

    if (!opts.headers) {
      opts.headers = {};
    }
    if (opts.headers["content-type"] === "application/json") {
      opts.body = JSON.stringify(body || {});
    } else {
      opts.body = body;
    }
		let ret = await this.#send(url, opts);

    for (let i = 0; i < after.length; i++) {
      const callback = after[i];
      ret = await callback(ret);
    }
    return ret;
	}

  async #getResponseValue(response) {
		if (response !== false && response.ok) {
			return await response.json();
		}
    throw new Error(response ? response.statusText : "Request failed");
  }

  async getResponse(url, args) {
		return await this.request(url, "GET", null, args);
	}

	async get(url, args) {
		const response = await this.getResponse(url, args);
    return this.#getResponseValue(response);
	}

	async postResponse(url, body, args) {
		return await this.request(url, "POST", body, args);
	}

	async post(url, body, args) {
		const response = await this.postResponse(url, body, args);
    return this.#getResponseValue(response);
	}

	async putResponse(url, body, args) {
		return await this.request(url, "PUT", body, args);
	}

	async put(url, body, args) {
		const response = await this.putResponse(url, body, args);
    return this.#getResponseValue(response);
	}

	async deleteResponse(url, args) {
		return await this.request(url, "DELETE", null, args);
	}

	async delete(url, args) {
		const response = await this.deleteResponse(url, args);
    return this.#getResponseValue(response);
	}
}
