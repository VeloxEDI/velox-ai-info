---
title: Event_EmailPODPDF
description: Identifies Velox event type 102 for the POD-processing intent to email a PDF representation.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, event, routing, emailpodpdf]
---

```Delphi
Event_EmailPODPDF = 102
```

### Example

```Delphi
procedure SetEventType(var EventType: LongInt);
begin
  EventType := Event_EmailPODPDF;
end;
```

### Usage

`Event_EmailPODPDF` identifies Velox event type 102 for the POD-processing intent to email a PDF representation.

### Additional Technical Info
`Event_EmailPODPDF` is the sparse Velox event identifier `102` for the POD-processing intent to email a PDF representation. Its paired canonical script token is [`Event_EmailPODPDF_String`](Event_EmailPODPDF_String.md), `EmailPODPDF`.

[`GetEventTypeCode`](../../Functions/Velox/GetEventTypeCode.md) converts the number to the native product token `EmailPODPDF`; unknown numbers and Null return Null. [`GetEventTypeNum`](../../Functions/Velox/GetEventTypeNum.md) performs the reverse fixed lookup using case-insensitive, otherwise exact text.

The constant is a routing/category value, not an operation. Assigning it to a variable does not enqueue an event, send data, notify anyone, create or email a PDF, or update a database. Product consumers use numeric values in event-table rows and queries; the owning module, record lifecycle and transaction decide whether work is actually created, processed, retried or completed.

The numeric ranges group product intents but are not arithmetic. Only the 21 documented event values are valid; do not derive another event by adding an offset. Validate externally supplied values and retain the applicable company/partner/POD context.

Reading the constant is side-effect free. The example is source-reviewed only; no event was created or processed.

<small>Created 2026-07-15</small>
