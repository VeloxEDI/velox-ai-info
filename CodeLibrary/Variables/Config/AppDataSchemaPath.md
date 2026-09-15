---
title: "AppDataSchemaPath"
description: "Returns the shared Velox Schema directory and attempts to create it when missing."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - schema
  - path
---

```Delphi
Function AppDataSchemaPath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppDataSchemaPath + 'Orders.xsd';
end;
```

### Usage

`AppDataSchemaPath` returns the shared Velox Schema directory and attempts to create it when missing.

### Additional Technical Info
`AppDataSchemaPath` returns the machine-wide directory used for schema resources.

The default path is normally `C:\ProgramData\Velox\Schema\`; it includes a trailing backslash.

**Implementation and use**

The PascalScript binding invokes `GetAppDataPath('Schema\')`. The helper checks the composed directory and calls `ForceDirectories` if it is missing, protected by the product's process-wide path critical section.

The function only supplies a directory string. It does not choose an XSD/JSON schema, validate schema syntax, load a file, resolve imports, check versions or associate a schema with a file definition. Prefer stable, explicit filenames and controlled deployment because changing a shared schema can affect multiple flows or Designer sessions.

Reading the accessor can perform I/O. The ignored `ForceDirectories` return means callers must handle an absent/unwritable directory when opening a file. Other processes are not serialized by the in-process lock.

**Related entries and official references**

- [`AppDataPath`](AppDataPath.md) defines the shared root.
- [`AppDataScriptPath`](AppDataScriptPath.md) is the separate script-resource directory.
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
