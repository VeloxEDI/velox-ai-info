---
title: ValueCount
description: Reports the physical owned-child count, including duplicate names and null fields inserted by missing default-property reads.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, value, count]
---

```Delphi
property ValueCount: Integer read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString('{"first":1,"second":2}');
  try
    Value := Payload.ValueCount;  // 2
  finally
    Payload.Free;
  end;
end;
```

### Usage

`ValueCount` reports the physical owned-child count, including duplicate names and null fields inserted by missing default-property reads.

### Additional Technical Info
`ValueCount` returns the number of physical child nodes in the owning list. It is zero for an empty object and includes every duplicate-name occurrence and every null value.

The value can increase through add helpers, `Combine`, parsing and a missing read of default [`Values[name]`](Values.md). That last case is easy to overlook: reading an absent name inserts an owned null-marked String and increments the count. `FindValue` and `Contains` do not.

Deletion reduces the count by one, while `Erase`, virtual `Clear` and successful replacement reduce or replace the whole list. Valid `ValueByIndex` indexes are zero through `ValueCount - 1`.

Count says nothing about unique names, non-null values or valid serialization. A count of zero currently serializes through the object's `}` defect.

**External references**

- [Embarcadero `TObjectList.Count`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TList.Count)

<small>Created 2026-07-20</small>
