---
title: FilePattern
description: Stores the raw tagged wildcard used for inbound discovery, custom matching, monitoring and wildcard-derived transport save names.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, file-pattern, wildcard]
---

```Delphi
property FilePattern: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.FilePattern
  else
    Value := '';
end;
```

### Usage

`FilePattern` stores the raw tagged wildcard used for inbound discovery, custom matching, monitoring and wildcard-derived transport save names.

**Consumers**

The processed pattern has several distinct consumers:

- [`FilePath`](FilePath.md) concatenates it to ProcessFileDir and uses Velox `FindFirst` with attribute mask 0, returning only the first normal-attribute match.
- [`MatchesSearchPattern`](../Methods/MatchesSearchPattern.md) compares only the candidate basename using Velox's case-insensitive whole-string `*`/`?` matcher.
- service file monitoring and monitor descriptions/path snapshots use the processed directory/pattern;
- inbound transport implementations use it when selecting remote/local files; and
- [`FileSaveName`](FileSaveName.md) repurposes the pattern as an output name by removing all question marks and replacing every asterisk with the same new GUID.

These consumers are not interchangeable. A value acceptable to one may be surprising or invalid for another.

**Tag and wildcard rules**

ProcessFilePattern applies the general tag processor only. It has no special `<DEFAULTDIR>` replacement, no definition data-field processing and no FileName safe-name conversion. The custom matcher is basename-only, case-insensitive, requires the whole value to match and truncates both pattern and candidate to 400 characters before recursive matching.

`ProcessFilePattern` is not available as a script method. Read `FilePattern` to inspect the configured template and use the operations documented above to apply it.

**Errors, security and quirks**

- Blank patterns and path separators are accepted without validation.
- Dynamic tags can change the search set between reads; monitor consumers may retain values captured for their own lifecycle.
- Discovery order is filesystem-dependent; “first” is not a stable oldest/newest ordering.
- A broad pattern such as `*` can process unintended files. Keep inbound directories dedicated and use the narrowest practical suffix/prefix.
- Pattern/tag text derived from untrusted data can escape the intended search construction or disclose values in monitoring/log text.
- FilePattern is mutable, with no locking around concurrent discovery/monitoring reads.

### Additional Technical Info
`FilePattern` stores FileCon's raw file-search/wildcard template. A new FileCon defaults to `*`.

The direct getter/setter performs no tag processing, syntax validation, search, matching, sanitisation, logging or configuration save. Native `ProcessFilePattern` resolves the current action-local and general tags, but its current compiler-registration omission means it has no callable Code Library page.

**Related entries**

- `ProcessFilePattern` — native/runtime-only tag resolution; currently omitted from the script compiler and generated pages.
- [`MatchesSearchPattern`](../Methods/MatchesSearchPattern.md) — exact custom matching algorithm.
- [`FilePath`](FilePath.md) — destructive local discovery.
- [`FileSaveName`](FileSaveName.md) — wildcard-to-name transformation.
- [`FileName`](FileName.md) — separate outbound save template.

<small>Created 2026-07-15</small>
