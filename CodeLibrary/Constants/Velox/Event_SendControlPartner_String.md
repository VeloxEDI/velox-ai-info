---
title: Event_SendControlPartner_String
description: Provides the exact SendControlPartner token paired with Velox event type 43 for partner control-message send routing.
sidebar_position: 40
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, event, string, sendcontrolpartner]
---

```Delphi
Event_SendControlPartner_String = SendControlPartner
```

### Example

```Delphi
procedure SetEventCode(var EventCode: String);
begin
  EventCode := Event_SendControlPartner_String;
end;
```

### Usage

`Event_SendControlPartner_String` provides the exact SendControlPartner token paired with Velox event type 43 for partner control-message send routing.

### Additional Technical Info
`Event_SendControlPartner_String` is the script string literal `SendControlPartner` associated with partner control-message send routing and numeric event type [`Event_SendControlPartner`](Event_SendControlPartner.md) (`43`). The generated declaration omits display quotes, but the compiled value is a Delphi `String`.

[`GetEventTypeNum`](../../Functions/Velox/GetEventTypeNum.md) accepts this token case-insensitively but without trimming or numeric parsing and returns [`Event_SendControlPartner`](Event_SendControlPartner.md) (`43`). [`GetEventTypeCode`](../../Functions/Velox/GetEventTypeCode.md) emits the exact capitalization shown here for that number. Unknown inputs return Null.

The token is a product routing/category value, not a command or completion result. Assigning it does not create an event row, send or receive data, notify a company/partner, or perform POD work. Those effects belong to the configured module and event processor.

Do not localize, add whitespace or derive event tokens from display labels. The event vocabulary is a fixed 21-member source table; its numeric ranges and names are not a user-extensible algorithm.

Reading the constant is side-effect free. The example is source-reviewed only; no event was converted or processed.

<small>Created 2026-07-15</small>
