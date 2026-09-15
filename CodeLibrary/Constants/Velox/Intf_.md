---
title: Intf_
description: Records an unsupported Code Library collision created by six blank reserved interface registrations and explains why scripts must not use it.
sidebar_position: 303
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - interface
  - reserved
  - generator-quirk
  - do-not-use
---

```Delphi
Intf_ = 18
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Do not use Intf_; select the named interface required by the flow.
  Value := Intf_Order;
end;
```

### Usage

`Intf_` records an unsupported Code Library collision created by six blank reserved interface registrations and explains why scripts must not use it.

### Additional Technical Info
> Do not use `Intf_` in scripts or configuration.

`Intf_` is not a supported Velox interface identifier. The page exists because the scripting importer registers the same incomplete name six times for reserved database slots 14-19, and the Code Library index collapsed those duplicate registrations into one generated record.

The current `_Index.json` declaration displays `Intf_ = 18`. That value is a generator/index collision artefact, not a stable public contract for reserved interface 18.

#### Generated declaration

This declaration reports the current Code Library snapshot only. It must not be used as proof of the effective runtime value.

#### Implementation

The fresh-build `Interface` table reserves rows 14, 15, 16, 17, 18 and 19. Every row has a blank `Code`, is not a module, is not configured and is inactive.

`vxVeloxEDI.pas` deliberately declares no native `Intf_` constant. However, `uPSI_vxVeloxEDI.pas` contains six registrations with the identical name `Intf_` and values 14 through 19, plus six duplicate blank-code registrations named `Intf__String`.

The current Code Library index retained one numeric record and reports value 18. It did not produce an `Intf__String.md` page. `InitVeloxConstMap` has no `Intf_` entry.

#### Behaviour

No reliable supported behaviour is defined for this name. Scripts should select a complete named constant such as `Intf_Order`, `Intf_ASN` or `Intf_Partner`.

The six database rows are placeholders. Their blank codes and inactive flags do not assign them a shared interface meaning.

#### Edge cases and quirks

- Duplicate compile-time registrations mean the Code Library record cannot identify which definition, if any, a particular script compiler lookup will resolve. The documentation does not infer runtime duplicate-name behavior from the index snapshot.
- The displayed value 18 is neither the first registration (14) nor the last registration (19), reinforcing that it is not a canonical reserved value.
- `<!Intf_!>` is not a valid Velox numeric tag because the name is absent from `gVeloxConstMap`; tag processing raises an invalid-tag exception.
- There is no supported String partner. Do not construct or use `Intf__String`.
- Do not use numeric literals 14-19 as substitute interface identifiers. They remain reserved database keys without public module/reference semantics.
- Future generator or importer correction may remove or change this page. That is expected and should not be treated as a compatibility break for supported scripts.

#### Side effects

Reading a compile-time name has no intrinsic side effect, but relying on this collision can select an unintended value and direct later database work at a reserved row.

#### Errors

Compilation or evaluation may vary with duplicate-registration handling. Configuration tag expansion always rejects `Intf_` in the current product. Database consumers can also fail or behave incorrectly because rows 14-19 have blank codes and no configured interface role.

#### Performance and concurrency

No meaningful performance contract applies. The reserved rows are mutable database state, while the conflicting registrations are fixed in the deployed executable.

#### Remarks

This page documents a known product/importer defect so technical users and AI agents do not mistake generated visibility for supported API status. Use only complete named interface entries documented in this folder.

#### Related entries

- [`Intf_Order`](./Intf_Order.md) — supported module identifier example.
- [`Intf_ASN`](./Intf_ASN.md) — supported module identifier with its paired String code.
- [`ProcessTags`](../../Functions/String/ProcessTags.md) — rejects names absent from the numeric Velox tag map.

#### External references

No Delphi or Free Pascal equivalent applies. This collision is specific to the Velox importer and Code Library generator.

<small>Created 2026-07-15</small>
