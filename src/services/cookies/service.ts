const getDomainWithoutSubdomain = (url: string) => {
	if (window.location.hostname.includes('localhost')) {
		return 'localhost';
	}

	const urlParts = new URL(url).hostname.split('.');

	return `.${urlParts
		.slice(0)
		.slice(-(urlParts.length === 4 ? 3 : 2))
		.join('.')}`;
};

export const remove = (field: string) => {
	document.cookie = `${field}=;domain=${getDomainWithoutSubdomain(window.location.origin)};path=/`;
};


export const get = (name: string) => {
	const cookieName = name + '=';
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(cookieName) == 0) {
			return c.substring(cookieName.length, c.length);
		}
	}
	return '';
};

export const set = <T>(field: string, data: string, exp?: Date) => {
	const parseData = data;
	document.cookie = `${field}=${parseData};${(exp) ? `expires=${exp.toUTCString()};` : ''}domain=${getDomainWithoutSubdomain(window.location.href)};path=/`;
};
