---
title: TvxVariable
description: Stores a named Variant with optional encryption, typed conversion aliases and a lazily owned client dataset.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, variant, encryption]
---

```Delphi
TvxVariable = class(TPersistent)
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var WorkVar: TvxVariable;
begin
  WorkVar := Locals['WorkValue'];
  WorkVar.AsStringTrim := '  Example  ';
  Value := WorkVar.AsString;
end;
```

### Usage

`TvxVariable` stores a named Variant with optional encryption, typed conversion aliases and an optional client dataset.

### Additional Technical Info
`TvxVariable` is Velox's named mutable Variant container. Variable lists, variable groups, Settings, Locals, Globals and AzureSecrets expose instances with different ownership/lifetime rules.

The object owns a re-entrant monitor, an optional lazily created `TvxClientDataSet` and an internal Variant. Value, most aliases and dataset create/free operations lock the monitor, but returned datasets and object references remain usable after unlock and are not lifetime-protected.

**Value and encryption**

[`Value`](TvxVariable/Properties/Value.md) is the canonical read/write path. When native Encrypted is true, normal Value writes encrypt the string representation and normal reads decrypt it. Component loading/writing has special raw-storage paths. AsString, AsSQL and AsInfo use Value and therefore honour decryption.

Typed numeric/Boolean/date setters write the internal Variant directly, bypassing Value validation and encryption. Their getters also read the raw Variant, so they are unsafe aliases for encrypted variables. This is an implementation quirk, not a general conversion guarantee.

**Conversions and data**

- String aliases use Delphi `VarToStr`; Trim variants remove leading/trailing spaces and control characters.
- Float/Integer aliases catch failed Variant coercion and return zero; DateTime propagates failed conversion.
- Boolean accepts Boolean values, nonzero ordinals, or exactly `True`/`true`; unsupported types can leave an undefined result.
- SQL aliases create quoted SQL text, but their setters contain a lossy substring calculation and are not safe round-trip parsers.
- [`Data`](TvxVariable/Properties/Data.md) lazily creates a dataset named from Code; [`FreeData`](TvxVariable/Methods/FreeData.md) destroys it.

Code's setter locks, but its getter deliberately does not. Treat shared variables as individually synchronized scalar snapshots, not as atomic multi-property records. Do not free list/group-owned variables, and do not retain their datasets across FreeData or owner/cache invalidation.

The runtime importer contains a constructor binding but the compiler registration does not declare `Create`, and no generated constructor entry exists. Do not rely on constructing this class in Velox scripts.

<small>Created 2026-07-15</small>
