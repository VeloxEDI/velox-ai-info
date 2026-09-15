---
title: AddInteger
description: Adds a named signed 32-bit input as an owned Int64-backed JSON integer with a compiler-limited typed return value.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, addinteger, integer, int64, ownership]
---

```Delphi
function AddInteger(const aName: String;
  const aValue: Integer): TJSONInteger;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Document.AddInteger('quantity', 2);
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

Call `AddInteger(Name, Value)` on a JSON object or array container to add a named integer from `-2147483648` through `2147483647`. Use [`AddInt64`](AddInt64.md) for a wider input.

The container owns the new node, so do not free the returned reference. Use the parent to reacquire it as `TJSONValue` when generic JSON-value properties are needed.

### Additional Technical Info
`AddInteger` constructs a `TJSONInteger`, assigns `aName`, widens the signed 32-bit script argument into its native `Int64` storage and transfers the node to the receiver. Serialization is exact base-10 text without grouping or locale punctuation.

Use [`AddInt64`](AddInt64.md) when the input can exceed `-2147483648..2147483647`; this declaration narrows at the call boundary even though the created node has wider storage. Range/overflow behavior is determined before or while binding the PascalScript argument and is not handled by this method.

The returned `TJSONInteger` is borrowed and parent-owned. Its own `Value` property is visible, but the importer places its hidden `TJSONNumber` ancestor beneath `TObject`, so inherited `TJSONValue` members such as `Name`, `AsInt64` and `IsNull` are absent from a `TJSONInteger`-typed expression. Reacquire it through the parent as `TJSONValue` for generic access.

Removing, replacing or freeing the parent invalidates the result. Allocation/assignment/insertion exceptions propagate; a final list-insertion failure can leak the new node because the implementation has no exception cleanup around transfer.

**External references**

- [Embarcadero `IntToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.IntToStr)
- [Free Pascal `IntToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/inttostr.html) - compatible integer formatting context.
- [RFC 8259 section 6: Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6)

<small>Created 2026-07-15</small>
