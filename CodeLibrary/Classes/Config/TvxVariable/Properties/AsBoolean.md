---
title: AsBoolean
description: Reads or writes the raw Variant as Boolean using Velox's narrow ordinal and exact-string truth rules.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, boolean, variant]
---

```Delphi
property AsBoolean: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Locals['Enabled'].AsBoolean := True;
  Value := Locals['Enabled'].AsBoolean;
end;
```

### Usage

`AsBoolean` reads or writes the raw Variant as Boolean using Velox's narrow ordinal and exact-string truth rules.

### Additional Technical Info
`AsBoolean` is a read/write Boolean view over the internal Variant.

The getter returns the stored Boolean directly; for any ordinal Variant it returns `FValue <> 0`; for a string it returns True only for exactly `True` or `true`. Other strings return False. Conversion exceptions inside those branches return False.

**Quirk:** when the Variant is neither Boolean, ordinal nor string (for example Null, Empty, floating-point or date), the implementation has no final assignment to Result. Its returned Boolean is therefore undefined and must not be relied upon. Check/normalise Value first.

The setter directly assigns the Boolean to the raw Variant under lock. It bypasses Value validation and encryption. On an encrypted variable it can replace ciphertext with a raw Boolean, while the Value getter may later try to decrypt its text.

Official classification references: [Delphi VarIsOrdinal](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsOrdinal), [Free Pascal VarIsOrdinal](https://www.freepascal.org/docs-html/rtl/variants/varisordinal.html), [Delphi VarIsStr](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsStr), [Free Pascal VarIsStr](https://www.freepascal.org/docs-html/rtl/variants/varisstr.html). These describe upstream type tests; Velox's exact truth rules and missing fallback are product-specific.

<small>Created 2026-07-15</small>
