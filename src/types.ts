export type MappingURLs = Array<string>;
export type Mappings = Record<string, number>;

export type SiteSearchEngine = [homePage: string];
export type ActualSearchEngine = [homePage: string, before: string, after: string];
export type SearchEngine = SiteSearchEngine | ActualSearchEngine;
export type SearchEngines = Record<string, SearchEngine>;
