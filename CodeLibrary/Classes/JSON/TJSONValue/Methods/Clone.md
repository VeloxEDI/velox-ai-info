---
title: Clone
description: Creates a caller-owned same-runtime-class copy of a scalar or complete JSON subtree.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, clone, copy, ownership]
---

```Delphi
function Clone: TJSONValue;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Source, CopyValue: TJSONValue;
  Text: TJSONString;
begin
  Text := TJSONString.Create;
  CopyValue := nil;
  try
    Source := Text;
    Source.Name := 'status';
    Source.AsString := 'ready';
    CopyValue := Source.Clone;
    Value := CopyValue.AsString;
  finally
    CopyValue.Free;
    Text.Free;
  end;
end;
```

### Usage

`Clone` creates a caller-owned same-runtime-class copy of a scalar or complete JSON subtree.

### Additional Technical Info
`Clone` obtains the receiver's Delphi runtime class, invokes that class's virtual constructor, then calls virtual [`CopyFrom`](CopyFrom.md) with the receiver as source. The result therefore has the same actual class, `Name`, null state and scalar payload. Array and object overrides recursively clone every child in physical order, preserving duplicate names and concrete child classes.

The returned root is a new caller-owned object. Free it in `finally`. Its descendants are owned by that new root and must not be freed separately. The source is unchanged and shares no owned child objects with a successful container clone.

Cloning a scalar is constant-time apart from managed String copying. Cloning a container is linear in the complete descendant count, recursive, and can temporarily require approximately another tree's memory. Deep nesting can consume significant call stack. The operation has no synchronization; do not mutate the source concurrently.

Construction, allocation and descendant copying exceptions propagate. There is no `try..except` around the newly constructed result. If `CopyFrom` raises, the new root is not freed and a partially cloned tree can leak. Use ordinary error handling around untrusted or very large structures; the method offers no transactional or size limit.

The source-reviewed example uses a correctly registered `TJSONString`. The importer defect on directly constructed `TJSONDouble`/`TJSONInteger` expressions means they do not expose this ancestor method.

**External references**

- [Embarcadero `TObject.ClassType`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TObject.ClassType)
- [Free Pascal `TObject.ClassType`](https://www.freepascal.org/docs-html/rtl/system/tobject.classtype.html) - compatible runtime-class context; the copy algorithm is Deltics-specific.

<small>Created 2026-07-15</small>
