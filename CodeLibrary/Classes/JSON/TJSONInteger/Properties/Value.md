---
title: Value
description: Reads or replaces the retained full-range signed Int64 payload and clears null state on assignment.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, integer, int64, value]
---

```Delphi
property Value: Int64 read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Number: TJSONInteger;
begin
  Number := TJSONInteger.Create;
  try
    Number.Value := 5000000000;
    Value := Number.Value;
  finally
    Number.Free;
  end;
end;
```

### Usage

`Value` reads or replaces the retained full-range signed Int64 payload and clears null state on assignment.

### Additional Technical Info
`Value` exposes the signed 64-bit field stored by [`TJSONInteger`](../../TJSONInteger.md). The accepted range is `-9223372036854775808` through `9223372036854775807`. Assignment stores the value, including zero, and internally clears the native null flag.

Because hidden `TJSONNumber` is registered beneath `TObject` instead of `TJSONValue`, a `TJSONInteger`-typed script expression cannot access inherited [`IsNull`](../../TJSONValue/Properties/IsNull.md), `AsString` or `AsInt64`. Use this property as the full-range class-specific accessor. Prefer a node returned by `TJSONArray.AddInteger`, an object helper or the parser; direct `TJSONInteger.Create` resolves through `TObject.Create` and skips the JSON value-type initializer.

Reading bypasses native null state. If native code or a base-typed reference marks a correctly constructed node null, this property still returns the retained integer while native `AsString` is blank. Check null state on the base `TJSONValue` reference before applying a validated class view.

Non-null parent serialization calls `IntToStr` and emits exact unquoted decimal digits. There is no locale-sensitive decimal separator and no precision loss inside a correctly constructed Velox node. Precision can still be lost after transmission to consumers that store JSON numbers only as binary64; use a JSON string for large identifiers when the receiver's number model is unknown.

This property is wider than native/base-typed `AsInteger` and the argument accepted by `TJSONArray.AddInteger`. On a `TJSONInteger`-typed script variable, `Value` is the available full-range accessor.

**External references**

- [RFC 8259 section 6: Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6)
- [Embarcadero `IntToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.IntToStr)
- [Free Pascal `IntToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/inttostr.html) - compatible decimal conversion context.

<small>Created 2026-07-20</small>
