export const RESERVED_PATHNAMES = {
	favicon: '/favicon.ico',
	search: '/s',
};

export const SEARCH_QUERY_PARAM = 'q';
export const SEARCH_PATHNAME_FULL = `${RESERVED_PATHNAMES.search}/`;

export const DEFAULT_HEADERS: HeadersInit = {
	'x-robots-tag': 'noindex',
};

export const SEARCH_ENGINE_KEY_PATTERN = '[a-z]+';
export const SEARCH_BANG_REGEX = new RegExp(`!(${SEARCH_ENGINE_KEY_PATTERN})`); // bangs can be anywhere
