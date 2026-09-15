---
title: IsWarning
description: Tests for exact Warning status; assignments request Warning or OK but false does not normally clear the current type.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, warning, status]
---

```Delphi
property IsWarning: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Value := Action.Log.IsWarning
    else
      Value := False
  else
    Value := False;
end;
```

### Usage

`IsWarning` tests for exact Warning status; assignments request Warning or OK but false does not normally clear the current type.

### Additional Technical Info
`IsWarning` returns true only for exact overall `flsWarning`.

Writing true requests Warning through [`StatusType`](StatusType.md). It succeeds only from NotSet/OK; Issue or any higher ordinal remains unchanged and the getter stays false.

Writing false requests OK and sets Boolean Status true. The monotonic type normally remains Warning/higher, so the getter can remain true immediately after a false assignment.

The setter creates no warning/OK message. Use it primarily to inspect exact type and use an intentional reset lifecycle when a real reset is required. Mutation is unsynchronised and can influence notification/audit decisions.

**Related entries**

- [`StatusType`](StatusType.md) — monotonic enum status.
- [`IsCancelled`](IsCancelled.md) — unique false-reset path.

<small>Created 2026-07-15</small>
