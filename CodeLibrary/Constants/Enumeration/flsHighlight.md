---
title: flsHighlight
description: Labels a highlighted Note line but has the maximum status ordinal, so assigning it can block every later normal StatusType update.
sidebar_position: 70
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, log, status, highlight, note, ordinal, quirk]
---

```Delphi
flsHighlight = 8
```

### Example

```Delphi
function IsHighlightedNote(const Status: TvxLogStatusType): Boolean;
begin
  Result := Status = flsHighlight;
end;
```

### Usage

`flsHighlight` labels a highlighted Note line but has the maximum status ordinal, so assigning it can block every later normal StatusType update.

### Additional Technical Info
`flsHighlight` is ordinal 8, the maximum member of [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md). Its display text is `Note`, its email-class table value is Notify, and source comments describe it as a line/highlight concept rather than the most severe execution outcome.

The current setter nevertheless retains statuses by `Value > current`. If Highlight is assigned as the overall StatusType, no later member can replace it through the normal setter, including Error. A later Error still sets Boolean `Log.Status=False`, producing StatusType=Highlight with Boolean failure. This is a material implementation quirk, not a recommended status model.

Message-log level mapping deliberately does not promote Highlight to overall status in the common switch, which limits the problem for normal `LogHighlight` use. Avoid manually assigning it to overall StatusType. Default save/send sets exclude Highlight, and several email lookup case statements omit it even though the parallel table contains a value.

Use Highlight to render an important informational log line through the intended logging helper, not to classify Flow completion. Never rank outcomes by enum ordinal.

The example only compares a value and was source-reviewed; no highlight, status assignment, email, runtime or image-function test was executed.

<small>Created 2026-07-15</small>
