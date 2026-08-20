import { RESERVED_PATHNAMES, SEARCH_BANG_REGEX, SEARCH_PATHNAME_FULL, SEARCH_QUERY_PARAM } from './constants.ts';
import { URLS, MAPPINGS, SEARCH_ENGINE_DEFAULT, SEARCH_ENGINES } from './generated.ts';
import type { SearchEngine } from './types.ts';

type ResultType = string | null;

function getMapping(pathname: URL['pathname']): ResultType {
	const slugIndex = pathname.indexOf('/', 1); // NOTE: this is for dynamic slugs (ex: /c/111 where '111' is dynamic)

	const mappingPathname = slugIndex === -1 ? pathname : pathname.slice(0, slugIndex);
	const slug = slugIndex === -1 ? '' : pathname.slice(slugIndex);

	const href = URLS[MAPPINGS[mappingPathname]];

	return href ? `${href}${slug}` : null;
}

function getSearchResult(url: URL): ResultType {
	// pathname search takes precedence over param search
	let query: string = url.pathname.slice(SEARCH_PATHNAME_FULL.length);

	if (query) {
		try {
			query = decodeURIComponent(query);
		} catch {}
	} else if (url.search) {
		query = url.searchParams.get(SEARCH_QUERY_PARAM) ?? '';
	}

	query = query.trim();

	if (query === '') {
		return SEARCH_ENGINE_DEFAULT[0];
	}

	if (query.at(0) === '@') {
		return getMapping(`/${query.slice(1)}`);
	}

	// Checking for '!' and then doing match is faster
	const [bang, bangEngineKey] = (query.includes('!') ? query.match(SEARCH_BANG_REGEX) : null) ?? [null, null];

	let engine: SearchEngine;

	if (bang && bangEngineKey && Object.hasOwn(SEARCH_ENGINES, bangEngineKey)) {
		engine = SEARCH_ENGINES[bangEngineKey];
		query = query.replace(bang, '').trim();
	} else {
		engine = SEARCH_ENGINE_DEFAULT;
	}

	const homePage = engine[0];

	if (query === '') {
		return homePage;
	}

	if (engine.length === 1) {
		const [dHomePage, dBefore, dAfter] = SEARCH_ENGINE_DEFAULT;
		const encodedQuery = encodeURIComponent(`site:${homePage} ${query}`);

		return `${dHomePage}${dBefore}${encodedQuery}${dAfter}`;
	}

	const [, before, after] = engine;

	return `${homePage}${before}${encodeURIComponent(query)}${after}`;
}

export function getUrlForRequest(url: URL): ResultType {
	const { pathname } = url;

	if (pathname === RESERVED_PATHNAMES.search || pathname.startsWith(SEARCH_PATHNAME_FULL)) {
		return getSearchResult(url);
	}

	return getMapping(pathname);
}
