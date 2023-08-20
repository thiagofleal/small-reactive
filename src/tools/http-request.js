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
    if (body) {
      if (opts.json) {
        opts.body = JSON.stringify(body);
        opts.headers = { "content-type": "application/json", ...opts.headers };
      } else {
        opts.body = body;
      }
    }
		let ret = await this.#send(url, opts);

    for (let i = 0; i < after.length; i++) {
      const callback = after[i];
      ret = await callback(ret);
    }
    return ret;
	}

  async #getResponseValue(response, cb) {
		if (response && response.ok) {
			return cb ? cb(response) : response;
		}
    throw new Error(response ? response.statusText : "Request failed");
  }

  async getResponse(url, args) {
		return await this.request(url, "GET", null, args);
	}

	async get(url, args, cb) {
		const response = await this.getResponse(url, args);
    return this.#getResponseValue(response, cb);
	}

	async postResponse(url, body, args) {
		return await this.request(url, "POST", body, args);
	}

	async post(url, body, args, cb) {
		const response = await this.postResponse(url, body, args);
    return this.#getResponseValue(response, cb);
	}

	async putResponse(url, body, args) {
		return await this.request(url, "PUT", body, args);
	}

	async put(url, body, args, cb) {
		const response = await this.putResponse(url, body, args);
    return this.#getResponseValue(response, cb);
	}

	async patchResponse(url, body, args) {
		return await this.request(url, "PATCH", body, args);
	}

	async patch(url, body, args, cb) {
		const response = await this.patchResponse(url, body, args);
    return this.#getResponseValue(response, cb);
	}

	async deleteResponse(url, args) {
		return await this.request(url, "DELETE", null, args);
	}

	async delete(url, args, cb) {
		const response = await this.deleteResponse(url, args);
    return this.#getResponseValue(response, cb);
	}
}
