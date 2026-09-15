---
title: Clone
description: Creates a caller-owned deep copy that preserves child order, duplicates, names and observable descendant null states.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, clone, ownership]
---

```Delphi
function Clone: TJSONObject;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Source, CopyObject: TJSONObject;
begin
  Source := TJSONObject.CreateFromString('{"reference":"DEMO-1001"}');
  try
    CopyObject := Source.Clone;
    try
      CopyObject['reference'].AsString := 'DEMO-1002';
      Value := CopyObject.AsString;
    finally
      CopyObject.Free;
    end;
  finally
    Source.Free;
  end;
end;
```

### Usage

`Clone` creates a caller-owned deep copy that preserves child order, duplicates, names and observable JSON value null states.

### Additional Technical Info
`Clone` creates a new `TJSONObject` of the same runtime class and recursively clones every value in insertion order. Each descendant, its exact `Name` spelling and its scalar/null-node state are copied. Inherited `CopyFrom` also copies the root object's private base null bit, but `TJSONText.IsNull` remains fixed false, so that stored bit is not observable and does not suppress clone output. Duplicate names remain duplicates; the method does not canonicalize or merge them.

The result is independent and caller-owned. Mutating or freeing it does not change the source. The caller must free it. Every child obtained from the clone remains borrowed from the clone and becomes invalid when that clone is erased or freed.

The source is not changed. A nil receiver fails before the method can run. Allocation or child-clone failure raises. The inherited implementation has no `try/finally` around the new result after construction, so a failure during `CopyFrom` can leak that result and any children cloned before the failure. Callers receive no object to free on that path.

Cloning preserves existing serializer states. An empty object clone still serializes through the `}` defect, duplicate fields remain in output and unsafe field names remain unescaped.

**External references**

- [Embarcadero object constructors](https://docwiki.embarcadero.com/RADStudio/Florence/en/Methods_(Delphi)#Constructors)
- [Free Pascal class constructors and destructors](https://www.freepascal.org/docs-html/ref/refse36.html) - compatible ownership context.

<small>Created 2026-07-20</small>
