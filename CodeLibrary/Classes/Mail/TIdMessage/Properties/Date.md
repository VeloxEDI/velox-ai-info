---
title: Date
description: Stores the message's local date-time or the zero sentinel that makes each normal header generation use the current clock.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, date, datetime, timezone, header]
---

```Delphi
property Date: TDateTime read write;
```

### Example

```Delphi
procedure SetMessageDate;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  // Store one fixed local time for every later generation of this message.
  Msg.Date := Now;
end;
```

### Usage

Stores the message's local date-time or the zero sentinel that makes each normal header generation use the current clock.

### Additional Technical Info
`Date` is the typed, local-time value behind the Internet message `Date` header. It is a Delphi [`TDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.TDateTime): the whole-number portion counts days and the fractional portion represents time of day.

This property also carries control state. A value of exactly `0` means “use the current time later” and makes [`UseNowForDate`](UseNowForDate.md) read `True`. Any nonzero value makes UseNowForDate read `False`. Assigning Date therefore changes UseNowForDate without calling its setter.

#### Header generation

Normal [`GenerateHeader`](../Methods/GenerateHeader.md) behavior is:

1. If Date is zero, read `Now` into a temporary value.
2. Otherwise use the stored Date.
3. Format that value as the generated `Date` header.

The zero case does not write the temporary value back. Repeated generation, sending or saving can therefore produce different Date headers while Date remains zero. Set UseNowForDate to `False` or assign a nonzero Date when retries, signatures, comparisons or archived output require one stable timestamp.

The formatter expects a local value. It writes the local clock fields and appends the Velox process's current UTC offset; it does not receive Date when obtaining that offset. A stored historical or future value across daylight-saving boundaries can therefore be labelled with the current offset rather than the offset that applied at the represented instant. Generate as close to the intended time as practical, or inspect the generated header where exact historical offset fidelity matters.

#### Parsing and lifecycle

[`ProcessHeaders`](../Methods/ProcessHeaders.md) parses the raw `Date` field, applies its explicit wire offset and converts the result to local time. A missing or unparseable field produces the Indy's zero result, which also enables UseNowForDate. Consequently, loading a message without a usable Date can later generate a new current Date if that message is saved normally.

[`ClearHeader`](../Methods/ClearHeader.md) and [`Clear`](../Methods/Clear.md) set Date to zero. No range, business-calendar or plausibility validation occurs when a script assigns the property. Negative values and dates outside practical mail ranges reach lower date-formatting routines and can format unexpectedly or fail there.

[`NoEncode`](NoEncode.md) bypasses normal generation, so changing Date does not change raw output until normal generation is restored. Date represents message authorship time, not SMTP delivery time, receipt time or IMAP internal date.

The example is source-reviewed only; no message was generated.

**External references**

- [Indy upstream: `TIdMessage` date parsing and generation](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - implementation used by the Velox-modified class.
- [Embarcadero: `TDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.TDateTime) - Delphi representation and range.
- [Embarcadero: `Now`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Now) - current local date-time source.
- [Free Pascal: `TDateTime`](https://www.freepascal.org/docs-html/rtl/system/tdatetime.html) and [Free Pascal: `Now`](https://www.freepascal.org/docs-html/rtl/sysutils/now.html) - compatible core type and clock routine.
- [RFC 5322 section 3.6.1](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.1) - origination date semantics and syntax.

<small>Created 2026-07-15</small>
