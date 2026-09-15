---
title: AsString
description: Converts the decrypted Value to string on read and assigns a string through the canonical Value path on write.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, string, variant]
---

```Delphi
property AsString: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Locals['Reference'].AsString := 'ABC-123';
  Value := Locals['Reference'].AsString;
end;
```

### Usage

`AsString` converts the decrypted Value to string on read and assigns a string through the canonical Value path on write.

### Additional Technical Info
The getter returns `VarToStr(Value)`. It follows the canonical Value getter, so encrypted variables are decrypted before conversion (except native component-writing state). Null conversion follows Delphi `NullAsStringValue`, commonly empty.

The setter assigns the string through Value, so native validation can raise and encrypted variables store encrypted text. Re-entrant monitor use makes the nested property calls safe within the same thread.

Formatting of numbers/dates and custom Variants follows Delphi Variant conversion and process/runtime settings; this property does not apply a Velox format mask. Use explicit formatting when deterministic interchange text is required.

Official references: [Delphi VarToStr](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarToStr), [Free Pascal VarToStr](https://www.freepascal.org/docs-html/rtl/variants/vartostr.html).

<small>Created 2026-07-15</small>
