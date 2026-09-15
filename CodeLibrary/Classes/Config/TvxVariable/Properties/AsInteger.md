---
title: AsInteger
description: Reads the raw Variant as 32-bit Integer with zero on caught coercion failure and writes a raw Integer directly.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, integer, conversion]
---

```Delphi
property AsInteger: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Locals['RetryCount'].AsInteger := 3;
  Value := Locals['RetryCount'].AsInteger;
end;
```

### Usage

`AsInteger` reads the raw Variant as 32-bit Integer with zero on caught coercion failure and writes a raw Integer directly.

### Additional Technical Info
If `VarIsOrdinal(FValue)` is true, the getter assigns the raw Variant to Integer. Otherwise it attempts Delphi Variant coercion inside try/except. Overflow, Null and other failed conversions return `0` rather than propagating.

Zero therefore does not distinguish failure from a real value. Fractions/strings use Delphi coercion and locale rules; values outside the 32-bit Integer range collapse to zero when assignment raises.

The setter writes an Integer directly to `FValue`, bypassing Value validation and encryption. The getter also reads raw content, so encrypted variables are not safely supported through this alias.

For empty-string handling, [`AsInteger0`](AsInteger0.md) adds a separate precheck but retains the same ambiguity.

<small>Created 2026-07-15</small>
