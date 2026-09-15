---
title: DefaultFilePath
description: Gets or sets the global base directory used to resolve default-directory tags and initialise file-processing objects.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, default-directory, filesystem]
---

```Delphi
property DefaultFilePath: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.DefaultFilePath
  else
    Value := '';
end;
```

### Usage

`DefaultFilePath` gets or sets the global base directory used to resolve default-directory tags and initialise file-processing objects.

**Consumers and snapshots**

- File connections/engines, LAN transports and action managers copy the value into execution-owned state.
- Directory processors replace `<DEFAULTDIR>` using their copied value.
- The `DefaultDir` script constant is captured from Setup when the script is compiled.
- Shell and designer tools read it for default search/open locations.

Changing Setup.DefaultFilePath does not retroactively rewrite already-created file connections, engines, transports, action managers or compiled constants. New consumers can see the new value while existing ones continue with their snapshot.

**Safety and side effects**

The property itself performs no filesystem I/O. Later consumers can enumerate, create, read, write, move or delete files under a processed path, using the Velox process/service identity. A trailing separator is not proof that the path is absolute, contained, safe or accessible.

Avoid assigning user-controlled or relative paths without canonical path-containment checks. Script assignment is shared across the Velox process and in-memory; it neither persists itself nor changes previously expanded paths.

### Additional Technical Info
`DefaultFilePath` is Velox's process-wide base directory for `<DEFAULTDIR>` expansion and default file locations.

The setter retains an empty string unchanged. For any nonempty value it applies Delphi `IncludeTrailingPathDelimiter`, adding a missing final separator. It does not expand environment variables/tags, canonicalise the path, create a directory, check access or save setup.

**Delphi/Free Pascal references**

- [Embarcadero `System.SysUtils.IncludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter) — exact native delimiter helper used for nonblank assignments.
- [Free Pascal `IncludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html) — compatible trailing-delimiter behaviour.

<small>Created 2026-07-15</small>
