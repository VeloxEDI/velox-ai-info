---
title: Event_NotifyIssuePartner_String
description: Provides the exact NotifyIssuePartner token paired with Velox event type 63 for partner issue-notification routing.
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, event, string, notifyissuepartner]
---

```Delphi
Event_NotifyIssuePartner_String = NotifyIssuePartner
```

### Example

```Delphi
procedure SetEventCode(var EventCode: String);
begin
  EventCode := Event_NotifyIssuePartner_String;
end;
```

### Usage

`Event_NotifyIssuePartner_String` provides the exact NotifyIssuePartner token paired with Velox event type 63 for partner issue-notification routing.

### Additional Technical Info
`Event_NotifyIssuePartner_String` is the script string literal `NotifyIssuePartner` associated with partner issue-notification routing and numeric event type [`Event_NotifyIssuePartner`](Event_NotifyIssuePartner.md) (`63`). The generated declaration omits display quotes, but the compiled value is a Delphi `String`.

[`GetEventTypeNum`](../../Functions/Velox/GetEventTypeNum.md) accepts this token case-insensitively but without trimming or numeric parsing and returns [`Event_NotifyIssuePartner`](Event_NotifyIssuePartner.md) (`63`). [`GetEventTypeCode`](../../Functions/Velox/GetEventTypeCode.md) emits the exact capitalization shown here for that number. Unknown inputs return Null.

The token is a product routing/category value, not a command or completion result. Assigning it does not create an event row, send or receive data, notify a company/partner, or perform POD work. Those effects belong to the configured module and event processor.

Do not localize, add whitespace or derive event tokens from display labels. The event vocabulary is a fixed 21-member source table; its numeric ranges and names are not a user-extensible algorithm.

Reading the constant is side-effect free. The example is source-reviewed only; no event was converted or processed.

<small>Created 2026-07-15</small>
