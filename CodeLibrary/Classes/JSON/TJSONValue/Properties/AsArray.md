---
title: AsArray
description: Returns the same value as a borrowed TJSONArray after a checked runtime cast.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, cast, ownership]
---

```Delphi
property AsArray: TJSONArray read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Generic: TJSONValue;
  Items: TJSONArray;
begin
  Items := TJSONArray.Create;
  try
    Generic := Items;
    Generic.AsArray.AddString('ready');
    Value := Items.AsString;
  finally
    Items.Free;
  end;
end;
```

### Usage

`AsArray` returns the same value as a borrowed TJSONArray after a checked runtime cast.

### Additional Technical Info
`AsArray` performs Delphi's checked `self as TJSONArray` cast. It succeeds only when the actual object is `TJSONArray` or a native subclass. The result is the same object reference: no parsing, copying, allocation or ownership transfer occurs.

The returned reference has exactly the receiver's lifetime. If the receiver is a standalone script-created array, the script still frees it once. If the receiver is a child borrowed from another JSON container, the parent still owns it and deletion, replacement or parent destruction invalidates both references.

A String, number, Boolean, null or object raises `EInvalidCast`; `ValueType` can be checked before access. A nil/already freed script object is invalid. Reading is constant-time and does not change null state or stream/parser state. It provides no synchronization against concurrent mutation.

Use [`AsText`](AsText.md) when either an object or array is acceptable, or [`AsObject`](AsObject.md) for an object-only checked view.

**External references**

- [Embarcadero `EInvalidCast`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.EInvalidCast)
- [Free Pascal `EInvalidCast`](https://www.freepascal.org/docs-html/rtl/sysutils/einvalidcast.html) - compatible checked-cast failure context.

<small>Created 2026-07-15</small>
