# URL Redirector

A Cloudflare Worker. It changes short paths into full URLs. It also sends your searches to
other search engines.

## Use

The examples use `go.example.com` as the address.

| You go to          | The worker sends you to                   |
| ------------------ | ----------------------------------------- |
| `/gh`              | `https://github.com/repos`                |
| `/c/111`           | `https://symphonysimper.com/color/111`    |
| `/s?q=rust traits` | Google, and it searches for `rust traits` |
| `/s/rust traits`   | the same                                  |
| `/s?q=!b rust`     | Brave, and it searches for `rust`         |
| `/s?q=@gh`         | `https://github.com/repos`                |
| `/nope`            | 404                                       |

- Aliases are case-sensitive. `/GH` gives a 404.
- Mappings drop the query string. `/gh?tab=stars` goes to `https://github.com/repos`.
- A bang picks a different engine. It can be in any position. The worker uses the first one only.
- `@` in a search uses the mappings.

To use it in your browser, add it as a search engine with this address:
`https://go.example.com/s?q=%s`.

## Configure

Mappings are in `src/config/mappings.ts`. The key is the destination. The value is a list of
aliases.

```ts
'github.com/repos': ['github', 'gh'],
```

Search engines are in `src/config/search.ts`. The key is the bang.

```ts
b: { url: 'search.brave.com', search: `/search?q=${SEARCH_TERMS_PLACEHOLDER}` },
rt: { site: 'www.reddit.com' },
```

`b` has its own search page. `{searchTerms}` is the place for the query.

`rt` has no search page. For these, the worker searches for
`site:https://www.reddit.com <query>` with the default engine.

The build checks both files. A mistake stops the build and tells you the reason.

## Commands

| Command       | What it does            |
| ------------- | ----------------------- |
| `just init`   | Installs the packages   |
| `just dev`    | Runs it on your machine |
| `just deploy` | Sends it to Cloudflare  |
| `just format` | Formats the files       |
