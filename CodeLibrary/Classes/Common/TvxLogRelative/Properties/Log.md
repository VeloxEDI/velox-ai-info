---
title: Log
description: Lazily resolves the live Velox log inherited from a parent or owner, a system-log override, or a newly owned private log.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, log, lazy, ownership, lifecycle]
---

```Delphi
property Log: TvxLog read;
```

### Example

```Delphi
procedure RecordSQLContext(const Data: TvxDBDef);
begin
  if Data.Log <> nil then
    Data.Log.LogSQLComment('Preparing data-definition work');
end;
```

### Usage

resolves on first access the live Velox log from a parent or owner, a system-log override, or a newly owned private log.

- Treat the result as a borrowed live object unless you created the owning object and understand its private-log path; never free it from a script.
- Do not retain it across owner/parent changes, resets or teardown.
- Logging mutates execution status/history and can cause database, notification or UI effects through the `TvxLog` operation.

### Additional Technical Info
`Log` returns the live `TvxLog` associated with a Velox object. Reading it is lazy and may resolve or construct state; it is not a passive stored-field read.

#### Source-backed resolution order

When no cached log exists, `TvxLogRelative.GetLog` uses this order:

1. the `Log` of a `TvxLogRelative` parent;
2. the `Log` of a `TvxLogRelative` component owner;
3. the global system log when the concrete class overrides `UseSystemLog=True`; or
4. a new `TvxLog` owned by this object, with its `Test` value copied from the current object.

A `TvxLog` object returns itself. The resolved object is cached and registered for free notification. Changing parent or owner clears the cache. A privately created log is freed by this object; a borrowed parent/owner/system log is not. If a borrowed log is destroyed, notification clears the reference and a later read resolves again.

The source comment says this getter always returns a log, but a system-log override can still yield nil if the global system log has not been assigned. Allocation, recursive resolution and log construction can also raise. The nil check in the example is therefore intentional.

#### Related entries

- [`Test`](Test.md) supplies the test context copied into a newly created private log.
- [`TvxLog`](../../../Modules/TvxLog.md) documents the returned class.
- [`LogSQLComment`](../../../Modules/TvxLog/Methods/LogSQLComment.md) is the operation used by the example.

<small>Created 2026-07-15</small>
