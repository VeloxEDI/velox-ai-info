---
title: AsFloat0
description: Reads trimmed-empty field text as zero and otherwise uses the concrete field's AsFloat conversion.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, float, zero, conversion, trim]
---

```Delphi
property AsFloat0: Double read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Field.AsFloat0 * 1.15;
end;
```

### Usage

`AsFloat0` reads trimmed-empty field text as zero and otherwise uses the field's AsFloat conversion.

### Additional Technical Info
`AsFloat0` is a read/write `Double` convenience property with asymmetric accessors.

The getter first reads [`AsStringTrim`](AsStringTrim.md). If that text is empty it returns `0`; otherwise it reads inherited `AsFloat`.

This makes database null, empty text and whitespace-only text collapse to floating-point zero. It does not turn arbitrary invalid nonempty text into zero: the subsequent `AsFloat` conversion can raise and can be locale-sensitive for text fields. Genuine numeric zero is returned as zero but cannot be distinguished from the fallback without checking `IsNull`/the original text.

The setter does **not** apply an empty-text rule. It directly assigns `AsFloat := Value`, using the concrete field's typed conversion and validation. It can require edit/insert state, mark the current record modified or raise for a read-only/incompatible/range-invalid field. Neither accessor posts or commits.

Use explicit null/error handling where missing, invalid and zero values have different business meanings.

**External references**

- [Embarcadero DocWiki: `TField`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField) documents typed field conversions, null defaults and unsuitable-property errors.
- [Embarcadero DocWiki: `Trim`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Trim) documents the getter's empty-text gate.

<small>Created 2026-07-15</small>
