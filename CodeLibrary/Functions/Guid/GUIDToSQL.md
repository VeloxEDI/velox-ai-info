---
title: "GUIDToSQL"
description: "Returns a brace-wrapped GUID as a single-quoted SQL literal fragment without null semantics."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - guid
  - sql
  - literal
  - parameter
---

```Delphi
Function GUIDToSQL(const aGuid: TGuid): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Identifier: TGuid;
begin
  Identifier := SafeStringToGuid('{12345678-9ABC-DEF0-1234-56789ABCDEF0}');
  Value := GUIDToSQL(Identifier);
  // '{12345678-9ABC-DEF0-1234-56789ABCDEF0}'
end;
```

### Usage

`GUIDToSQL` returns a brace-wrapped GUID as a single-quoted SQL literal fragment without null semantics.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aGuid` | `TGuid`, `const` | Binary GUID to embed in the literal fragment. |

**Returns**

A 40-character string: apostrophe + 38-character `{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}` + apostrophe.

**Usage notes**

Prefer a typed GUID/uniqueidentifier parameter where the database API supports one. Use this helper only for legacy SQL text that explicitly expects the brace-wrapped quoted form.

### Additional Technical Info
`GUIDToSQL` formats a binary GUID in Delphi's uppercase brace-wrapped form and surrounds it with ASCII single quotes. The returned value is an SQL literal fragment, not a typed parameter or executed expression.

The example is fictional, deterministic, source-reviewed and was not sent to a database.

**Implementation**

The registered Velox helper evaluates:

```Delphi
'''' + GUIDToString(aGuid) + ''''
```

Installed Delphi `GUIDToString` emits only braces, hyphens and uppercase hexadecimal. The wrapper therefore needs no user-text apostrophe escaping for this typed input, but it also performs no SQL dialect or type negotiation.

**Edge cases and quirks**

- `EmptyGuid` becomes quoted `'{00000000-0000-0000-0000-000000000000}'`; it never becomes SQL `NULL`.
- Braces remain inside the quotes. Whether a database accepts that lexical form depends on its conversion rules.
- The result includes its own outer SQL quotes. Quoting it again changes the value or makes invalid SQL.
- No connection, database product, column type, collation or parameter metadata is inspected.
- A fixed typed GUID cannot inject apostrophe text, but building SQL strings still sacrifices parameter typing, plan reuse and clean null handling.
- The function performs no SQL operation; a successful return says nothing about later database acceptance.

**Side effects and errors**

Only string allocation. Any later SQL parse/conversion failure belongs to the consumer/database call.

**Performance and concurrency**

Constant-size formatting and concatenation, with no shared state.

**Related entries**

- [`GUIDToStringNoBraces`](GUIDToStringNoBraces.md) returns text without SQL quotes or braces.
- [`EmptyGuid`](EmptyGuid.md) explains the non-null zero value.
- [`SafeStringToGuid`](SafeStringToGuid.md) parses external text before formatting.

**External references**

The SQL wrapper is Velox-specific; these pages document its GUID text terminal:

- [Embarcadero `System.SysUtils.GUIDToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.GUIDToString)
- [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html)

<small>Created 2026-07-15</small>
