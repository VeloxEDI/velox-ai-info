---
title: AsInfo
description: Formats Code and decrypted Value as diagnostic text, while its setter stores the entire assigned string as Value.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, diagnostic, string]
---

```Delphi
property AsInfo: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Locals['Status'].AsString := 'Ready';
  Value := Locals['Status'].AsInfo;
end;
```

### Usage

`AsInfo` formats Code and decrypted Value as diagnostic text, while its setter stores the entire assigned string as Value.

### Additional Technical Info
The getter returns `Code + ': ' + VarToStr(Value)`. Because it uses Value, encrypted content is decrypted before formatting. Null normally becomes the runtime's configured Null string (commonly empty).

The setter is deliberately asymmetric: it assigns the complete incoming string to Value and does not parse/remove a Code prefix. Therefore reading `AsInfo` and assigning it back changes Value from `Ready` to text such as `Status: Ready`.

Value-path assignment honours native validation and encryption. Code and Value are read within a re-entrant monitor, but Code's underlying getter itself is unlocked elsewhere. Treat AsInfo as diagnostic output, not a serialization format; never log secret values merely because the property is named "Info".

Variant string semantics: [Delphi VarToStr](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarToStr), [Free Pascal VarToStr](https://www.freepascal.org/docs-html/rtl/variants/vartostr.html).

<small>Created 2026-07-15</small>
