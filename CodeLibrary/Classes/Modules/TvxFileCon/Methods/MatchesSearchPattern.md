---
title: MatchesSearchPattern
description: Tests a filename's basename against the tag-expanded FilePattern using Velox wildcard matching.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - file-connection
  - wildcard
  - pattern-matching
---

```Delphi
function MatchesSearchPattern(aFileName: String): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.MatchesSearchPattern('Inbound-20260719.csv')
  else
    Value := False;
end;
```

### Usage

`MatchesSearchPattern` tests a filename's basename against the tag-expanded FilePattern using Velox wildcard matching.

**Wildcard semantics**

- Matching is case-insensitive because both source and pattern are uppercased first.
- `*` matches zero or more characters; `?` matches exactly one character.
- No character classes, regular expressions, alternation or multi-pattern list syntax is implemented.
- The complete basename must match. Directory text in `aFileName` is ignored.
- Both source and pattern are copied into fixed buffers at a maximum of 400 characters; longer values are silently truncated before matching.

**Errors and quirks**

Tag processing can use mutable locals/globals/time and can raise for invalid or missing dynamic tags. A pattern containing fresh-value tags such as GUID/ID can differ on each call. Empty patterns and unresolved tag text follow the literal wildcard algorithm; this method does not validate configuration or search the filesystem.

Recursive `*` matching can become expensive for long/ambiguous patterns. Although the 400-character cap bounds input, avoid repeated broad/complex calls in tight record loops.

### Additional Technical Info
`MatchesSearchPattern` returns whether the final filename portion of `aFileName` matches this connection's processed `FilePattern`.

**Implementation**

The method applies Delphi-style basename extraction to the argument, obtains the stored pattern through native `ProcessFilePattern`, and passes both strings to Velox's custom recursive matcher.

`ProcessFilePattern` expands the same action-local/system tag categories as other FileCon string processing, but it does not replace `<DEFAULTDIR>` or process definition data tags. The native runtime importer registers that helper, while the compiler importer does not; scripts can use it only indirectly through this method and other FileCon internals.

**Side effects and security**

No file is opened and the supplied string is not modified. The locals reference can be lazily cached on the FileCon, and tag expansion can access sensitive context; do not log processed patterns if they could contain secrets.

**Related entries**

- [`ProcessFileName`](ProcessFileName.md) — output-name tag handling and sanitisation.
- [`ProcessFileDir`](ProcessFileDir.md) — processed directory used by native discovery.
- [`FilePattern`](../Properties/FilePattern.md) — stored pattern configuration.
- [`TvxFileCon`](../../TvxFileCon.md) — state and ownership model.

<small>Created 2026-07-15</small>
