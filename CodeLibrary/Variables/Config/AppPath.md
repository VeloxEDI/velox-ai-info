---
title: "AppPath"
description: "Returns the cached directory of the Velox host executable, including a trailing path delimiter."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - executable
  - path
---

```Delphi
Function AppPath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppPath + 'Help\Velox Help.chm';
end;
```

### Usage

`AppPath` returns the cached directory of the Velox host executable, including a trailing path delimiter.

### Additional Technical Info
`AppPath` returns the directory containing the executable that hosts the current script. Its result includes a trailing backslash.

**Implementation and behaviour**

At unit initialization Velox evaluates `IncludeTrailingPathDelimiter(ExtractFilePath(ParamStr(0)))` and caches the string in `gAppPath`. Later calls only return that cached value under the path critical section.

The directory belongs to the current process, so Designer and service executions can return different values. It is not the current working directory and does not change if the working directory changes. The function performs no existence, write-access or file check on each call.

Installed executable directories are commonly protected. Do not assume scripts can or should write beside the executable; use an appropriate [`AppDataPath`](AppDataPath.md) subdirectory for mutable machine-wide data. The path is useful for locating installed, versioned read-only resources when that deployment convention is intentional.

**Official references**

- [Embarcadero: ParamStr](https://docwiki.embarcadero.com/Libraries/Athens/en/System.ParamStr)
- [Embarcadero: ExtractFilePath](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFilePath)
- [Embarcadero: IncludeTrailingPathDelimiter](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter)
- [Free Pascal: ExtractFilePath](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilepath.html)
- [Free Pascal: IncludeTrailingPathDelimiter](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html) (compatibility references)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
