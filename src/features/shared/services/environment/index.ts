export const getApiUrl = () => {
	return import.meta.env.PUBLIC_API_URL;
};

export const getOidcConfig = () => {
	return {
		issuer: import.meta.env.VITE_KEYCLOAK_ISSUER,
		clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
		redirectUri: `${window.location.origin}${window.location.pathname}`,
		postLogoutRedirectUri: `${window.location.origin}`,
	};
};