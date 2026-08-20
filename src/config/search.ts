export type RawSearchEngine = { url: string; search: string } | { site: string };

export const SEARCH_TERMS_PLACEHOLDER = '{searchTerms}';

export const SEARCH_ENGINES = {
	g: {
		url: 'www.google.com',
		search: `/search?q=${SEARCH_TERMS_PLACEHOLDER}`,
	},
	b: {
		url: 'search.brave.com',
		search: `/search?q=${SEARCH_TERMS_PLACEHOLDER}`,
	},
	a: {
		url: 'www.amazon.in',
		search: `/s?k=${SEARCH_TERMS_PLACEHOLDER}`,
	},
	f: {
		url: 'www.flipkart.com',
		search: `/search?q=${SEARCH_TERMS_PLACEHOLDER}`,
	},
	ng: {
		url: 'noogle.dev',
		search: `/q?term=${SEARCH_TERMS_PLACEHOLDER}`,
	},
	no: {
		url: 'search.nixos.org/options',
		search: `?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=${SEARCH_TERMS_PLACEHOLDER}`,
	},
	np: {
		url: 'search.nixos.org/packages',
		search: `?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=${SEARCH_TERMS_PLACEHOLDER}`,
	},
	yt: {
		url: 'www.youtube.com',
		search: `/results?search_query=${SEARCH_TERMS_PLACEHOLDER}`,
	},
	rt: { site: 'www.reddit.com' },
	mdn: { site: 'developer.mozilla.org' },
} as const satisfies Record<string, RawSearchEngine>;

export const SEARCH_ENGINE_DEFAULT: keyof typeof SEARCH_ENGINES = 'g';
