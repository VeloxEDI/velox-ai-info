---
title: Attachments
description: Provides the action-owned list of supplementary file paths attached to emailed report output.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - reports
  - attachments
---

```Delphi
property Attachments: TStringList read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  ReportStep: TvxActionReport;
begin
  Value := 0;
  if Action.ActionCount > 0 then
    if Action.Actions[0] is TvxActionReport then
    begin
      ReportStep := TvxActionReport(Action.Actions[0]);
      ReportStep.Attachments.Clear;
      ReportStep.Attachments.Add('C:\ApprovedData\report-support.txt');
      Value := ReportStep.Attachments.Count;
    end;
end;
```

### Usage

`Attachments` provides the action-owned list of supplementary file paths attached to emailed report output.

**Behaviour**

The list belongs to the loaded report action and is not cleared by ordinary flow reset. Clear or rebuild it deterministically before adding per-execution paths; otherwise files from an earlier execution can be attached again. Duplicate entries are not removed and can produce duplicate attachments.

The list is consumed only by the report email path. Adding a value does not immediately read a file or send mail, and it does not affect report-to-file/device output. It also does not copy, move, delete or audit the source file.

**Errors**

Normal `TStringList` index and object-lifetime errors apply while editing. File attachment errors are suppressed by the current report email process, so scripts should validate trusted file existence/access before adding paths and log their own actionable diagnostics when required.

**Usage notes**

Do not call `Free` on the returned list or assign another list object. Avoid attaching secrets, temporary files with weak access controls or user-controlled paths without an allow-list/root validation.

### Additional Technical Info
`Attachments` is the live `TStringList` of extra files that a `TvxActionReport` attempts to attach when it produces email output.

Treat the reference as read-only and mutate its contents with `Add`, `Delete` or `Clear`. Each string is a file path; Velox tag expansion occurs later when email execution consumes it.

**Implementation**

The report action constructor creates one empty `TStringList` and its destructor frees the list currently stored in the field. The runtime getter returns that exact object. The generated setter directly replaces the field reference; it does not copy strings or free the previous list.

During email handling, Velox iterates from zero to `Count - 1`, processes tags in each entry using action locals and passes the resulting path to email `AttachFile`.

**Edge cases and quirks**

- A broad exception handler silently ignores errors while attaching supplementary and legacy file paths. Missing, inaccessible, locked or invalid files can be omitted without failing the email or adding a specific attachment error.
- Tag expansion can produce an empty, malformed or unintended path when local values are missing or untrusted.
- Files are opened under the Velox process/service identity. A path that works interactively might not be accessible to the service, and a service-accessible path might expose data the caller should not receive.
- Large or numerous files increase memory, disk and email-transport cost and can exceed downstream message limits.
- A successful send log does not prove every requested extra attachment was included.

**Side effects**

List mutation changes later email composition for the shared loaded action. Replacing the list reference is unsafe: it leaks the constructor-created list and causes the report action eventually to free the replacement, which may be owned elsewhere and lead to double-free/use-after-free behaviour.

**Performance and concurrency**

List edits are in-memory; email execution later reads every referenced file. `TStringList` and the report action are not thread-safe. Do not mutate the list while the same report action is composing email.

**Related entries**

- [`TvxActionReport`](../../TvxActionReport.md) — owner and email execution lifecycle.
- [`TStringList`](../../../Lists/TStringList.md) — list operations and inherited string-list behaviour.
- [`Locals`](../../../../Variables/Locals/Locals.md) — values used for path tag expansion.

<small>Created 2026-07-15</small>
