---
title: Intf_Remittance_String
description: Provides the exact Remittance Interface.Code token paired with numeric interface identifier 7.
sidebar_position: 349
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - interface
  - module
  - code
  - constant
---

```Delphi
Intf_Remittance_String = 'Remittance'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if DATA_Interface['Code'].AsString = Intf_Remittance_String then
    Value := Intf_Remittance;
end;
```

### Usage

`Intf_Remittance_String` provides the exact Remittance Interface.Code token paired with numeric interface identifier 7.

#### Value

| Property | Value |
|---|---|
| Script type | `String` |
| Exact value | `Remittance` |
| Database row | `Interface.Num = 7` |
| Numeric partner | `Intf_Remittance = 7` |
| Module row | Yes (`IsModule = 1`) |
| Fresh-build default | `Active = 0`; `IsConfigured = 0` |

### Additional Technical Info
`Intf_Remittance_String` is the script-visible `String` code for the Remittance module interface. Its exact value is `Remittance`, paired with [`Intf_Remittance`](./Intf_Remittance.md) and database key 7.

Use this constant for interface-code fields, trusted code lookups and comparisons. Use the numeric partner where Velox expects `Interface.Num` or `InterfaceNum`.

#### Implementation

Velox declares the native String constant in `vxVeloxEDI.pas` and registers the same text with PascalScript through `uPSI_vxVeloxEDI.pas`. The fresh-build `Interface` row uses `Remittance` in `Code`.

This String name is not inserted into `gVeloxConstMap`. A configuration tag such as `<!Intf_Remittance_String!>` is therefore invalid; only the numeric name [`Intf_Remittance`](./Intf_Remittance.md) has a tag-map entry.

#### Behaviour

- The value is an immutable compile-time String; reading it performs no lookup or validation.
- It can be compared with `DATA_Interface['Code'].AsString` or passed to a helper that explicitly accepts an interface code.
- The constant preserves the database token's exact spelling and capitalization.
- The numeric and String constants are separate registrations maintained alongside the database seed data.

#### Edge cases and quirks

- Do not add spaces to compound codes: `Remittance` is the stored code even where a user-facing description may contain spaces.
- Script String comparison and SQL comparison are different operations. A database lookup follows the target database's collation; do not rely on that collation to correct altered spelling or whitespace.
- The Scriptlet `GetInterfaceForCode` helper performs a database lookup and interpolates its argument into SQL rather than binding a parameter. Pass only a trusted/validated constant such as this one, not untrusted external text.
- The constant does not prove that the Remittance row is licensed, enabled, configured or active. A fresh database uses `Active = 0` and `IsConfigured = 0`, but deployed state can differ.
- No script-visible native `GetInterfaceNum`/`GetInterfaceCode` converter is currently registered; those implementations and registrations are commented out.

#### Side effects

Reading or comparing the constant has no side effects. A lookup or database operation that receives it has the effects and permissions of that operation.

#### Errors

The constant itself cannot fail. Code-based lookup can report the interface as not found when the deployed row is absent or its code has changed. Unsafe concatenation of untrusted text into the Scriptlet lookup can also produce malformed SQL; use the fixed constant or parameterized application logic.

#### Performance and concurrency

Constant access is constant-time and thread-safe. Database lookup cost, collation and concurrent row changes apply only when a separate operation queries `Interface`.

#### Remarks

Prefer this constant over the literal `Remittance` so the intent is searchable and remains visibly paired with interface number 7.

#### Related entries

- [`Intf_Remittance`](./Intf_Remittance.md) — numeric key and supported `<!Intf_Remittance!>` tag.
- [`DATA_Interface`](../../Variables/Data/DATA_Interface.md) — reusable dataset commonly used to load interface row data.
- [`ProcessTags`](../../Functions/String/ProcessTags.md) — numeric Velox-tag processing; this String name is deliberately not a tag.

#### External references

No Delphi or Free Pascal equivalent applies. This code token and its database meaning are Velox-owned.

<small>Created 2026-07-15</small>
