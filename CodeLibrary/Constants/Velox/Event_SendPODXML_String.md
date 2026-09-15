---
title: Event_SendPODXML_String
description: Provides the exact SendPODXML token paired with Velox event type 103 for POD XML send routing.
sidebar_position: 46
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, event, string, sendpodxml]
---

```Delphi
Event_SendPODXML_String = SendPODXML
```

### Example

```Delphi
procedure SetEventCode(var EventCode: String);
begin
  EventCode := Event_SendPODXML_String;
end;
```

### Usage

`Event_SendPODXML_String` provides the exact SendPODXML token paired with Velox event type 103 for POD XML send routing.

### Additional Technical Info
`Event_SendPODXML_String` is the script string literal `SendPODXML` associated with POD XML send routing and numeric event type [`Event_SendPODXML`](Event_SendPODXML.md) (`103`). The generated declaration omits display quotes, but the compiled value is a Delphi `String`.

[`GetEventTypeNum`](../../Functions/Velox/GetEventTypeNum.md) accepts this token case-insensitively but without trimming or numeric parsing and returns [`Event_SendPODXML`](Event_SendPODXML.md) (`103`). [`GetEventTypeCode`](../../Functions/Velox/GetEventTypeCode.md) emits the exact capitalization shown here for that number. Unknown inputs return Null.

The token is a product routing/category value, not a command or completion result. Assigning it does not create an event row, send or receive data, notify a company/partner, or perform POD work. Those effects belong to the configured module and event processor.

Do not localize, add whitespace or derive event tokens from display labels. The event vocabulary is a fixed 21-member source table; its numeric ranges and names are not a user-extensible algorithm.

Reading the constant is side-effect free. The example is source-reviewed only; no event was converted or processed.

<small>Created 2026-07-15</small>
