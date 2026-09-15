---
title: Contains
description: Tests for a first case-insensitive field-name match without creating the missing null inserted by the default property.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, contains, lookup]
---

```Delphi
function Contains(const aValueName: String): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString('{"Reference":"DEMO-1001"}');
  try
    Value := Payload.Contains('reference');  // True; comparison ignores case.
  finally
    Payload.Free;
  end;
end;
```

### Usage

`Contains` tests for a first case-insensitive field-name match without creating the missing null inserted by the default property.

### Additional Technical Info
`Contains` returns `True` when [`FindValue`](FindValue.md) finds at least one field whose name matches `aValueName` with Delphi `SameText`. It is case-insensitive and checks fields in insertion order.

This is a side-effect-free existence test. Unlike default [`Values[name]`](../Properties/Values.md), a miss does not insert a null value or change `ValueCount` and serialization.

A present field counts even when its child `IsNull` is true. With duplicate names, the result is simply true; use `ValueByIndex` when every physical occurrence matters.

The empty string is a valid lookup name if an object contains a child with an empty `Name`. No normalization beyond `SameText` is performed.

**External references**

- [Embarcadero `SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html) - compatible comparison context.

<small>Created 2026-07-20</small>
