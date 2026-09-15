---
title: Count
description: Returns the current number of owned child nodes in the JSON array.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, count, iteration]
---

```Delphi
property Count: Integer read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
  I: Integer;
begin
  Values := TJSONArray.Create;
  try
    Values.LoadFromString('["A","B"]');
    Value := '';
    for I := 0 to Values.Count - 1 do
      Value := Value + Values[I].AsString;
  finally
    Values.Free;
  end;
end;
```

### Usage

`Count` returns the current number of owned child nodes in the JSON array.

### Additional Technical Info
`Count` returns the backing object list's current item count. It includes every node type, including real JSON null values and null-marked string nodes. It does not count descendants inside nested arrays or objects.

Valid [`Items`](Items.md) indexes are zero through `Count - 1`. With `Count=0`, a Pascal `for I := 0 to Count - 1` loop performs no iterations. Indexed access outside the range raises.

Addition increases the value; delete decreases it; erase sets it to zero; successful loading replaces it with the parsed array count. References and indexes can be invalidated by any of those mutations, so do not cache them across changes. The property is not a concurrency snapshot and the class is not thread-safe.

`Count=0` means that the array owns no child nodes. The container itself still reads `IsNull=False` and serializes as `[]`, even if a script previously assigned `IsNull=True`; `TJSONText` fixes the getter to false. Do not use script `NotNull` as the inverse because the runtime importer misbinds it to the same false-valued `IsNull` helper.

**External references**

- [RFC 8259 section 5: Arrays](https://www.rfc-editor.org/rfc/rfc8259#section-5)
- [Embarcadero `TList.Count`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TList.Count)
- [Free Pascal `TList.Count`](https://www.freepascal.org/docs-html/rtl/classes/tlist.count.html) - compatible list context.

<small>Created 2026-07-20</small>
