---
title: SetIfEmpty
description: Assigns a replacement only when the field's converted string value is empty after trimming.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, set, default, empty, trim, variant]
---

```Delphi
procedure SetIfEmpty(aNewValue: Variant)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Field.SetIfEmpty('UNKNOWN');
  Value := Field.Value;
end;
```

### Usage

`SetIfEmpty` assigns a replacement only when the field's converted string value is empty after trimming.

### Additional Technical Info
`SetIfEmpty` assigns `aNewValue` through the inherited Variant `Value` property only when `Trim(GetAsString) = ''`.

The condition is exactly the same as [`IsNullEmpty`](IsNullEmpty.md): database null, empty string and whitespace-only converted text qualify. Numeric zero, Boolean false and date/time zero normally do not qualify because they format as nonempty text.

The replacement Variant is not converted until assignment. Its compatibility is determined by the actual field class. Assignment can require edit/insert state, invoke validation/conversion/events, mark the record modified or raise because the field is read-only/calculated/inactive. The method neither posts nor commits.

If the condition is false, it is a no-op and does not evaluate a different fallback. Formatting/custom `OnGetText` behavior can affect the initial string test or raise before assignment.

Use [`SetIfNull`](SetIfNull.md) when only Variant Null/Empty/Clear should qualify, or [`SetIfZero`](SetIfZero.md) for Velox's numeric/date zero sentinel rule.

**External references**

- [Embarcadero DocWiki: `TField.Value`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.Value) documents the Variant assignment terminal.
- [Embarcadero DocWiki: `Trim`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Trim) documents the condition's string trimming.

<small>Created 2026-07-15</small>
