---
title: IsNullEmpty
description: Treats the field as empty when its converted string value is empty after Delphi whitespace trimming.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, 'null', empty, trim, string]
---

```Delphi
function IsNullEmpty: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Field.IsNullEmpty then
    Value := 'No text supplied'
  else
    Value := Field.AsString;
end;
```

### Usage

`IsNullEmpty` treats the field as empty when its converted string value is empty after Velox whitespace trimming.

### Additional Technical Info
`IsNullEmpty` reads the field through `AsString`, applies Delphi `Trim`, and returns whether the result is the empty string.

Exact expression:

```Delphi
Trim(GetAsString) = ''
```

**What counts as empty**

- database null, because a null field's string conversion is empty;
- an empty string;
- a string containing only characters Delphi `Trim` removes at both ends (characters at or below U+0020);
- values whose concrete field formatter produces only such whitespace.

Numeric zero, Boolean false and date/time zero normally format as nonempty text and therefore return false. Use [`IsNullZero`](IsNullZero.md) for Velox's numeric/date zero sentinel rule. `IsNullEmpty` does not inspect [`IsStringType`](IsStringType.md); it converts every field category to text.

Concrete-field conversion or custom `OnGetText` behavior can affect the result and can raise. The method has no write side effect, but calculated/lookup/display conversion work can add cost. The current cursor determines the value.

**External references**

- [Embarcadero DocWiki: `TField`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField) documents null defaults and typed conversion behavior.
- [Embarcadero DocWiki: `Trim`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Trim) documents the Delphi trimming rule used by Velox.
- [Free Pascal: `TStringHelper.Trim`](https://www.freepascal.org/docs-html/rtl/sysutils/tstringhelper.trim.html) provides compatible trim context; Velox uses Delphi `Trim`.

<small>Created 2026-07-15</small>
