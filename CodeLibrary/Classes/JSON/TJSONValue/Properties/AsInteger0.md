---
title: AsInteger0
description: Reads Boolean, String or numeric values with zero fallback while still rejecting structured JSON kinds.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, integer, default, conversion]
---

```Delphi
property AsInteger0: Integer read write;
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
    Item.AsString := 'not-an-integer';
    Value := Item.AsInteger0;  // 0; scalar conversion failure is suppressed.
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsInteger0` reads Boolean, String or numeric values with zero fallback while still rejecting structured JSON kinds.

### Additional Technical Info
The reader returns `0` for null. A non-null Boolean maps to `1` or `0`. A String or `jsNumber` is passed to Delphi `StrToIntDef(..., 0)`, so malformed text and 32-bit overflow collapse to `0` instead of raising. Unlike [`AsFloat0`](AsFloat0.md), arrays and objects do **not** collapse to zero: unsupported value kinds raise Deltics `EJSONError`.

Valid zero, null, false, invalid/overflowing scalar text and some unsuitable numeric formatting are indistinguishable in the result. Check [`IsNull`](IsNull.md) and [`ValueType`](ValueType.md), or use strict [`AsInteger`](AsInteger.md), when validation matters. Delphi's integer parser also accepts documented non-decimal formats beyond JSON grammar.

The writer is the exact strict `AsInteger` writer. It formats the 32-bit value with `IntToStr` and delegates to the concrete virtual setter; there is no fallback or error suppression on assignment. This read/write asymmetry is intentional in the code.

**External references**

- [Embarcadero `StrToIntDef`](https://docwiki.embarcadero.com/Libraries/Florence/en/API%3ASystem.SysUtils.StrToIntDef)
- [Embarcadero `IntToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.IntToStr)
- [Free Pascal `StrToIntDef`](https://www.freepascal.org/docs-html/rtl/sysutils/strtointdef.html) - compatible default-on-failure context.
- [Free Pascal `IntToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/inttostr.html) - compatible decimal formatting context.

<small>Created 2026-07-15</small>
