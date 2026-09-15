---
title: TvxActionReport
description: Represents a configured Velox report action that can render, save or email report output.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - modules
  - reports
---

```Delphi
TvxActionReport = class(TvxActionItem)
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
      Value := ReportStep.Attachments.Count;
    end;
end;
```

### Usage

`TvxActionReport` represents a configured Velox report action that can render, save or email report output.

**Behaviour**

Velox owns the report action. When executed, it requires an assigned data definition and a loadable report module, opens report source data, applies configured print/output options and executes the report. Errors and cancellation update the shared flow log/status.

For email output, the action builds the generated report attachment/body and then iterates the script-visible supplementary `Attachments` list. Each list entry is tag-expanded using current action locals and passed to email file attachment handling.

**Usage notes**

Do not free the report action, returned list or loaded report. Treat file paths, report data and recipient output as sensitive.

### Additional Technical Info
`TvxActionReport` is the concrete action-step type used to execute a configured Velox report. Depending on configuration, report execution can render to a device, write a file or construct and send an email with generated and supplementary attachments.

**Implementation**

The scripting class descends from [`TvxActionItem`](TvxActionItem.md) and declares one additional member, [`Attachments`](TvxActionReport/Properties/Attachments.md). Runtime registration exposes that property through direct `TStringList` getter/setter helpers.

No constructor is registered for scripts. Obtain a configured action item from [`TvxActionMan.Actions`](TvxActionMan/Properties/Actions.md), verify its concrete type and cast it only when it is a `TvxActionReport`.

The native class has many configuration and execution members, but they are not registered on this scripting class and must not be assumed callable.

**Edge cases and quirks**

- The supplementary attachment list is constructed empty and is not cleared by ordinary action reset. Values added by a script can remain on the same loaded/pooled action for later executions unless the script deliberately clears them.
- Attachment failures in the supplementary/legacy attachment block are caught and silently ignored. An email can therefore be reported sent even though a requested extra file was absent or unreadable.
- Inherited `Active`/`ItemActive` can make the parent manager skip the report action entirely.
- A successful report result does not guarantee email delivery or every file attachment; those have later and partly independent failure paths.

**Performance and concurrency**

The object itself is a live configured step; execution can query data, render a large report, allocate streams, read files and perform network email I/O. The action and its `TStringList` are not safe for concurrent script mutation.

**Related entries**

- [`Attachments`](TvxActionReport/Properties/Attachments.md) — supplementary email file list.
- [`TvxActionItem`](TvxActionItem.md) — inherited active/ownership contract.
- [`TvxActionMan.Actions`](TvxActionMan/Properties/Actions.md) — obtains configured steps.

<small>Created 2026-07-15</small>
