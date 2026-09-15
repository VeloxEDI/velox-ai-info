---
title: AsStringTrim
description: Applies Delphi Trim to the decrypted string view on read and before canonical Value assignment on write.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, string, trim]
---

```Delphi
property AsStringTrim: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Locals['Code'].AsStringTrim := '  NZ  ';
  Value := Locals['Code'].AsStringTrim;
end;
```

### Usage

`AsStringTrim` applies Velox Trim to the decrypted string view on read and before canonical Value assignment on write.

### Additional Technical Info
The getter returns `Trim(AsString)` and therefore decrypts/Variant-converts first. The setter trims its string argument before assigning through AsString/Value, preserving validation and encryption.

Delphi Trim removes leading/trailing spaces and control characters; internal whitespace is unchanged. Null normally converts to empty before trimming. Trimming is performed on every read and write but does not mutate Value on read.

Official references: [Delphi Trim](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Trim), [Free Pascal Trim](https://www.freepascal.org/docs-html/rtl/sysutils/trim.html). Free Pascal confirms compatible broad whitespace behaviour but is not proof of the shipped Delphi runtime.

<small>Created 2026-07-15</small>
