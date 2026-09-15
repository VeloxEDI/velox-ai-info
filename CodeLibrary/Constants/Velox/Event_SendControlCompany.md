---
title: Event_SendControlCompany
description: Identifies Velox event type 3 for the company-side control-message send routing intent.
sidebar_position: 37
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, event, routing, sendcontrolcompany]
---

```Delphi
Event_SendControlCompany = 3
```

### Example

```Delphi
procedure SetEventType(var EventType: LongInt);
begin
  EventType := Event_SendControlCompany;
end;
```

### Usage

`Event_SendControlCompany` identifies Velox event type 3 for the company-side control-message send routing intent.

### Additional Technical Info
`Event_SendControlCompany` is the sparse Velox event identifier `3` for the company-side control-message send routing intent.

**Script string mismatch**

The paired script constant [`Event_SendControlCompany_String`](Event_SendControlCompany_String.md) is currently `SendControlCompan` because the Pascal Script import drops the final `y`. Native `GetEventTypeCode(3)` returns `SendControlCompany`, and only that full native token is recognized by `GetEventTypeNum`. Prefer this numeric constant for script event-table logic and treat the string defect as future product work.

[`GetEventTypeCode`](../../Functions/Velox/GetEventTypeCode.md) converts the number to the native product token `SendControlCompany`; unknown numbers and Null return Null. [`GetEventTypeNum`](../../Functions/Velox/GetEventTypeNum.md) performs the reverse fixed lookup using case-insensitive, otherwise exact text.

The constant is a routing/category value, not an operation. Assigning it to a variable does not enqueue an event, send data, notify anyone, create or email a PDF, or update a database. Product consumers use numeric values in event-table rows and queries; the owning module, record lifecycle and transaction decide whether work is actually created, processed, retried or completed.

The numeric ranges group product intents but are not arithmetic. Only the 21 documented event values are valid; do not derive another event by adding an offset. Validate externally supplied values and retain the applicable company/partner/POD context.

Reading the constant is side-effect free. The example is source-reviewed only; no event was created or processed.

<small>Created 2026-07-15</small>
