---
title: AsSQLTrim
description: Trims the decrypted string before SQL quoting, but its setter uses the same lossy literal parser before trimming.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, sql, trim]
---

```Delphi
property AsSQLTrim: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Locals['Code'].AsString := '  NZ  ';
  Value := Locals['Code'].AsSQLTrim;
end;
```

### Usage

`AsSQLTrim` trims the decrypted string before SQL quoting, but its setter uses the same lossy literal parser before trimming.

### Additional Technical Info
The getter obtains decrypted AsString, trims leading/trailing spaces and control characters, then applies SafeSQL quoting/NUL removal/apostrophe escaping. It returns a quoted empty string for empty/Null text, not SQL `NULL`.

The setter uses `Copy(Input, 2, Length(Input)-3)`, unescapes doubled apostrophes, trims the result and assigns through AsString/Value. Like [`AsSQL`](AsSQL.md), a normally quoted literal loses its final data character as well as its closing quote. No quote syntax is validated.

Avoid the setter and do not treat the getter as parameter binding. Trimming can also be semantically significant for fixed business identifiers.

Official references: [Delphi Trim](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Trim), [Free Pascal Trim](https://www.freepascal.org/docs-html/rtl/sysutils/trim.html), [Delphi Copy](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Copy), [Free Pascal Copy](https://www.freepascal.org/docs-html/rtl/system/copy.html).

<small>Created 2026-07-15</small>
