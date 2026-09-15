---
title: NotNull
description: Documents a runtime registration defect that makes script NotNull return IsNull instead of its inverse.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, 'null', registration-defect, boolean]
---

```Delphi
property NotNull: Boolean read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: TJSONString;
  Item: TJSONValue;
begin
  Text := TJSONString.Create;
  try
    Item := Text;
    Item.AsString := 'ready';
    Value := not Item.IsNull;  // Use this; do not use Item.NotNull.
  finally
    Text.Free;
  end;
end;
```

### Usage

Do not use `NotNull` as a non-null test in current Velox scripts. It returns exactly the same Boolean as [`IsNull`](IsNull.md), rather than the inverse.

Use `not Item.IsNull` when a script needs to confirm that a JSON value is present. This defect is silent: the property compiles and returns the wrong meaning without warning.

### Additional Technical Info
Do not use this property in Velox scripts. The native Deltics getter correctly returns the inverse of the stored null flag, and native container/null descendants override it appropriately. The PascalScript runtime importer nevertheless registers the `NotNull` name with `TJSONValueIsNull_R` instead of the existing `TJSONValueNotNull_R` helper.

As a result, script `NotNull` returns **exactly the same value as [`IsNull`](IsNull.md)** for every correctly registered descendant:

| Actual state/class | Script `IsNull` | Script `NotNull` |
|---|---:|---:|
| Non-null scalar | `False` | `False` |
| Null-marked scalar | `True` | `True` |
| `TJSONObject` / `TJSONArray` | `False` | `False` |
| `TJSONNull` | `True` | `True` |

The compiler accepts the property and no exception warns about the misbinding, making it especially dangerous in conditions. Always write `not Item.IsNull`. This is a deterministic registration defect, not three-state null logic and not dependent on the payload.

Reading is constant-time and has no side effect. The result remains invalid as a non-null predicate until the runtime importer is corrected; documentation cannot repair existing compiled behavior.

<small>Created 2026-07-15</small>
