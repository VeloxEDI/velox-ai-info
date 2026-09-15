---
title: AsStringTrim
description: Reads or writes through AsString while applying Delphi Trim to both ends of the text.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, string, trim, whitespace, conversion]
---

```Delphi
property AsStringTrim: string read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Field.AsStringTrim := '  ABC  ';
  Value := Field.AsStringTrim;  { ABC }
end;
```

### Usage

`AsStringTrim` reads or writes through AsString while applying Velox Trim to both ends of the text.

### Additional Technical Info
`AsStringTrim` wraps the inherited string conversion with Delphi `Trim`.

The getter returns `Trim(GetAsString)`. The setter executes `AsString := Trim(Value)`. Delphi's ordinary `Trim` removes leading and trailing characters whose ordinal value is at or below U+0020; it does not remove all Unicode whitespace such as nonbreaking space, and it does not change internal whitespace.

Database null normally reads as an empty string, so null and empty cannot be distinguished through this property. Test `IsNull` first when that distinction matters. Numeric, Boolean and date fields use their concrete string conversions; locale/formatting and incompatible text can affect results or raise.

The setter permanently discards qualifying outer whitespace before invoking the actual field's `AsString` setter. It can require edit/insert state, perform parsing/validation, mark the current record modified or raise for read-only/incompatible data. It does not post or commit.

Use [`IsNullEmpty`](../Methods/IsNullEmpty.md) for the corresponding trimmed-empty test. Do not use this property when leading/trailing whitespace is significant data.

**External references**

- [Embarcadero DocWiki: `Trim`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Trim) documents the exact Delphi trimming routine.
- [Free Pascal: `TStringHelper.Trim`](https://www.freepascal.org/docs-html/rtl/sysutils/tstringhelper.trim.html) provides compatible trimming context.
- [Embarcadero DocWiki: `TField`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField) documents the concrete `AsString` conversion beneath this wrapper.

<small>Created 2026-07-15</small>
