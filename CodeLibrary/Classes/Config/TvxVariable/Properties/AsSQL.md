---
title: AsSQL
description: Returns a single-quoted SQL string literal but uses a lossy, unvalidated substring parser when assigned.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, sql, quoting]
---

```Delphi
property AsSQL: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Locals['CustomerName'].AsString := 'O''Brien';
  Value := Locals['CustomerName'].AsSQL;
end;
```

### Usage

`AsSQL` returns a single-quoted SQL string literal but uses a lossy, unvalidated substring parser when assigned.

**Setter quirk**

The setter calculates `Copy(Input, 2, Length(Input)-3)`, then replaces doubled apostrophes with singles and assigns through AsString/Value. For a normal literal `'abc'` this substring is `ab`: it removes the opening quote and the final **two** characters, not only the closing quote. It never validates surrounding quotes and short/malformed input silently yields truncated/empty data.

Do not use AsSQL as a round-trip read/write format and avoid its setter. Getter assignment honours decryption; setter assignment honours Value validation/encryption.

Velox's SafeSQL and incorrect count expression are product-specific.

### Additional Technical Info
The getter converts decrypted [`Value`](Value.md) with `VarToStr`, then calls Velox `SafeSQL`: embedded NULs are removed, apostrophes doubled, and the result wrapped in single quotes. Null normally becomes a quoted empty string, not SQL `NULL`.

This is text quoting, not parameter binding and not type-aware SQL serialization. Prefer database parameters where available.

<small>Created 2026-07-15</small>
