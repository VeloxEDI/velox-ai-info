---
title: AsDateTime
description: Converts ISO 8601 text to a UTC TDateTime and writes an input already treated as UTC with a Z designator.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, datetime, iso-8601, utc]
---

```Delphi
property AsDateTime: TDateTime read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: TJSONString;
  Item: TJSONValue;
begin
  Text := TJSONString.Create;
  try
    Item := Text;
    Item.AsString := '2026-07-20T03:30:00.000Z';
    Value := Item.AsDateTime;
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsDateTime` converts ISO 8601 text to a UTC TDateTime and writes an input already treated as UTC with a Z designator.

### Additional Technical Info
The reader returns `0` (`NULLDATE`) when [`IsNull`](IsNull.md) is true. Otherwise it calls Delphi `ISO8601ToDate(AsString, True)`. The `True` argument requests a UTC result: an explicit source offset is applied and a `Z` timestamp remains UTC. Invalid or unsupported text raises `EConvertError`; the property does not fall back or pre-check `ValueType`.

The writer calls `DateToISO8601(aValue, True)` and assigns the result through [`AsString`](AsString.md). The `True` argument means **the supplied numeric `TDateTime` is already UTC**. It does not convert a local value to UTC before appending the `Z` designator. Convert local time explicitly before assignment or the timestamp will be mislabeled.

Zero is not treated specially by this property: writing `0` produces the ISO representation of Delphi's zero date rather than semantic JSON null. By contrast, some `AddDateTime` helpers use exact zero as a null sentinel. Read null state separately when that distinction matters.

The concrete receiver controls storage. A String node stores ISO text; a compatible date-like String convention round-trips. A Boolean/number may reject the generated text after changing null state, and a container attempts to parse/replace itself. The conversion is synchronous. Parsing/formatting allocates text and depends on Delphi's date utilities, but the explicit UTC flags avoid local-time-zone lookup on this selected path.

**External references**

- [Embarcadero `ISO8601ToDate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.DateUtils.ISO8601ToDate)
- [Embarcadero `DateToISO8601`](https://docwiki.embarcadero.com/Libraries/Florence/en/API%3ASystem.DateUtils.DateToISO8601)
- [Free Pascal `ISO8601ToDate`](https://www.freepascal.org/docs-html/current/rtl/dateutils/iso8601todate.html) - compatible UTC-return context.
- [Free Pascal `DateToISO8601`](https://www.freepascal.org/docs-html/rtl/dateutils/datetoiso8601.html) - compatible input-is-UTC context.

<small>Created 2026-07-15</small>
