---
title: Event_NotifyUpdateCompany_String
description: Provides the exact NotifyUpdateCompany token paired with Velox event type 22 for company update-notification routing.
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, event, string, notifyupdatecompany]
---

```Delphi
Event_NotifyUpdateCompany_String = NotifyUpdateCompany
```

### Example

```Delphi
procedure SetEventCode(var EventCode: String);
begin
  EventCode := Event_NotifyUpdateCompany_String;
end;
```

### Usage

`Event_NotifyUpdateCompany_String` provides the exact NotifyUpdateCompany token paired with Velox event type 22 for company update-notification routing.

### Additional Technical Info
`Event_NotifyUpdateCompany_String` is the script string literal `NotifyUpdateCompany` associated with company update-notification routing and numeric event type [`Event_NotifyUpdateCompany`](Event_NotifyUpdateCompany.md) (`22`). The generated declaration omits display quotes, but the compiled value is a Delphi `String`.

[`GetEventTypeNum`](../../Functions/Velox/GetEventTypeNum.md) accepts this token case-insensitively but without trimming or numeric parsing and returns [`Event_NotifyUpdateCompany`](Event_NotifyUpdateCompany.md) (`22`). [`GetEventTypeCode`](../../Functions/Velox/GetEventTypeCode.md) emits the exact capitalization shown here for that number. Unknown inputs return Null.

The token is a product routing/category value, not a command or completion result. Assigning it does not create an event row, send or receive data, notify a company/partner, or perform POD work. Those effects belong to the configured module and event processor.

Do not localize, add whitespace or derive event tokens from display labels. The event vocabulary is a fixed 21-member source table; its numeric ranges and names are not a user-extensible algorithm.

Reading the constant is side-effect free. The example is source-reviewed only; no event was converted or processed.

<small>Created 2026-07-15</small>
