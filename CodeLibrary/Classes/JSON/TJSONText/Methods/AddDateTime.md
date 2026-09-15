---
title: AddDateTime
description: Adds a named ISO-8601 String node, treating a nonzero value as UTC and representing zero through a null-marked String.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, adddatetime, datetime, iso8601, utc]
---

```Delphi
function AddDateTime(const aName: String;
  const aValue: TDateTime): TJSONString;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Document.AddDateTime('processedAt',
      EncodeDateTime(2026, 7, 20, 12, 30, 0, 0));
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

`AddDateTime` adds a named ISO-8601 String node, treating a nonzero value as UTC and representing zero through a null-marked String.

### Additional Technical Info
For a nonzero `aValue`, `AddDateTime` calls Delphi `DateToISO8601(aValue)` with its omitted `AInputIsUTC=True` default, stores the result in a `TJSONString`, assigns `aName` and transfers the node to the receiver. It does not convert local time to UTC: it treats the supplied numeric date/time as already UTC and appends `Z`, including milliseconds.

The exact zero `TDateTime` is a sentinel rather than 30 December 1899. The method leaves the String payload empty and sets inherited `IsNull=True`. An object serializes that node as JSON `null`. An array reached through this ancestor has divergent serializers: compact `AsString` sees a String and emits `""`, while [`AsDisplayText`](../Properties/AsDisplayText.md) checks null first and emits `null`.

The returned String node is borrowed and parent-owned. Its value/name can be changed while the parent lives, but deleting/reloading/freeing the parent invalidates the reference. Nonzero values are not range-normalized by this wrapper; Delphi date decoding/formatting exceptions propagate.

Use a documented timezone conversion before this method when the source value represents local time. A trailing `Z` produced here is a label, not proof that conversion occurred. String escaping is applied only when the parent serializes, and the shared encoder still omits some control-character escapes.

**External references**

- [Embarcadero `DateToISO8601`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.DateUtils.DateToISO8601)
- [Free Pascal `DateToISO8601`](https://www.freepascal.org/docs-html/rtl/dateutils/datetoiso8601.html) - analogous conversion context; Velox uses Delphi's default UTC flag.
- [RFC 3339 date and time format](https://www.rfc-editor.org/rfc/rfc3339)

<small>Created 2026-07-15</small>
