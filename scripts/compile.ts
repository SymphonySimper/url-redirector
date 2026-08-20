import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { Mappings, MappingURLs, SearchEngine } from '../src/types.ts';
import MAPPING_CONFIG from '../src/config/mappings.ts';
import { type RawSearchEngine, SEARCH_ENGINE_DEFAULT, SEARCH_ENGINES, SEARCH_TERMS_PLACEHOLDER } from '../src/config/search.ts';
import { RESERVED_PATHNAMES, SEARCH_ENGINE_KEY_PATTERN } from '../src/constants.ts';

const RESERVED_PATHNAMES_VALUES = Object.values(RESERVED_PATHNAMES);

const SEARCH_ENGINE_KEY_REGEX = new RegExp(`^${SEARCH_ENGINE_KEY_PATTERN}$`);

function resolveUrl(value: string): string {
	const resolved = value.includes('://') ? value : `https://${value}`;

	if (!URL.canParse(resolved)) {
		throw new Error(`${value} is not a valid URL`);
	}

	if (!['https:', 'http:'].includes(new URL(resolved).protocol)) {
		throw new Error(`URL must use HTTP or HTTPS: ${value}`);
	}

	return resolved;
}

function compileMappings() {
	const urls: MappingURLs = [];
	const mappings = new Map<keyof Mappings, Mappings[string]>();

	for (const [href, aliases] of Object.entries(MAPPING_CONFIG)) {
		if (aliases.length === 0) {
			throw new Error(`Aliases cannot be empty: ${href}`);
		}

		const url = resolveUrl(href);
		urls.push(url);

		for (const alias of aliases) {
			if (alias !== encodeURIComponent(alias)) {
				throw new Error(`Alias must be URL safe: ${alias}`);
			}

			const pathname = `/${alias}`;

			if (RESERVED_PATHNAMES_VALUES.includes(pathname)) {
				throw new Error(`${pathname} is reserved.`);
			}

			if (mappings.has(pathname)) {
				throw new Error(`Duplicate mapping alias: ${pathname} maps to both ${urls[mappings.get(pathname)!]} and ${url}.`);
			}

			mappings.set(pathname, urls.length - 1);
		}
	}

	return { urls, mappings: Object.fromEntries(mappings) };
}

function isSite(engine: RawSearchEngine): engine is { site: string } {
	return Object.hasOwn(engine, 'site');
}

function compileSearchEngines() {
	if (isSite(SEARCH_ENGINES[SEARCH_ENGINE_DEFAULT])) {
		throw new Error(`Default search engine cannot be a 'site' search: ${SEARCH_ENGINE_DEFAULT}`);
	}

	const engines = new Map<string, SearchEngine>();

	for (const [key, value] of Object.entries(SEARCH_ENGINES)) {
		if (!SEARCH_ENGINE_KEY_REGEX.test(key)) {
			throw new Error(`Search engine key must match ${SEARCH_ENGINE_KEY_REGEX}: ${key}`);
		}

		let engine: SearchEngine;

		if (isSite(value)) {
			engine = [resolveUrl(value.site)];
		} else {
			if (!value.search.includes(SEARCH_TERMS_PLACEHOLDER)) {
				throw new Error(`Search does not contain terms placeholder (${SEARCH_TERMS_PLACEHOLDER}).`);
			}

			const split = value.search.split(SEARCH_TERMS_PLACEHOLDER);
			engine = [resolveUrl(value.url), split.at(0) ?? '', split.at(-1) ?? ''];
		}

		engines.set(key, engine);
	}

	return Object.fromEntries(engines);
}

const compiledMappings = compileMappings();
const compiledSearchEngines = compileSearchEngines();

const content = `
	import type { MappingURLs, Mappings, SearchEngines, ActualSearchEngine } from './types.ts';

	export const URLS: MappingURLs = ${JSON.stringify(compiledMappings.urls)};
	export const MAPPINGS: Mappings = ${JSON.stringify(compiledMappings.mappings)};

 	export const SEARCH_ENGINES: SearchEngines = ${JSON.stringify(compiledSearchEngines)};
 	export const SEARCH_ENGINE_DEFAULT: ActualSearchEngine = ${JSON.stringify(compiledSearchEngines[SEARCH_ENGINE_DEFAULT])};
`;

await writeFile(join(import.meta.dirname, '../src/generated.ts'), content);
