---
title: Event_NotifyUpdateCompany
description: Identifies Velox event type 22 for the company-side update-notification routing intent.
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, event, routing, notifyupdatecompany]
---

```Delphi
Event_NotifyUpdateCompany = 22
```

### Example

```Delphi
procedure SetEventType(var EventType: LongInt);
begin
  EventType := Event_NotifyUpdateCompany;
end;
```

### Usage

`Event_NotifyUpdateCompany` identifies Velox event type 22 for the company-side update-notification routing intent.

### Additional Technical Info
`Event_NotifyUpdateCompany` is the sparse Velox event identifier `22` for the company-side update-notification routing intent. Its paired canonical script token is [`Event_NotifyUpdateCompany_String`](Event_NotifyUpdateCompany_String.md), `NotifyUpdateCompany`.

[`GetEventTypeCode`](../../Functions/Velox/GetEventTypeCode.md) converts the number to the native product token `NotifyUpdateCompany`; unknown numbers and Null return Null. [`GetEventTypeNum`](../../Functions/Velox/GetEventTypeNum.md) performs the reverse fixed lookup using case-insensitive, otherwise exact text.

The constant is a routing/category value, not an operation. Assigning it to a variable does not enqueue an event, send data, notify anyone, create or email a PDF, or update a database. Product consumers use numeric values in event-table rows and queries; the owning module, record lifecycle and transaction decide whether work is actually created, processed, retried or completed.

The numeric ranges group product intents but are not arithmetic. Only the 21 documented event values are valid; do not derive another event by adding an offset. Validate externally supplied values and retain the applicable company/partner/POD context.

Reading the constant is side-effect free. The example is source-reviewed only; no event was created or processed.

<small>Created 2026-07-15</small>
