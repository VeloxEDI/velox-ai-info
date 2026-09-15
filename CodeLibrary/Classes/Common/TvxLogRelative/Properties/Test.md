---
title: Test
description: Reports the inherited per-object test execution context that native Velox code propagates through related child and component objects.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, test-mode, execution-context, read-only]
---

```Delphi
property Test: Boolean read;
```

### Example

```Delphi
function ExecutionLabel(const Data: TvxDBDef): string;
begin
  if Data.Test then
    Result := 'Test'
  else
    Result := 'Production';
end;
```

### Usage

Reports the per-object test execution context that Velox code propagates through related child and component objects.

- Use it to branch presentation or defensive script logic, not as an authorisation or proof that all side effects are isolated.
- Test mode can still access databases, files and external services according to module configuration; validate the destinations separately.
- Because Velox propagation occurs on parent/owner lifecycle paths, do not cache this value across module reassignment.

### Additional Technical Info
`Test` reports whether this Velox object is operating in its native test context. The Code Library exposes the property as read-only even though native code has a setter.

#### Source-backed behaviour

A `TvxLogRelative` copies `Test` from a compatible owner during construction and from a compatible parent when its parent changes. Native `SetTest` stores the Boolean and recursively assigns it to all `TvxLogRelative` children and owned components. `Reset` deliberately does not clear the value.

When [`Log`](Log.md) must create a private `TvxLog`, it copies this value into that log. The context can influence test/production paths, revisions, filenames and logging in concrete module workflows, but this property by itself performs none of those actions.

PascalScript registers no writer. A script cannot switch an object into test or production by assigning this property. It can also differ from the global `TestMode` configuration value if native orchestration supplied a particular object context.

#### Related entries

- [`Log`](Log.md) explains how the value reaches a private log.
- [`TestMode`](../../../../Variables/Config/TestMode.md) is the separate global configuration variable.

<small>Created 2026-07-15</small>
