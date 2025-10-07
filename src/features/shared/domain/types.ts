interface ImportMetaEnv {
	VITE_API_URL?: string;
	VITE_KEYCLOAK?: {
		authority: string;
		client_id: string;
		metadata: {
			issuer: string;
			authorization_endpoint: string;
			token_endpoint: string;
			userinfo_endpoint: string;
			jwks_uri: string;
		};
	};
}

declare global {
	var import_meta_env: ImportMetaEnv;
}

export interface Translations {
	[key: string]: string;
}

export interface Price {
    amount: number;
    currency: string;
}

export {};