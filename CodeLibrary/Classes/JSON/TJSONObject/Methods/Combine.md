---
title: Combine
description: Appends deep clones of every source field without replacing names, so duplicates and source order are retained.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, combine, duplicate]
---

```Delphi
procedure Combine(const aObject: TJSONObject);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Target, Source: TJSONObject;
begin
  Target := TJSONObject.CreateFromString('{"status":"old"}');
  Source := TJSONObject.CreateFromString('{"status":"new","count":2}');
  try
    Target.Combine(Source);
    Value := Target.AsString;  // Both status fields are retained.
  finally
    Source.Free;
    Target.Free;
  end;
end;
```

### Usage

`Combine` appends deep clones of every source field without replacing names, so duplicates and source order are retained.

### Additional Technical Info
`Combine` iterates the source's physical values and appends a deep clone of each one to the target. It does not replace, merge or compare names. Existing target fields remain first, followed by cloned source fields in source order.

Duplicate names are therefore expected. Name-based lookup remains case-insensitive and returns the first physical match, so an appended value with the same name does not override an earlier one even though compact serialization emits both.

The target owns every appended clone. The source and all its nodes remain unchanged and keep their original ownership. A retained reference to a newly appended node is borrowed from the target.

Combining an object with itself appends clones of the original range once; the `for` loop captures its final index before iteration. Passing nil dereferences the source and raises. Allocation failure can leave a partially appended target because there is no rollback.

The method writes clones through the object's protected `Add`, which appends directly to the owning list and does not clear the inherited private null-storage bit. This does not hide the result: `TJSONText.IsNull` always returns false and `AsString` serializes the appended fields even after `Target.IsNull := True`. The script `NotNull` property is misbound to the same false-valued reader; use `not Target.IsNull` rather than `Target.NotNull`.

**External references**

- [RFC 8259 section 4: Objects](https://www.rfc-editor.org/rfc/rfc8259#section-4)
- [Embarcadero `TObjectList.Add`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Contnrs.TObjectList.Add)

<small>Created 2026-07-20</small>
