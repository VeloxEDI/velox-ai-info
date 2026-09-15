---
title: AsSQL
description: Produces a legacy quoted SQL-like text literal but has a lossy setter that is not its inverse.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, sql, quoting, legacy]
---

```Delphi
property AsSQL: String read write;
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
    Item.AsString := 'O''Brien';
    Value := Item.AsSQL;  // 'O''Brien' with outer quotes and doubled apostrophe.
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsSQL` produces a legacy quoted SQL-like text literal but has a lossy setter that is not its inverse.

### Additional Technical Info
The getter calls Velox `SafeSQL` on the null-aware [`AsString`](AsString.md). `SafeSQL` removes every NUL character, doubles every apostrophe and wraps the result in apostrophes. Null therefore becomes `''`, not SQL `NULL`. Structured values are first compact-serialized, then quoted as text.

This is a legacy literal formatter, not a database parameter, identifier quote, type conversion or dialect negotiation. Removing NUL changes data. Use proper query parameters wherever the database API supports them, and do not infer semantic null from the returned text.

The setter is defective and must not be used as a round-trip decoder. It executes `Copy(Value, 2, Length(Value)-3)` without checking quotes, thereby discarding the first character and final **two** characters of a normally quoted input. It then replaces doubled apostrophes with single apostrophes and sends the truncated text directly to the concrete virtual setter. For example, assigning the getter output for `'abc'` stores `ab`, not `abc`.

Short or unquoted input can become blank or arbitrarily truncated. Type-specific conversion/parsing can then raise after changing null state or destructively replace a container. Errors propagate; no original-value rollback occurs. The getter is linear in input length and allocates replacement Strings; neither access is synchronized.

**External references**

- [Embarcadero `StringReplace`](https://docwiki.embarcadero.com/Libraries/Florence/en/API%3ASystem.SysUtils.StringReplace)
- [Free Pascal `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - compatible replace-all context; `SafeSQL` and the lossy setter are Velox/Deltics behavior.

<small>Created 2026-07-15</small>
