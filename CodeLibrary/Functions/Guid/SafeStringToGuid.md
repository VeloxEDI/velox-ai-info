---
title: "SafeStringToGuid"
description: "Parses an exact GUID, treating empty text as GUID_NULL and adding braces only when no opening brace occurs anywhere."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - guid
  - parse
  - conversion
  - error
  - braces
---

```Delphi
Function SafeStringToGuid(const aGuid: string): TGuid
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Identifier: TGuid;
begin
  Identifier := SafeStringToGuid('12345678-9abc-def0-1234-56789abcdef0');
  Value := GUIDToStringNoBraces(Identifier);
  // 12345678-9ABC-DEF0-1234-56789ABCDEF0
end;
```

### Usage

`SafeStringToGuid` parses an exact GUID, treating empty text as GUID_NULL and adding braces only when no opening brace occurs anywhere.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aGuid` | `string`, `const` | Exact empty text, a 36-character hyphenated GUID without braces, or the exact 38-character Velox brace-wrapped representation. |

**Returns**

- `GUID_NULL` when `aGuid = ''` exactly.
- Otherwise, the binary `TGuid` decoded by Velox `StringToGUID` after the brace rule below.

**Errors**

Any nonempty input that does not become Velox's exact 38-character grammar raises `EConvertError`. Velox does not catch, log or replace that exception.

**Usage notes**

Validate optional input before calling when blank should remain “missing” rather than become zero. Catch the conversion exception at an appropriate flow boundary if external malformed data should become a controlled issue.

### Additional Technical Info
`SafeStringToGuid` performs two small input conveniences before calling Delphi's strict GUID parser: exact empty text becomes the all-zero GUID, and a string containing no `{` anywhere is wrapped in braces. Malformed nonempty input still raises `EConvertError`.

The word “Safe” does not mean `Try`, non-throwing or broadly tolerant. The example is fictional, deterministic, source-reviewed and was not executed by the documentation workflow.

**Implementation**

The Velox function first builds `lGuid`:

1. If `aGuid = ''`, use `{00000000-0000-0000-0000-000000000000}`.
2. Else if `Pos('{', aGuid) = 0`, use `'{' + aGuid + '}'`.
3. Else pass `aGuid` unchanged.
4. Call `System.SysUtils.StringToGUID(lGuid)`.

Installed Delphi accepts exactly 38 characters with `{` at position 1, `}` at 38, hyphens at 10, 15, 20 and 25, and hexadecimal pairs at all defined digit positions. Hexadecimal letters may be upper or lower case.

**Accepted examples**

| Input | Result |
|---|---|
| `''` | All-zero GUID. |
| `12345678-9ABC-DEF0-1234-56789ABCDEF0` | Wrapped and parsed. |
| `{12345678-9abc-def0-1234-56789abcdef0}` | Passed unchanged and parsed. |

**Rejected or surprising inputs**

- Whitespace is not trimmed. `' '` is wrapped as `{ }` and fails.
- A leading/trailing space around a valid GUID fails the exact length/offset test.
- Parentheses, 32-character compact text, URN prefixes and other GUID display forms fail.
- If `{` appears anywhere, Velox does not add braces. For example `x{...}` reaches Delphi unchanged and fails rather than being normalized.
- A closing brace without an opening brace is wrapped, producing an extra `}` and failing.
- Empty maps to a value rather than reporting “missing”; this can collapse absent input and an intentional zero GUID into the same record.
- There is no Boolean success result or caller-supplied default.

**Side effects**

None. The function allocates at most a normalized string and returns a value record.

**Performance and concurrency**

One exact-empty test, one linear `Pos` scan, optional short concatenation and fixed-size parsing. No shared mutable state.

**Related entries**

- [`EmptyGuid`](EmptyGuid.md) is the exact-empty result.
- [`IsEmptyGuid`](IsEmptyGuid.md) tests that result.
- [`GUIDToStringNoBraces`](GUIDToStringNoBraces.md) emits a form this function can wrap and parse.
- [`NoBraces`](NoBraces.md) is lexical only and does not validate input.

**External references**

- [Embarcadero `System.SysUtils.StringToGUID`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StringToGUID)
- [Free Pascal `StringToGUID`](https://www.freepascal.org/docs-html/rtl/sysutils/stringtoguid.html) - documents the compatible required brace/hyphen shape.

<small>Created 2026-07-15</small>
