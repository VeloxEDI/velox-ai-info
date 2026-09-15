---
title: Intf_Event_String
description: Provides the exact Event Interface.Code token paired with operational reference-interface key 39.
sidebar_position: 321
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - interface
  - operational-reference
  - code
  - constant
---

```Delphi
Intf_Event_String = 'Event'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if DATA_Interface['Code'].AsString = Intf_Event_String then
    Value := Intf_Event;
end;
```

### Usage

`Intf_Event_String` provides the exact Event Interface.Code token paired with operational reference-interface key 39.

#### Value

| Property | Value |
|---|---|
| Script type | `String` |
| Exact value | `Event` |
| Database row | `Interface.Num = 39` |
| Numeric partner | `Intf_Event = 39` |
| Module row | No (`IsModule = 0`) |
| Fresh-build default | `Active = 0`; `IsConfigured = 0` |

### Additional Technical Info
`Intf_Event_String` is the script-visible `String` code `Event` for operational reference-interface key [`Intf_Event`](./Intf_Event.md) = 39.

Use it for trusted interface-code comparisons or lookups. It identifies a category only; it does not load Event records, select an operation, authenticate a caller or confer access.

#### Implementation

`vxVeloxEDI.pas`, its PascalScript importer and the fresh-build `Interface.Code` field use the exact token `Event`. The String registration is maintained separately from numeric key 39.

String names are absent from `gVeloxConstMap`; `<!Intf_Event_String!>` is invalid. Only the numeric name [`Intf_Event`](./Intf_Event.md) can be expanded as a Velox tag.

#### Behaviour

- Reading the constant returns immutable text without a database query.
- It can be compared with `DATA_Interface['Code'].AsString` or passed to an operation documented to accept an interface code.
- Canonical capitalization is part of the documented token. Database comparison still follows the deployed database collation.
- No script-visible native converter currently maps arbitrary interface codes and numbers.

#### Edge cases and quirks

- The database row is seeded inactive/unconfigured and is not a module. A matching code does not enable the category or prove related data exists.
- Do not substitute a display `Description` or `CustomDescription`; those fields may change while `Code` is the technical token.
- The Scriptlet `GetInterfaceForCode` helper interpolates its argument into SQL instead of binding a parameter. Pass this fixed/trusted constant, never raw external text.
- Script String equality and SQL collation are distinct; do not depend on collation to repair whitespace, localization or an altered code.
- A category name does not select a concrete table API or grant authority. Follow the documentation and security checks of the actual consumer.
- Native `GetInterfaceNum`/`GetInterfaceCode` implementations and registrations are commented out.

#### Side effects

Constant access has no side effects. A separate lookup or operation uses its caller's connection, permissions, auditing and transaction context.

#### Errors

The constant cannot fail. Lookup can report not found for a missing/changed deployment row. Untrusted text passed to an interpolating helper can produce malformed SQL; use a constant or parameterized logic.

#### Performance and concurrency

Constant access is constant-time and thread-safe. Database lookup cost, collation and concurrent state apply only when a separate operation performs the query.

#### Remarks

Prefer `Intf_Event_String` over literal `Event` so the category dependency and its numeric pair remain explicit.

#### Related entries

- [`Intf_Event`](./Intf_Event.md) — numeric key and supported `<!Intf_Event!>` tag.
- [`DATA_Interface`](../../Variables/Data/DATA_Interface.md) — dataset for explicit interface-row queries.
- [`ProcessTags`](../../Functions/String/ProcessTags.md) — numeric tag processing; this String name is not a tag.

#### External references

No Delphi or Free Pascal equivalent applies. This code token and its database meaning are Velox-owned.

<small>Created 2026-07-15</small>
