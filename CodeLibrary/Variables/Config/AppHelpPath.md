---
title: "AppHelpPath"
description: "Returns the expected full filename of the installed Velox CHM help file beside the executable."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - help
  - chm
---

```Delphi
Function AppHelpPath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppHelpPath;
end;
```

### Usage

`AppHelpPath` returns the expected full filename of the Velox CHM help file beside the executable.

### Additional Technical Info
`AppHelpPath` returns the expected complete path and filename of the installed compiled Velox help file.

The value is constructed as [`AppPath`](AppPath.md) + `Help\` + `Velox Help.chm`. For an executable in `C:\Program Files\Velox\`, the result would be `C:\Program Files\Velox\Help\Velox Help.chm`.

Unlike the `AppData*Path` directory functions, this result is a **file path** and has no trailing backslash. The implementation does not test that the directory or CHM file exists, create anything, open Help, or fall back to the Docusaurus site. It simply returns the convention derived from the current host executable location.

The function acquires the shared path critical section and obtains the cached executable path. It has no normal filesystem I/O after initialization. Because Designer, VeloxService and other executables can reside in different locations, the returned path is specific to the currently executing host.

**Related entries**

- [`AppPath`](AppPath.md) is the base executable directory.
- [`AppName`](AppName.md) identifies the current host executable.

No Free Pascal or Embarcadero terminal link is applicable to the final operation: the public behaviour is Velox's fixed path concatenation.

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
