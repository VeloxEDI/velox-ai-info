---
title: Event_NotifyCompany_String
description: Provides the exact NotifyCompany token paired with Velox event type 21 for general company notification routing.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, event, string, notifycompany]
---

```Delphi
Event_NotifyCompany_String = NotifyCompany
```

### Example

```Delphi
procedure SetEventCode(var EventCode: String);
begin
  EventCode := Event_NotifyCompany_String;
end;
```

### Usage

`Event_NotifyCompany_String` provides the exact NotifyCompany token paired with Velox event type 21 for general company notification routing.

### Additional Technical Info
`Event_NotifyCompany_String` is the script string literal `NotifyCompany` associated with general company notification routing and numeric event type [`Event_NotifyCompany`](Event_NotifyCompany.md) (`21`). The generated declaration omits display quotes, but the compiled value is a Delphi `String`.

[`GetEventTypeNum`](../../Functions/Velox/GetEventTypeNum.md) accepts this token case-insensitively but without trimming or numeric parsing and returns [`Event_NotifyCompany`](Event_NotifyCompany.md) (`21`). [`GetEventTypeCode`](../../Functions/Velox/GetEventTypeCode.md) emits the exact capitalization shown here for that number. Unknown inputs return Null.

The token is a product routing/category value, not a command or completion result. Assigning it does not create an event row, send or receive data, notify a company/partner, or perform POD work. Those effects belong to the configured module and event processor.

Do not localize, add whitespace or derive event tokens from display labels. The event vocabulary is a fixed 21-member source table; its numeric ranges and names are not a user-extensible algorithm.

Reading the constant is side-effect free. The example is source-reviewed only; no event was converted or processed.

<small>Created 2026-07-15</small>
