export type RequestData = Record<string, string | number | Blob | Record<string, string>>;

export interface RequestParams {
    url: string;
    token?: string;
    data?: RequestData;
    headers?: Record<string, string>;
    contentType?: string;
    signal?: AbortSignal;
}

export interface GetParams extends RequestParams {
    accept?: string;
}

export interface PostParams extends RequestParams {}

export interface PutParams extends RequestParams {}

export interface DeleteParams extends RequestParams {}

export class FetchClient {

	private readonly baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	public async get({ url, token, data = {}, headers = {}, contentType = 'application/json', accept = 'application/json', signal } : GetParams): Promise<Response> {
		const queryParams = new URLSearchParams(data as Record<string, string>).toString();
		const fullUrl = queryParams ? `${this.baseUrl}${url}?${queryParams}` : `${this.baseUrl}${url}`;
      
		const response = await fetch(fullUrl, {
			method: 'GET', 
			headers: {
				...headers,
				'Content-Type': contentType,
				'Accept': accept,
				...(token ? { 'Authorization': `Bearer ${token}` } : {})
			},
			signal
		});
		if (!response.ok) {
			throw new Error('HTTP error ' + response.status);
		}
		return response;
	}

	public async post({ url, token, data = {}, headers = {}, contentType = 'application/json', signal } : PostParams): Promise<Response> {
		const response = await fetch(`${this.baseUrl}${url}`, {
			method: 'POST', 
			headers: {
				...headers,
				'Content-Type': contentType,
				...(token ? { 'Authorization': `Bearer ${token}` } : {})
			},
			body: JSON.stringify(data),
			signal
		});
		if (!response.ok) {
			throw new Error('HTTP error ' + response.status);
		}
		return response;
	}

	private appendNestedData(formData: FormData, key: string, value: Record<string, string>): void {
		Object.entries(value).forEach(([subKey, subValue]) => {
			formData.append(`${key}[${subKey}]`, subValue);
		});
	}

	private appendFormData(formData: FormData, data: RequestData): void {
		Object.entries(data).forEach(([key, value]) => {
			if (value instanceof File) {
				formData.append(key, value);
			} else if (value && typeof value === 'object' && !('size' in value)) {
				this.appendNestedData(formData, key, value);
			} else {
				formData.append(key, value as string | Blob);
			}
		});
	}

	public async postFormData({ url, token, data = {}, headers = {}, signal } : PostParams): Promise<Response> {
		const formData = new FormData();
		this.appendFormData(formData, data);

		const response = await fetch(`${this.baseUrl}${url}`, {
			method: 'POST',
			headers: {
				...headers,
				...(token ? { 'Authorization': `Bearer ${token}` } : {})
			},
			body: formData,
			signal
		});

		if (!response.ok) {
			throw new Error('HTTP error ' + response.status);
		}
		return response;
	}

	public async put({ url, token, data = {}, headers = {}, contentType = 'application/json', signal } : PutParams): Promise<Response> {
		const response = await fetch(`${this.baseUrl}${url}`, {
			method: 'PUT', 
			headers: {
				...headers,
				'Content-Type': contentType,
				...(token ? { 'Authorization': `Bearer ${token}` } : {})
			},
			body: JSON.stringify(data),
			signal
		});
		if (!response.ok) {
			throw new Error('HTTP error ' + response.status);
		}
		return response;
	}

	public async delete({ url, token, headers = {}, contentType = 'application/json', signal } : DeleteParams): Promise<Response> {
		const response = await fetch(`${this.baseUrl}${url}`, {
			method: 'DELETE', 
			headers: {
				...headers,
				'Content-Type': contentType,
				...(token ? { 'Authorization': `Bearer ${token}` } : {})
			},
			signal
		});
		if (!response.ok) {
			throw new Error('HTTP error ' + response.status);
		}
		return response;
	}
}
