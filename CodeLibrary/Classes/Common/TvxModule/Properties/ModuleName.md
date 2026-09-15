---
title: ModuleName
description: Gets or sets the live module name without validating uniqueness, saving configuration or updating other loaded references.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, module, name, configuration, persistence]
---

```Delphi
property ModuleName: string read write;
```

### Example

```Delphi
function QualifiedLabel(const Module: TvxDBCon): string;
begin
  Result := Module.ModuleType + ' / ' + Module.ModuleName;
end;
```

### Usage

`ModuleName` gets or sets the live module name without validating uniqueness, saving configuration or updating other loaded references.

- Prefer read-only use in scripts. Rename modules through Velox configuration tooling, which can check dependencies and persist coherently.
- Never treat the name as stable identity; use [`FID`](FID.md) or [`FIDS`](FIDS.md).
- Do not pass it unsanitised into paths, SQL or external protocols.

### Additional Technical Info
`ModuleName` is the live human-readable name of a Velox module. It is widely used in navigation, lookups, relation descriptions, logs and generated export filenames.

#### Source-backed behaviour

The getter and setter directly access `FModuleName`; assignment performs no trimming, length check, invalid-filename filtering, uniqueness query or persistence. New concrete modules assign a default name, and normal load/transfer paths populate the field.

Native add/save SQL writes only the first 255 characters to the module table. The live/template value and some relation SQL paths use the full field, so an overlength value can produce inconsistent names across stored representations. Native `SaveNew` makes a name unique, but ordinary assignment and the base save setter do not.

Changing the value does not rename database rows, update relation references, refresh navigation/caches or notify other object instances. If later native code saves this same object, the change may then propagate with its usual revision and relation effects.

The default base export filename embeds this value without making it filesystem-safe.

<small>Created 2026-07-15</small>
