# Velox Code Library rules

This folder is the authoritative generated Velox scripting reference.

Owner: Cam Hart.

Publication classification: `public`. The Velox Docusaurus site reads this folder directly and publishes it beneath `/code-library/`; do not generate internal, restricted, customer-specific or secret material here.

- Only modify existing generated reference pages unless explicitly instructed otherwise.
- Do not create, rename, move or delete reference pages or change generated hierarchy/index structures.
- Verify syntax, parameters, types, return values, errors and examples against current implementation in `velox`.
- Preserve generator-compatible Markdown and identifiers; apply the governed item headings below, and add explanation, safe examples, remarks and related links in place.
- Every generated item page must place its exact scripting declaration in an unlabelled `Delphi` code fence immediately after front matter and before `### Example`. Do not add a Declaration heading or repeat the declaration later in the page.
- The item body order is `### Example`, `### Usage`, then `### Additional Technical Info`. Usage gives succinct, exact, everyday Velox scripting guidance; implementation detail belongs under Additional Technical Info. Do not retain `### Description` after migrating a page.
- Write Usage only in terms of the behaviour a script user sees. Include the call contract, parameter meanings, return/result, required state or follow-up, format/option rules and material user-visible cautions. Do not explain Usage with inheritance or implementation vocabulary such as descendant, ancestor, concrete, native, Delphi, PascalScript, wrapper, adapter, registration or internal call paths; say Velox where a product name is needed.
- Never add secrets, customer data or unsupported behaviour.
- Report any improvement that belongs in the generator rather than applying a fragile manual workaround.
- Run `npm.cmd run validate:codelibrary` from the repository root after any Code Library change. Use `npm.cmd run validate:codelibrary:strict` when correcting generator/index drift.

Repository framework rules still apply where compatible; this preservation rule takes precedence for generated content.
