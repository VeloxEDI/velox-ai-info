---
title: Event_SendPartner
description: Identifies Velox event type 41 for the general partner-side send routing intent.
sidebar_position: 43
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, event, routing, sendpartner]
---

```Delphi
Event_SendPartner = 41
```

### Example

```Delphi
procedure SetEventType(var EventType: LongInt);
begin
  EventType := Event_SendPartner;
end;
```

### Usage

`Event_SendPartner` identifies Velox event type 41 for the general partner-side send routing intent.

### Additional Technical Info
`Event_SendPartner` is the sparse Velox event identifier `41` for the general partner-side send routing intent. Its paired canonical script token is [`Event_SendPartner_String`](Event_SendPartner_String.md), `SendPartner`.

[`GetEventTypeCode`](../../Functions/Velox/GetEventTypeCode.md) converts the number to the native product token `SendPartner`; unknown numbers and Null return Null. [`GetEventTypeNum`](../../Functions/Velox/GetEventTypeNum.md) performs the reverse fixed lookup using case-insensitive, otherwise exact text.

The constant is a routing/category value, not an operation. Assigning it to a variable does not enqueue an event, send data, notify anyone, create or email a PDF, or update a database. Product consumers use numeric values in event-table rows and queries; the owning module, record lifecycle and transaction decide whether work is actually created, processed, retried or completed.

The numeric ranges group product intents but are not arithmetic. Only the 21 documented event values are valid; do not derive another event by adding an offset. Validate externally supplied values and retain the applicable company/partner/POD context.

Reading the constant is side-effect free. The example is source-reviewed only; no event was created or processed.

<small>Created 2026-07-15</small>
