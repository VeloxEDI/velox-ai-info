---
title: AsText
description: Returns the same object-or-array value as a borrowed TJSONText after a checked runtime cast.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, text, container, cast]
---

```Delphi
property AsText: TJSONText read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Generic: TJSONValue;
  Document: TJSONObject;
  Container: TJSONText;
begin
  Document := TJSONObject.Create;
  try
    Generic := Document;
    Container := Generic.AsText;
    Container.AddString('status', 'ready');
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

`AsText` returns the same object-or-array value as a borrowed TJSONText after a checked runtime cast.

### Additional Technical Info
`AsText` performs Delphi's checked `self as TJSONText` cast. It succeeds for actual `TJSONObject` and `TJSONArray` instances and returns the same object through their shared container ancestor. A raw `TJSONText` is not normally constructible because the inherited value constructor cannot classify it.

The result is borrowed aliasing, not parsing or cloning. It has the same lifetime/owner as the receiver. Free a script-created root once through one reference; never free a nested parent-owned container separately. Deleting/replacing a nested value or destroying its parent invalidates every alias.

Scalar String, number, Boolean and null nodes raise `EInvalidCast`. Use [`ValueType`](ValueType.md), [`AsArray`](AsArray.md) or [`AsObject`](AsObject.md) when a more precise contract is available. Reading is constant-time and side-effect-free; later calls through the returned mutable container retain its normal ownership and synchronization constraints.

**External references**

- [Embarcadero `EInvalidCast`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.EInvalidCast)
- [Free Pascal `EInvalidCast`](https://www.freepascal.org/docs-html/rtl/sysutils/einvalidcast.html) - compatible checked-cast failure context.

<small>Created 2026-07-15</small>
