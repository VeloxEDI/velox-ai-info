---
title: "IncludeTrailingPathDelimiter"
description: "Appends the platform path delimiter when a path string does not already end with one."
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - paths
  - delimiter
---

```Delphi
Function IncludeTrailingPathDelimiter( const S : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IncludeTrailingPathDelimiter('C:\Fictional\Inbound');
  // C:\Fictional\Inbound\
end;
```

### Usage

`IncludeTrailingPathDelimiter` appends the platform path delimiter when a path string does not already end with one.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Directory/path text to transform. |

**Returns**

The original text when it already ends in `PathDelim`; otherwise the original text followed by one `PathDelim`.

**Behaviour**

- `'C:\Folder'` becomes `'C:\Folder\'` on Windows.
- `'C:\Folder\'` is unchanged.
- `''` becomes `'\'` on Windows.
- The result is suitable for simple lexical concatenation only after the base path and suffix have been validated.

**Errors**

No normal path-content exception is raised. Conversion and allocation failures can propagate.

**Usage notes**

Check for empty and drive-relative input before calling when those forms are not allowed. This routine is not a path canonicaliser or security boundary.

### Additional Technical Info
`IncludeTrailingPathDelimiter` returns `S` with the platform path delimiter appended unless the string already ends in that delimiter. It changes only text and does not create or inspect a directory.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The Velox wrapper calls installed `System.SysUtils.IncludeTrailingPathDelimiter`. The RTL copies `S`, tests `High(S)` using [`IsPathDelimiter`](IsPathDelimiter.md), and appends `PathDelim` when the test is false.

**Edge cases and quirks**

- The current Windows `PathDelim` is backslash. A string ending in `/` is not accepted as already delimited; a backslash is appended, producing a mixed `'/\'` ending.
- Empty input becomes the current-drive root syntax `'\'`, not an empty value and not a configured working directory.
- The function does not collapse duplicates, resolve relative segments, add a drive, convert URL separators or check existence.
- A drive-relative value such as `'C:'` becomes `'C:\'`, which changes its lexical meaning from current directory on drive C to the drive root.
- Existing trailing whitespace remains before the appended delimiter.

**Side effects**

None.

**Performance and concurrency**

The function copies the input and may append one character. Work is linear in length, with no shared mutable state.

**Related entries**

- [`ExcludeTrailingPathDelimiter`](ExcludeTrailingPathDelimiter.md) removes one final platform delimiter.
- [`IsPathDelimiter`](IsPathDelimiter.md) provides the terminal delimiter test.
- [`IncludeCorrectPathDelimeter`](IncludeCorrectPathDelimeter.md) and [`EnsureCorrectPathDelimiter`](EnsureCorrectPathDelimiter.md) are Velox-owned alternatives with separate contracts.

**External references**

- [Embarcadero `System.SysUtils.IncludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter)
- [Free Pascal `IncludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html) - compatible API context; the installed Windows `PathDelim` defines Velox's exact output.

<small>Created 2026-07-15</small>
