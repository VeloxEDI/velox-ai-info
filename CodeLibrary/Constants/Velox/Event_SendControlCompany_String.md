---
title: Event_SendControlCompany_String
description: Exposes the defective script token SendControlCompan, which does not round-trip to native SendControlCompany event type 3.
sidebar_position: 38
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, event, string, sendcontrolcompany]
---

```Delphi
Event_SendControlCompany_String = SendControlCompan
```

### Example

```Delphi
procedure SetEventCode(var EventCode: String);
begin
  EventCode := Event_SendControlCompany_String;
end;
```

### Usage

`Event_SendControlCompany_String` exposes the defective script token SendControlCompan, which does not round-trip to Velox SendControlCompany event type 3.

### Additional Technical Info
`Event_SendControlCompany_String` is the script string literal `SendControlCompan` associated with company control-message send routing and numeric event type [`Event_SendControlCompany`](Event_SendControlCompany.md) (`3`). The generated declaration omits display quotes, but the compiled value is a Delphi `String`.

**Known non-round-trip defect**

The native product constant and both conversion functions use `SendControlCompany` with a final `y`; only the Pascal Script import uses `SendControlCompan`. Therefore:

- `GetEventTypeNum(Event_SendControlCompany_String)` returns Null.
- `GetEventTypeCode(Event_SendControlCompany)` returns `SendControlCompany`, not this script constant.
- Comparing the converter result to `Event_SendControlCompany_String` is false.

Do not use this string constant for conversion or persistence. Use numeric [`Event_SendControlCompany`](Event_SendControlCompany.md) or the exact native token `SendControlCompany` until the product import is corrected. The generated declaration and this page intentionally preserve current script behavior.

The token is a product routing/category value, not a command or completion result. Assigning it does not create an event row, send or receive data, notify a company/partner, or perform POD work. Those effects belong to the configured module and event processor.

Do not localize, add whitespace or derive event tokens from display labels. The event vocabulary is a fixed 21-member source table; its numeric ranges and names are not a user-extensible algorithm.

Reading the constant is side-effect free. The example is source-reviewed only; no event was converted or processed.

<small>Created 2026-07-15</small>
