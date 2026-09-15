---
title: Event_SendCollectPartner_String
description: Provides the exact SendCollectPartner token paired with Velox event type 44 for partner collection-send routing.
sidebar_position: 34
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, event, string, sendcollectpartner]
---

```Delphi
Event_SendCollectPartner_String = SendCollectPartner
```

### Example

```Delphi
procedure SetEventCode(var EventCode: String);
begin
  EventCode := Event_SendCollectPartner_String;
end;
```

### Usage

`Event_SendCollectPartner_String` provides the exact SendCollectPartner token paired with Velox event type 44 for partner collection-send routing.

### Additional Technical Info
`Event_SendCollectPartner_String` is the script string literal `SendCollectPartner` associated with partner collection-send routing and numeric event type [`Event_SendCollectPartner`](Event_SendCollectPartner.md) (`44`). The generated declaration omits display quotes, but the compiled value is a Delphi `String`.

[`GetEventTypeNum`](../../Functions/Velox/GetEventTypeNum.md) accepts this token case-insensitively but without trimming or numeric parsing and returns [`Event_SendCollectPartner`](Event_SendCollectPartner.md) (`44`). [`GetEventTypeCode`](../../Functions/Velox/GetEventTypeCode.md) emits the exact capitalization shown here for that number. Unknown inputs return Null.

The token is a product routing/category value, not a command or completion result. Assigning it does not create an event row, send or receive data, notify a company/partner, or perform POD work. Those effects belong to the configured module and event processor.

Do not localize, add whitespace or derive event tokens from display labels. The event vocabulary is a fixed 21-member source table; its numeric ranges and names are not a user-extensible algorithm.

Reading the constant is side-effect free. The example is source-reviewed only; no event was converted or processed.

<small>Created 2026-07-15</small>
