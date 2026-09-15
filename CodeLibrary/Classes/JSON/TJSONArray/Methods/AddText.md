---
title: AddText
description: Deep-clones a JSON object or array into the owning array instead of transferring the supplied node.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, clone, ownership]
---

```Delphi
function AddText(const aValue: TJSONText): TJSONText;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Source, Target: TJSONArray;
begin
  Source := TJSONArray.Create;
  Target := TJSONArray.Create;
  try
    Source.AddString('original');
    Target.AddText(Source);       // Target owns a deep clone.
    Source.AddString('later');    // Does not change Target's clone.
    Value := Target.AsString;
  finally
    Target.Free;
    Source.Free;
  end;
end;
```

### Usage

`AddText` deep-clones a JSON object or array into the owning array instead of transferring the supplied node.

### Additional Technical Info
`AddText` calls `aValue.Clone`, clears the clone's `Name`, appends the clone and returns it. The source is neither transferred nor modified. For arrays and objects, cloning recursively creates independent descendants.

The returned clone belongs to the receiving array; do not free it. The original remains owned by its existing caller/parent. Subsequent mutation of either tree does not affect the other, except for any external data represented outside these JSON nodes.

Passing `nil` fails when the method tries to call `Clone`; there is no null sentinel. Large trees are duplicated in memory and can make the operation expensive. Bound untrusted structure size before cloning.

Cloning preserves implementation quirks in the source structure. In particular, a cloned empty `TJSONObject` later emits `}` instead of `{}`, and unsafe object field names remain unescaped. Validate the resulting receiver serialization rather than assuming cloning normalizes it.

**External references**

- [RFC 8259 sections 4 and 5: Structured values](https://www.rfc-editor.org/rfc/rfc8259#section-4)
- [Embarcadero object lifetime guidance](https://docwiki.embarcadero.com/RADStudio/Athens/en/Memory_Management)

<small>Created 2026-07-20</small>
