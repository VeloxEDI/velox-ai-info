---
title: "ProcessTags"
description: "Expands Velox local, global, variable, system, secret and constant tags using the current action context."
sidebar_position: 36
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - tags
  - variables
---

```Delphi
function ProcessTags(aString: String): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ProcessTags('Run <ID> at <DATETIME>');
end;
```

### Usage

`ProcessTags` expands Velox local, global, variable, system, secret and constant tags using the current action context.

**Parameters**

| Parameter | Type | Meaning |
|---|---|---|
| `aString` | `String` | Source text containing zero or more supported tags. The argument is passed by value and is not mutated. |

**Return value**

The processed string. Text that does not match a supported tag remains unchanged unless an invalid dynamic tag raises an exception.

**Important behavior and quirks**

- `<ID>` and `<GUIDNOBRACES>` each create a new GUID without braces. `<GUID>` creates a braced GUID. Each distinct replacement call can produce a different value.
- Built-in tag matching is case-insensitive. The Azure opening marker is discovered with the exact uppercase text `<AS:`; use that spelling.
- Dynamic lookup names are taken from the tag text. A missing variable group, variable or Velox constant raises a descriptive exception. Other collection indexers can also raise for missing local, global or secret names.
- Data tags such as `<%DataView.Field%>` are handled by a different routine and are **not** expanded by this function.
- If the first `>` occurs before the first `<`, or a string has `<` but no `>`, processing exits immediately and returns the original text.
- A replacement that reproduces its own dynamic tag can cause an unbounded processing loop. Avoid self-referential local, global, variable and secret values.
- Setup values are read while the shared setup object is locked. Other global collections and the random GUID/clock sources remain external state.

### Additional Technical Info
`ProcessTags` replaces supported Velox tag syntax in a string. It uses the current script's action-local variables and the process-wide Velox configuration, variables, clock, Azure secret collection and constant map. The returned text may therefore differ by action, host, user configuration and call time.

The example is fictional and source-reviewed only. The generated identifier is intentionally not shown as a fixed expected value.

**Expansion order**

The current implementation processes categories in this exact order:

1. action locals written as `<#Name#>`;
2. globals written as `<$Name$>`;
3. variable-group values written as `<*Group.Variable*>`; native lookup prefixes the group with `V_`;
4. application and identity tags such as `<APPDATAPATH>`, `<APPLICATIONTITLE>`, `<ID>`, `<GUID>` and `<GUIDNOBRACES>`;
5. setup values such as `<COMPANYNAME>`, `<FROMEMAIL>`, `<EMAILNAME>`, `<ADMINEMAIL>` and `<NOTIFYEMAIL>` when global setup is available;
6. host-local date/time tags;
7. Azure secrets written as `<AS:Name>`; and
8. Velox integer constants written as `<!Name!>`.

Text inserted by an earlier category can be consumed by that category's continuing loop or by a later category. It is not revisited by an earlier category after processing has advanced.

**Date and time tags**

One host-local `Now` value is sampled for the date/time section of each call. The supported fields are:

| Tag | Output |
|---|---|
| `<DATESTAMP>` | `yyyymmddhhnnsszzz` |
| `<DATETIME>` | `yyyymmddhhnnss` |
| `<YYYY>`, `<YY>` | Four- or two-digit year |
| `<MM>`, `<M>` | Two-digit or unpadded month number |
| `<MMM>`, `<MMMM>` | System-default locale short or long month name |
| `<DD>`, `<D>` | Two-digit or unpadded day of month |
| `<DDD>`, `<DDDD>` | System-default locale short or long day name |
| `<HH>`, `<H>` | Two-digit or unpadded hour |
| `<NN>`, `<N>` | Two-digit or unpadded minute |
| `<SS>`, `<S>` | Two-digit or unpadded second |
| `<ZZZ>` | Unpadded millisecond value |

These are host values, not UTC values, and no timezone marker is added.

**Security and logging**

`<AS:...>` and variable tags can insert passwords, tokens or other secrets. Do not pass processed text to logs, errors or external systems unless the resulting value is intended for that destination and has been reviewed for secret disclosure. `ProcessTags` performs substitution; it does not escape the result for SQL, command lines, XML, JSON, file paths or URLs.

**Context and errors**

The public wrapper obtains locals from the current `TvxActionMan`. It is intended for action-backed script execution. A context without a usable current action cannot supply locals and may fail rather than behaving as a context-free formatter.

**Performance and concurrency**

Every dynamic category repeatedly scans and replaces from the beginning. Many tags or recursively introduced tags can make processing substantially more expensive than a single pass. Results depend on mutable process-wide state and should not be cached as though they were pure.

<small>Created 2026-07-15</small>
