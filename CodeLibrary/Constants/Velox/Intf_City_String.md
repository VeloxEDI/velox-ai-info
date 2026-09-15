---
title: Intf_City_String
description: Provides the exact City Interface.Code token paired with reference-interface key 27.
sidebar_position: 313
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - interface
  - reference-data
  - code
  - constant
---

```Delphi
Intf_City_String = 'City'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if DATA_Interface['Code'].AsString = Intf_City_String then
    Value := Intf_City;
end;
```

### Usage

`Intf_City_String` provides the exact City Interface.Code token paired with reference-interface key 27.

#### Value

| Property | Value |
|---|---|
| Script type | `String` |
| Exact value | `City` |
| Database row | `Interface.Num = 27` |
| Numeric partner | `Intf_City = 27` |
| Module row | No (`IsModule = 0`) |
| Fresh-build default | `Active = 0`; `IsConfigured = 0` |

### Additional Technical Info
`Intf_City_String` is the script-visible `String` code for the City reference interface. Its exact value is `City`, paired with numeric key [`Intf_City`](./Intf_City.md) = 27.

Use the constant for trusted interface-code comparisons and lookups. It identifies a category name only; it neither loads reference data nor verifies that the category is active or populated.

#### Implementation

The native declaration, PascalScript registration and fresh-build `Interface.Code` value all use the exact token `City`. The String constant is maintained separately from its numeric partner.

String names are not inserted into `gVeloxConstMap`. `<!Intf_City_String!>` is invalid configuration syntax; only [`Intf_City`](./Intf_City.md) has a numeric tag entry.

#### Behaviour

- Reading the constant returns immutable text and performs no lookup.
- It can be compared with `DATA_Interface['Code'].AsString` or passed to a trusted code-based lookup.
- Exact capitalization documents the canonical stored token. SQL comparison behavior still follows the target database collation.
- The paired numeric key is not computed from this String at runtime.

#### Edge cases and quirks

- The row is not a module and is seeded inactive/unconfigured. A matching code does not prove that the category is enabled or that any City reference record exists.
- Script String equality and database collation are separate. Do not use altered case, added whitespace or a localized display label as a substitute for the constant.
- `GetInterfaceForCode` in the Scriptlet performs a database query but interpolates its argument into SQL rather than binding a parameter. Pass this fixed/trusted constant, not external unvalidated text.
- The native `GetInterfaceNum` and `GetInterfaceCode` implementations and registrations are commented out; there is no current general script-visible converter.
- Database `Description` and `CustomDescription` can be presentation fields. They are not replacements for the stable `Code` token.

#### Side effects

Reading or comparing the constant has no side effects. A separate database lookup uses the caller's connection, permissions and transaction context.

#### Errors

The constant cannot fail. A lookup can report not found when the deployed row is absent or changed. Passing untrusted text to the interpolating Scriptlet helper can produce malformed SQL; use a constant or parameterized application logic.

#### Performance and concurrency

Constant access is constant-time and thread-safe. Any database lookup adds query cost and observes database collation and concurrent row state.

#### Remarks

Prefer `Intf_City_String` over the literal `City` to make the interface-category dependency explicit and keep it paired with key 27.

#### Related entries

- [`Intf_City`](./Intf_City.md) — numeric key and supported `<!Intf_City!>` tag.
- [`DATA_Interface`](../../Variables/Data/DATA_Interface.md) — dataset for explicit interface-row queries.
- [`ProcessTags`](../../Functions/String/ProcessTags.md) — numeric tag processing; this String name is not a tag.

#### External references

No Delphi or Free Pascal equivalent applies. This code token and its database meaning are Velox-owned.

<small>Created 2026-07-15</small>
