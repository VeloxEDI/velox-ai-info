---
title: TJSONBoolean
description: Represents a mutable JSON Boolean node with exact lowercase literals and separate retained payload and null state.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, boolean, scalar, 'null']
---

```Delphi
TJSONBoolean = class(TJSONValue)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Flag: TJSONBoolean;
begin
  Flag := TJSONBoolean.Create;
  try
    Flag.Value := True;
    Value := Flag.AsString;  // true
  finally
    Flag.Free;
  end;
end;
```

### Usage

`TJSONBoolean` represents a mutable JSON Boolean node with exact lowercase literals and separate retained payload and null state.

### Additional Technical Info
`TJSONBoolean` stores one native Boolean as a JSON scalar. The inherited virtual [`Create`](TJSONValue/Methods/Create.md) constructor is available on this class and produces a non-null node whose initial [`Value`](TJSONBoolean/Properties/Value.md) is `False`. A directly created node belongs to the script and must be freed; a node returned from an object or array is normally borrowed and owned by that parent.

The class-specific generated surface is only `Value`. Shared construction, cloning, conversion, name and null-state members are documented under [`TJSONValue`](TJSONValue.md). `ValueType` remains `jsBoolean` even when the separate `IsNull` flag is true.

When non-null, `AsString` is exactly the lowercase JSON literal `true` or `false`. `AsBoolean` returns the stored value, while integer conversions return `1` or `0`. Setting inherited `AsString` accepts only an exact case-insensitive `true` or `false`; surrounding whitespace is not trimmed. An invalid text assignment clears the null flag before raising and leaves the previous Boolean payload in place.

[`Clear`](TJSONValue/Methods/Clear.md) marks the node null without erasing its stored Boolean. Reading `Value` still exposes that retained payload, whereas `AsString` becomes blank and `AsBoolean` becomes `False`. Assigning `Value` makes the node non-null again.

#### Serialization and null behavior

Objects emit a null-marked Boolean as `null`. Arrays have a traced defect: their serializer branches on `ValueType`, receives blank `AsString` for a null-marked Boolean and emits an empty token. A one-item array therefore collapses to `[]`, while mixed arrays can become invalid JSON. Use a real `TJSONNull` node when an array must contain JSON null.

The PascalScript runtime also misbinds inherited `NotNull` to the `IsNull` read helper, so the two script properties return the same value. Test `IsNull` directly and invert it when a non-null predicate is required.

Inherited `CopyFrom` must receive another `TJSONBoolean`; the override performs no runtime type check. `IsEqual` compares type, case-sensitive name and `AsString`, not the null flag, so two cleared Boolean nodes with different retained payloads can compare equal.

**External references**

- [RFC 8259 section 3: JSON values and Boolean literals](https://www.rfc-editor.org/rfc/rfc8259#section-3)
- [Embarcadero `SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html) - compatible case-insensitive comparison context; Velox executes the traced Delphi/Deltics implementation.

<small>Created 2026-07-20</small>
