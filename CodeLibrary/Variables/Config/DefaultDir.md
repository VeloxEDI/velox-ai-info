---
title: "DefaultDir"
description: "Contains a compile-time snapshot of the General Setup default file path."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - default-directory
  - path
---

```Delphi
DefaultDir = <configured string value>
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DefaultDir + 'Inbound\orders.xml';
end;
```

### Usage

`DefaultDir` contains a value captured when the script is compiled of the General Setup default file path.

**Lifecycle and safety**

- It is immutable and captured at compilation. A later General Setup change does not update an already compiled script.
- It can identify a local drive, UNC path or any string accepted into Setup; file availability and permissions depend on the executing Designer/service account.
- Concatenation performs no traversal protection. Do not append untrusted path fragments.
- File operations can race other processes and must handle missing paths, access, sharing and disk errors.

Use the named [`AppDataScriptPath`](AppDataScriptPath.md), [`AppDataFilePath`](AppDataFilePath.md) or other Config path when the intended location is specifically a Velox-managed shared directory.

### Additional Technical Info
`DefaultDir` is the value of General Setup's `DefaultFilePath` at the time the script is compiled.

**Effective declaration**

The current generated `_Index.json` contains a null record for this identifier and the physical page is consequently an acknowledged unindexed anomaly. Product source is authoritative: `RegisterConstants` locks `gSetup` and adds a PascalScript string constant from `lSetup.DefaultFilePath`.

The Setup setter ensures a non-empty configured value has a trailing path delimiter; an empty value stays empty. The constant itself does not check the directory, create it, resolve a relative path or grant access. Appending a filename to an empty value produces a path relative to the process current directory, which is usually undesirable—validate that `DefaultDir <> ''` when configuration requires an absolute base.

<small>Created 2026-07-19</small>
