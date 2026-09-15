---
title: AddInteger
description: Appends an owned JSON integer node from a script Integer and returns its borrowed reference.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, integer, number]
---

```Delphi
function AddInteger(const aValue: Integer): TJSONInteger;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
begin
  Values := TJSONArray.Create;
  try
    Values.AddInteger(42);
    Values.AddInteger(-7);
    Value := Values.AsString;  // [42,-7]
  finally
    Values.Free;
  end;
end;
```

### Usage

`AddInteger` appends an owned JSON integer node from a script Integer and returns its borrowed reference.

### Additional Technical Info
`AddInteger` allocates a `TJSONInteger`, copies the script's signed 32-bit `Integer` into its Int64-backed value and appends it. Serialization uses decimal integer text with no quotes.

The array owns the returned node. The node can be modified while attached, but it must not be freed and becomes invalid when removed or when the array is erased, replaced or destroyed.

The array-specific importer exposes no Int64 adder, so this method's direct input range is the script `Integer` range. Large JSON integers read from input can live in `TJSONInteger`, but downstream consumers such as JavaScript may lose precision even within Int64. Agree on numeric range with the endpoint.

**External references**

- [RFC 8259 section 6: Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6)
- [Embarcadero `IntToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IntToStr)
- [Free Pascal `IntToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/inttostr.html) - compatible integer formatting context.

<small>Created 2026-07-20</small>
