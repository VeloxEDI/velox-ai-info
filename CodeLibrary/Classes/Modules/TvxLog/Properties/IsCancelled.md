---
title: IsCancelled
description: Tests for exact Cancelled status; false assignment uniquely forces the Log back through NotSet to a genuine OK reset.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, cancelled, status]
---

```Delphi
property IsCancelled: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Value := Action.Log.IsCancelled
    else
      Value := False
  else
    Value := False;
end;
```

### Usage

`IsCancelled` tests for exact Cancelled status; false assignment uniquely forces the Log back through NotSet to a genuine OK reset.

### Additional Technical Info
`IsCancelled` is true only when overall [`StatusType`](StatusType.md) is exactly `flsCancelled`.

Writing true requests StatusType=Cancelled. Because overall status only increases by ordinal, the request does not replace an existing Error/Test/Highlight; the getter then remains false.

Writing false is intentionally different from every other quick-status false setter:

1. it directly sets the backing overall type to `flsNotSet`;
2. it requests `flsOK` through the normal setter;
3. overall/header/row types become OK; and
4. Boolean Status becomes true.

This is a real status reset, but it adds no message and does not remove existing log items/evidence. Use it only when cancellation is intentionally being cleared; it can also erase Error/Test/Highlight status.

**Concurrency and related entries**

Mutation is unsynchronised and can alter action continuation/routing. [`Clear`](../Methods/Clear.md) additionally destroys current log content; [`StatusType`](StatusType.md) documents the ordinal model.

<small>Created 2026-07-15</small>
