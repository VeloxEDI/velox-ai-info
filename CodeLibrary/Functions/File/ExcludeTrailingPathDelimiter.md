---
title: "ExcludeTrailingPathDelimiter"
description: "Removes one trailing platform path delimiter from a path string when present."
sidebar_position: 8
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
Function ExcludeTrailingPathDelimiter( const S : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExcludeTrailingPathDelimiter('C:\Fictional\Inbound\');
  // C:\Fictional\Inbound
end;
```

### Usage

`ExcludeTrailingPathDelimiter` removes one trailing platform path delimiter from a path string when present.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Path text to transform. |

**Returns**

`S` without its final recognised delimiter, or `S` unchanged when it does not end in that delimiter.

**Behaviour**

- `'C:\Folder\'` becomes `'C:\Folder'`.
- `'C:\Folder'` is unchanged.
- An empty string is unchanged.
- Repeated trailing delimiters are processed one per call: `'C:\Folder\\'` becomes `'C:\Folder\'`.

**Errors**

No normal path-content error is raised. Argument conversion or memory allocation can still fail through the normal runtime path.

**Usage notes**

Use this helper only when a consumer explicitly requires no trailing separator. Do not apply it to an unknown root path without checking the result.

### Additional Technical Info
`ExcludeTrailingPathDelimiter` removes one platform path delimiter from the end of `S` when it is present. It is a lexical string operation and does not inspect or modify the file system.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox's wrapper calls installed `System.SysUtils.ExcludeTrailingPathDelimiter`. The routine copies `S`, calls the installed [`IsPathDelimiter`](IsPathDelimiter.md) for `High(S)`, and shortens the result by one UTF-16 character only when that test succeeds.

**Edge cases and quirks**

- On the current Windows build, `PathDelim` is backslash. A trailing forward slash is not removed.
- A drive root such as `'C:\'` becomes `'C:'`. The routine does not preserve root semantics.
- A lone `'\'` becomes an empty string. Review root and UNC-share inputs before applying it blindly.
- No duplicate-separator collapse, `.`/`..` resolution, drive expansion, validation or existence check occurs.
- The historical “MBCS enabled” implementation detail remains in the RTL, although current script strings are Unicode.

**Side effects**

None.

**Performance and concurrency**

The result copy is linear in string length. There is no mutable shared state.

**Related entries**

- [`IncludeTrailingPathDelimiter`](IncludeTrailingPathDelimiter.md) ensures one final platform delimiter.
- [`IsPathDelimiter`](IsPathDelimiter.md) performs the underlying one-position test.
- [`EnsureCorrectPathDelimiter`](EnsureCorrectPathDelimiter.md) is a Velox-owned path helper with a different contract.

**External references**

- [Embarcadero `System.SysUtils.ExcludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExcludeTrailingPathDelimiter)
- [Free Pascal `ExcludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/excludetrailingpathdelimiter.html) - compatible API context; platform delimiter details come from the installed Delphi build.

<small>Created 2026-07-15</small>
