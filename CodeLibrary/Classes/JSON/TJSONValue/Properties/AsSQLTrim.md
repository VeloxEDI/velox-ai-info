---
title: AsSQLTrim
description: Trims and quotes legacy SQL-like text while retaining the same lossy non-inverse setter as AsSQL.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, sql, trim, legacy]
---

```Delphi
property AsSQLTrim: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: TJSONString;
  Item: TJSONValue;
begin
  Text := TJSONString.Create;
  try
    Item := Text;
    Item.AsString := '  ready  ';
    Value := Item.AsSQLTrim;  // 'ready'
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsSQLTrim` trims and quotes legacy SQL-like text while retaining the same lossy non-inverse setter as AsSQL.

### Additional Technical Info
The getter obtains the null-aware value, trims leading/trailing characters handled by Delphi `Trim`, then calls Velox `SafeSQL`. `SafeSQL` removes NUL characters, doubles apostrophes and adds outer apostrophes. Null, empty and whitespace-only values all become `''`; this is quoted empty text, not SQL `NULL`.

The setter is not the inverse. Like [`AsSQL`](AsSQL.md), it applies `Copy(Value, 2, Length(Value)-3)` without validating quotation, losing the first and final two characters of normal input. It collapses doubled apostrophes, trims the already truncated text, then invokes the concrete virtual setter. Assigning this property's own output loses the final payload character for a normal nonempty value.

Trimming is destructive and uses Delphi's exact UnicodeString overload. Do not use the property where boundary whitespace is data, and do not use either SQL helper as a substitute for query parameters. A concrete scalar parse or container replacement can raise; no rollback restores the old value/null state.

**External references**

- [Embarcadero `Trim`](https://docwiki.embarcadero.com/Libraries/Florence/en/API%3ASystem.SysUtils.Trim)
- [Embarcadero `StringReplace`](https://docwiki.embarcadero.com/Libraries/Florence/en/API%3ASystem.SysUtils.StringReplace)
- [Free Pascal `Trim`](https://www.freepascal.org/docs-html/rtl/sysutils/trim.html) - compatible boundary-character context.
- [Free Pascal `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - compatible replace-all context.

<small>Created 2026-07-15</small>
