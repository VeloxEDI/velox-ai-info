---
title: "LastDelimiter"
description: "Returns the one-based position of the rightmost character belonging to a delimiter-character string, or zero when none matches."
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - delimiter
  - search
  - index
---

```Delphi
function LastDelimiter(const Delimiters, S: string): Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LastDelimiter('/\', 'C:\folder/file.txt'); // position of the final slash
end;
```

### Usage

`LastDelimiter` returns the one-based position of the rightmost character belonging to a delimiter-character string, or zero when none matches.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `Delimiters` | `string` | Individual case-sensitive characters that may match. Their order and duplication do not affect which position is returned. |
| `S` | `string` | Text searched from its final code unit toward its first. |
| Result | `Integer` | One-based matching position, or `0`. |

For example, `LastDelimiter('.:', 'A:B.C')` returns the position of `'.'`, because it is the rightmost occurrence of either candidate character. To find the last occurrence of the exact substring `'.:'`, use a substring-search strategy instead.

### Additional Technical Info
`LastDelimiter` searches `S` from right to left and returns the one-based position of the first character encountered that appears anywhere in `Delimiters`. It returns `0` when there is no match.

`Delimiters` is a set expressed as a string of individual characters; it is **not** one multi-character substring. The example is fictional and source-reviewed only.

**NUL and encoding behavior**

The installed Delphi terminal excludes NUL (`#0`) from matching. It passes `Delimiters` as a null-terminated `PChar` to `StrScan`, so an embedded NUL also terminates the effective delimiter list and characters stored after it are not considered.

The search works on Delphi string code units. Do not use half of a surrogate pair or one byte of a multibyte encoded character as a semantic delimiter. There is no locale or case folding.

This direct RTL function allocates no result string and has no external side effects. Its worst-case work is proportional to the source length multiplied by the effective delimiter-list length.

**Related entries**

- [`BreakStringLast`](BreakStringLast.md) uses this primitive but has a Velox multi-character length defect; supply it one delimiter character only.
- [`PosEx`](PosEx.md) searches forward for an exact substring from an offset.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.LastDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.LastDelimiter)
- [Free Pascal: `SysUtils.LastDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/lastdelimiter.html)

<small>Created 2026-07-15</small>
