---
title: "AppDataScriptPath"
description: "Returns the shared Velox Script directory and attempts to create it on demand."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - script
  - defaultdir
---

```Delphi
Function AppDataScriptPath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppDataScriptPath + 'Includes\Common.inc';
end;
```

### Usage

`AppDataScriptPath` returns the shared Velox Script directory and attempts to create it on demand.

### Additional Technical Info
`AppDataScriptPath` returns Velox's shared script-resource directory.

The normal default is `C:\ProgramData\Velox\Script\`, with a trailing backslash.

**Implementation and Velox integration**

The registered function calls `GetAppDataPath('Script\')`, which checks and attempts to create the directory. Separately, the product's action manager replaces the `<DEFAULTDIR>` tag in script-related text with this same `AppDataScriptPath`. The function is therefore the authoritative runtime expansion for that tag.

Only the top-level `Script\` directory is ensured. Appending `Includes\` or another child does not create that child. The accessor does not load, compile, authorize or validate a script file. Treat deployed scripts/includes as executable configuration: use controlled filenames and permissions, and do not form include paths from untrusted data.

The directory lookup can perform filesystem I/O. Velox ignores the Boolean `ForceDirectories` result, so actual file operations must handle missing path and access errors. Changing the underlying shared content while flows execute can produce version inconsistency unless deployment is coordinated.

**Related entries and official references**

- [`DefaultDir`](DefaultDir.md) documents the unindexed generated tag entry.
- [`AppDataPath`](AppDataPath.md) defines the root-selection rules.
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
