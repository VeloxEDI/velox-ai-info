---
title: "ExtractFileExt"
description: "Returns the final extension, including its leading dot, from a file-name string."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - paths
  - extension
---

```Delphi
Function ExtractFileExt( const FileName : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExtractFileExt('C:\Fictional\archive.tar.gz');
  // .gz
end;
```

### Usage

`ExtractFileExt` returns the final extension, including its leading dot, from a file-name string.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | File-name or path text to inspect. |

**Returns**

The suffix beginning with the last dot after the final recognised path/drive delimiter, or an empty string when no such dot exists.

**Behaviour**

- `'report.csv'` returns `'.csv'`.
- `'archive.tar.gz'` returns `'.gz'`.
- `'report'` returns `''`.
- `'report.'` returns `'.'`.
- Directory and drive text are not included in the result.

**Errors**

There is no normal path-content exception. Argument conversion or result allocation can fail through the usual runtime path.

### Additional Technical Info
`ExtractFileExt` returns the final extension parsed from `FileName`, including its leading dot. It examines only the string and does not require a real file.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The Velox wrapper calls installed `System.SysUtils.ExtractFileExt`. Its Windows implementation finds the last dot, backslash or drive colon. It returns a suffix only if the winning delimiter is a dot; the dot is retained in the returned string.

**Edge cases and quirks**

- A dotfile such as `'.env'` returns `'.env'`; the whole name is considered the extension.
- A dot in a directory segment is ignored when a recognised backslash follows it.
- On the current Windows build, forward slash is not a path delimiter for this routine. Mixed or URL-style paths can therefore treat a dot from an earlier segment as the extension delimiter.
- No case conversion or validation occurs. `'.CSV'`, spaces and unusual characters are returned exactly.
- The function does not infer compound extensions such as `'.tar.gz'`.

**Side effects**

None.

**Performance and concurrency**

The routine scans backward and copies at most one suffix, so work is linear in path length. It has no mutable shared state.

**Remarks**

Compare the result using the case rules required by the receiving system. An extension is a naming convention, not proof of file content or format.

**Related entries**

- [`ChangeFileExt`](ChangeFileExt.md) replaces or appends the final extension text.
- [`ExtractFileName`](ExtractFileName.md) returns the name and extension together.
- [`MatchesMask`](MatchesMask.md) can compare a name against a file-mask convention.

**External references**

- [Embarcadero `System.SysUtils.ExtractFileExt`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileExt)
- [Free Pascal `ExtractFileExt`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfileext.html) - compatible API context; installed Delphi source defines Velox's exact delimiter handling.

<small>Created 2026-07-15</small>
