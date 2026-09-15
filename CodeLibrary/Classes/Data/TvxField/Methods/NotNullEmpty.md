---
title: NotNullEmpty
description: Returns true when the field's converted and trimmed string value is not empty.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, nonempty, trim, string]
---

```Delphi
function NotNullEmpty: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Field.NotNullEmpty then
    Value := Field.AsStringTrim
  else
    Value := 'UNKNOWN';
end;
```

### Usage

`NotNullEmpty` returns true when the field's converted and trimmed string value is not empty.

### Additional Technical Info
`NotNullEmpty` is the exact logical negation of [`IsNullEmpty`](IsNullEmpty.md).

It returns false for database null, empty string and text consisting only of characters removed by Delphi `Trim`. It normally returns true for numeric zero, Boolean false and date/time zero because their string conversions are nonempty.

This is a converted-text test, not merely `not IsNull` and not a field-type test. Formatting and custom field conversion can affect the text or raise. It reads the current record and has no write/navigation side effect.

**External references**

- [Embarcadero DocWiki: `TField`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField) documents field conversion and null defaults.
- [Embarcadero DocWiki: `Trim`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Trim) documents the whitespace operation used by the predicate.
- [Free Pascal: `TStringHelper.Trim`](https://www.freepascal.org/docs-html/rtl/sysutils/tstringhelper.trim.html) provides compatible trimming context.

<small>Created 2026-07-15</small>
