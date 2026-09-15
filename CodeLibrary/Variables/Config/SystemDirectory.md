---
title: "SystemDirectory"
description: "Returns the Windows system directory with a trailing backslash through Velox's fixed-buffer wrapper."
sidebar_position: 29
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - system32
  - windows
---

```Delphi
Function SystemDirectory : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := SystemDirectory;
end;
```

### Usage

`SystemDirectory` returns the Windows system directory with a trailing backslash through Velox's fixed-buffer function.

### Additional Technical Info
`SystemDirectory` returns the directory from which Windows loads shared system files, normally a path such as `C:\Windows\System32\`, with a trailing backslash.

**Implementation and failure quirk**

Velox allocates a `MAX_PATH` PChar buffer with Delphi `StrAlloc`, calls Win32 `GetSystemDirectory(buffer, MAX_PATH)`, converts the null-terminated buffer to a Delphi string, appends `\` when absent, and releases the buffer with `StrDispose`.

The wrapper ignores the Win32 return value. It therefore does not detect API failure (`0`) or a required length greater than the buffer. It then evaluates `Result[Length(Result)]` without first checking for an empty result. On failure this can produce a range/access error or other build-dependent unsafe behavior instead of a clean empty string. Exceptions propagate to the script.

The function only returns a path. It does not authorize executing programs, account for file-system redirection, validate a DLL/executable or open anything. Do not use it to construct a command from untrusted text, and prefer normal product APIs over launching system binaries.

**Official references**

- [Microsoft: GetSystemDirectoryW](https://learn.microsoft.com/en-us/windows/win32/api/sysinfoapi/nf-sysinfoapi-getsystemdirectoryw)
- [Embarcadero: StrAlloc](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StrAlloc)
- [Embarcadero: StrDispose](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StrDispose)
- [Free Pascal: StrAlloc](https://www.freepascal.org/docs-html/rtl/sysutils/stralloc.html) and [StrDispose](https://www.freepascal.org/docs-html/rtl/sysutils/strdispose.html) (compatibility references)

<small>Created 2026-07-19</small>
