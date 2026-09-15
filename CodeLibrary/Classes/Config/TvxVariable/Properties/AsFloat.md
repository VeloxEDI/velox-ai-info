---
title: AsFloat
description: Reads the raw Variant as Double with zero on caught coercion failure and writes a raw Double directly.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, double, conversion]
---

```Delphi
property AsFloat: Double read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Locals['Amount'].AsFloat := 12.5;
  Value := Locals['Amount'].AsFloat;
end;
```

### Usage

`AsFloat` reads the raw Variant as Double with zero on caught coercion failure and writes a raw Double directly.

### Additional Technical Info
The getter returns a floating-point Variant directly when `VarIsFloat` succeeds. Otherwise it asks Delphi to coerce the raw Variant to Double inside a try/except; any exception produces `0`.

Consequently zero is ambiguous between a real zero and invalid/Null/unconvertible content. String conversion follows Delphi Variant/locale rules. Use explicit validation when invalid input must be distinguishable.

The setter assigns a Double directly to raw `FValue`. It bypasses Value validation and encryption. The getter likewise does not decrypt, so encrypted variables commonly convert ciphertext and collapse to zero.

[`AsFloat0`](AsFloat0.md) adds only an initial trimmed-string empty check; it does not improve nonempty conversion diagnostics.

<small>Created 2026-07-15</small>
