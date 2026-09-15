---
title: Date
description: Parses the first Date request-header value to TDateTime, returning -1 when absent and raising on invalid nonempty syntax.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, date, utc, sentinel]
---

```Delphi
property Date: TDateTime read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if (Request <> nil) and (Request.Date >= 0) then
    Value := Request.Date
  else
    Value := 0;
end;
```

### Usage

Parses the first Date request-header value to TDateTime, returning -1 when absent and raising on invalid nonempty syntax.

### Additional Technical Info
`Date` looks up the first `Date` request-header value through Indy and passes it to WebBroker date parsing. If the selected value is empty, the bridge returns `-1`. This sentinel means absent/unavailable; it is not a valid received timestamp and is different from Delphi `TDateTime` zero.

Normal HTTP-date text begins with a weekday name. WebBroker sends that form through `RFC822ToDate(Value, True)`, so the numerical `TDateTime` represents UTC but carries no timezone marker. Numeric-leading obsolete forms use WebBroker's older parser, which recognises limited English month layouts, maps a two-digit year into the 2000s and does not apply timezone conversion.

Invalid nonempty text can raise a date/format/range exception. Reading the property is therefore not a safe Boolean validity test; isolate it where malformed caller input must become a controlled client error. Do not use `Date` as the Velox receipt time, replay prevention, authentication evidence or a trusted business timestamp. A caller or intermediary can omit or alter it.

Copy a successfully parsed value immediately if later logic needs it, record separately whether the sentinel was present, and apply explicit freshness/skew rules only within a designed signed protocol. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.Date`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Date)
- [Embarcadero DocWiki: `Web.HTTPApp.ParseDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.ParseDate)
- [RFC 9110 section 6.6.1: Date](https://www.rfc-editor.org/rfc/rfc9110#section-6.6.1)

<small>Created 2026-07-15</small>
