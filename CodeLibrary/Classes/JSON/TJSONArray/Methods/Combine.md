---
title: Combine
description: Appends deep clones of every source item without transferring or clearing either array.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, combine, clone]
---

```Delphi
procedure Combine(const aSource: TJSONArray);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Left, Right: TJSONArray;
begin
  Left := TJSONArray.Create;
  Right := TJSONArray.Create;
  try
    Left.AddString('A');
    Right.AddString('B');
    Right.AddString('C');
    Left.Combine(Right);
    Value := Left.AsString;  // ["A","B","C"]
  finally
    Right.Free;
    Left.Free;
  end;
end;
```

### Usage

`Combine` appends deep clones of every source item without transferring or clearing either array.

### Additional Technical Info
`Combine` iterates over the source items in order, calls `Clone` on each and appends the clones directly to the receiver's owning list. Existing receiver items remain first. The source and its child objects remain unchanged and independently owned.

Combining an array with itself is supported by the loop mechanics: the final source index is fixed when the loop begins, so one clone of each original item is appended rather than an endless loop. Large/nested sources are fully duplicated in memory. Passing `nil` fails when the method reads its count.

The implementation bypasses the normal protected `Add` method and therefore does not clear the inherited private null-storage bit. This difference is behaviourally inert for arrays: `TJSONText.IsNull` always reads false, and `AsString` serializes every appended item even after a caller assigned `IsNull=True`. The script `NotNull` property is also misbound to the false-valued `IsNull` helper, so use `not Left.IsNull` when a positive predicate is needed.

The receiver owns all appended clones. References obtained from the source do not point at the clones; obtain new references through receiver [`Items`](../Properties/Items.md) if needed.

**External references**

- [RFC 8259 section 5: Arrays](https://www.rfc-editor.org/rfc/rfc8259#section-5)
- [Embarcadero `TObjectList`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Contnrs.TObjectList)

<small>Created 2026-07-20</small>
