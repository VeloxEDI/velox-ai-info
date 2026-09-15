---
title: AddText
description: Deep-clones an object or array, renames the clone and transfers only that independent snapshot to the receiver.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, addtext, clone, ownership, snapshot]
---

```Delphi
function AddText(const aName: String;
  const aValue: TJSONText): TJSONText;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Source, Target: TJSONObject;
begin
  Source := TJSONObject.Create;
  Target := TJSONObject.Create;
  try
    Source.AddString('status', 'ready');
    Target.AddText('snapshot', Source);
    Source['status'].AsString := 'changed';
    Value := Target.AsString;
  finally
    Target.Free;
    Source.Free;
  end;
end;
```

### Usage

`AddText` deep-clones an object or array, renames the clone and transfers only that independent snapshot to the receiver.

### Additional Technical Info
`AddText` calls `aValue.Clone`, casts the same-runtime-class clone to `TJSONText`, replaces the clone's root name with `aName`, and transfers the clone to the receiver. It does not transfer or rename `aValue`; later changes to the source do not affect the inserted snapshot.

The returned value is the inserted clone and is borrowed from the parent. The caller continues to own the source independently. Parent deletion, erase/reload or destruction recursively frees the clone and invalidates the returned reference.

Cloning preserves insertion order, duplicate object names, child names and stored null flags. It also preserves structures that later trigger serializer defects, including empty objects, unsafe field names and control characters. No parsing or normalization occurs.

Passing nil dereferences nil and raises. Clone construction has no `try/finally`: if recursive `CopyFrom` fails, the newly allocated root and any already cloned descendants can leak. A later exception while renaming/inserting can also leak the completed clone. Complexity and temporary memory are proportional to the complete source subtree.

Adding the receiver to itself does not create an object cycle because cloning completes before insertion. It inserts a deep snapshot of the receiver's pre-add state as a new child; repeated self-snapshots can grow memory and output exponentially.

**External references**

- [Embarcadero object lifetime guidance](https://docwiki.embarcadero.com/RADStudio/Florence/en/Memory_Management)
- [Free Pascal class constructors and destructors](https://www.freepascal.org/docs-html/ref/refse36.html) - compatible ownership context.

<small>Created 2026-07-15</small>
