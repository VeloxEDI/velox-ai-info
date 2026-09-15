---
title: AsInteger0
description: Reads trimmed-empty field text as zero and otherwise uses the concrete field's 32-bit AsInteger conversion.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, integer, zero, conversion, trim]
---

```Delphi
property AsInteger0: Integer read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Field.AsInteger0 + 1;
end;
```

### Usage

`AsInteger0` reads trimmed-empty field text as zero and otherwise uses the field's 32-bit AsInteger conversion.

### Additional Technical Info
`AsInteger0` is a read/write 32-bit Integer convenience property.

The getter reads [`AsStringTrim`](AsStringTrim.md). It returns `0` when the trimmed text is empty; otherwise it delegates to inherited `AsInteger`.

Database null, empty string and whitespace-only text therefore collapse to zero. Nonempty invalid text, overflow and incompatible fields are not suppressed and can raise. Large-integer values outside signed 32-bit range can also fail or narrow according to the concrete field implementation. A genuine zero is indistinguishable from the fallback unless the caller checks the original null/text state first.

The setter always executes `AsInteger := Value`; it does not apply the getter's empty rule. Normal field conversion, edit/read-only, validation and range behavior applies. A successful write changes the current record buffer but does not post, apply updates or commit.

**External references**

- [Embarcadero DocWiki: `TField`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField) documents typed conversions, null defaults and errors for unsuitable properties.
- [Embarcadero DocWiki: `Trim`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Trim) documents the empty-text test.

<small>Created 2026-07-15</small>
