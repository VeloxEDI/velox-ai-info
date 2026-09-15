---
title: AsObject
description: Returns the same value as a borrowed TJSONObject after a checked runtime cast.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, cast, ownership]
---

```Delphi
property AsObject: TJSONObject read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Generic: TJSONValue;
  Document: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Generic := Document;
    Generic.AsObject.AddString('status', 'ready');
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

`AsObject` returns the same value as a borrowed TJSONObject after a checked runtime cast.

### Additional Technical Info
`AsObject` performs the checked Delphi cast `self as TJSONObject`. It returns the receiver itself when the actual object is a `TJSONObject` or native subclass. It does not parse, clone, allocate or transfer ownership.

The result is an alias with the same lifetime. A script-created root is still freed exactly once by the script. A nested object returned from a parent remains borrowed; deletion, replacement or parent destruction invalidates every alias to it.

Arrays, Strings, numbers, Booleans and null nodes raise `EInvalidCast`. Check [`ValueType`](ValueType.md) before access when input shape is not guaranteed. The property is constant-time, side-effect-free and unsynchronized; a nil or already freed receiver is invalid.

Use [`AsText`](AsText.md) when either structured kind is acceptable, or [`AsArray`](AsArray.md) for an array-only view.

**External references**

- [Embarcadero `EInvalidCast`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.EInvalidCast)
- [Free Pascal `EInvalidCast`](https://www.freepascal.org/docs-html/rtl/sysutils/einvalidcast.html) - compatible checked-cast failure context.

<small>Created 2026-07-15</small>
