---
title: AddDatetime
description: Appends a UTC-labelled ISO-8601 string, while zero triggers the array's empty-string null defect.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, datetime, iso-8601]
---

```Delphi
function AddDatetime(const aValue: TDateTime): TJSONString;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
begin
  Values := TJSONArray.Create;
  try
    { Supply an actual UTC TDateTime because the formatter labels it Z. }
    Values.AddDatetime(NowUTC);
    Value := Values.AsString;
  finally
    Values.Free;
  end;
end;
```

### Usage

`AddDatetime` appends a UTC-labelled ISO-8601 string, while zero triggers the array's empty-string null defect.

### Additional Technical Info
`AddDatetime` creates a string node. For a nonzero value it calls Delphi `DateToISO8601(aValue)` with the default `AInputIsUTC=True`, producing millisecond text ending in `Z` without converting a local value to UTC first. Pass a value already expressed in UTC; passing local `Now` mislabels local wall time as UTC.

When `aValue = 0`, the implementation marks the `TJSONString` null instead of assigning text. `TJSONArray` then serializes that null-marked string as `""`, not JSON `null`. Test for zero and choose an application-defined representation rather than relying on this method for null.

The returned string node is owned by the array and becomes invalid when its entry or parent is cleared/freed. Date strings are a convention layered on JSON; consumers must agree on timezone, precision and zero/null policy.

**External references**

- [Embarcadero `DateToISO8601`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DateToISO8601)
- [Free Pascal `DateToISO8601`](https://www.freepascal.org/docs-html/rtl/dateutils/datetoiso8601.html) - analogous conversion context; Velox executes Delphi's implementation.
- [RFC 3339: Date and time on the Internet](https://www.rfc-editor.org/rfc/rfc3339)

<small>Created 2026-07-20</small>
