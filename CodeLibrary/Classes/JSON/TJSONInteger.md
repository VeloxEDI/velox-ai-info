---
title: TJSONInteger
description: Represents a mutable signed 64-bit JSON integer with exact decimal output and narrower inherited Integer conversions.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, integer, int64, number]
---

```Delphi
TJSONInteger = class(TJSONNumber)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
  Number: TJSONInteger;
begin
  Values := TJSONArray.Create;
  try
    Number := Values.AddInteger(0);  // Borrowed; Values owns it.
    Number.Value := 5000000000;
    Value := Values.AsString;  // [5000000000]
  finally
    Values.Free;
  end;
end;
```

### Usage

`TJSONInteger` represents a mutable signed 64-bit JSON integer with exact decimal output and narrower Integer conversions.

### Additional Technical Info
The native `TJSONInteger` class stores a signed 64-bit integer; correctly constructed helper/parser nodes have `ValueType = jsNumber`. Its native `TJSONNumber` ancestor descends from `TJSONValue`, is hidden and adds no members.

The PascalScript compiler importer incorrectly registers hidden `TJSONNumber` directly beneath `TObject`. A `TJSONInteger`-typed script expression therefore exposes only [`Value`](TJSONInteger/Properties/Value.md) and the `TObject` surface, not `TJSONValue` members such as `AsString`, `AsInt64`, `AsInteger`, `IsNull`, `Clear`, `CopyFrom` or `IsEqual`. It is not compile-time assignable to `TJSONValue`.

Direct `TJSONInteger.Create` consequently resolves through `TObject.Create` and skips the native JSON value-type initializer. Do not use a directly constructed instance as a JSON tree node. `TJSONArray.AddInteger`, object helpers and the parser invoke the native constructor correctly. Their returned node is parent-owned and borrowed, as shown in the example.

When native JSON code serializes a correctly initialized node—or it is reached through a base-typed `TJSONValue` reference—`AsString` uses `IntToStr` and emits a culture-independent signed decimal representation. Native/base-typed `AsString` assignment uses Delphi `StrToInt64`; invalid or out-of-range text raises `EConvertError`. The converter also accepts some Delphi integer notations outside JSON grammar, then normalizes the stored value to decimal. These conversion members are not exposed through a `TJSONInteger`-typed script expression.

The class can hold `-9223372036854775808` through `9223372036854775807`. The generated array [`AddInteger`](TJSONArray/Methods/AddInteger.md) entry accepts only a 32-bit `Integer`, but its returned `TJSONInteger.Value` can subsequently be assigned across the full Int64 range. Native/base-typed `AsInteger` is a separate 32-bit conversion and raises when the stored decimal value does not fit. Through the correctly registered `TJSONInteger` script type, `Value` is the full-range accessor.

Many non-Pascal JSON consumers represent every number as IEEE 754 binary64. RFC 8259 identifies only integers between `-(2^53)+1` and `(2^53)-1` as reliably interoperable without loss. Preserve larger identifiers as strings when the receiver cannot guarantee Int64 parsing.

The Deltics reader routes a token containing no period to this class. Exponent-only JSON such as `1e3` is therefore sent to `StrToInt64` and fails rather than becoming a Double.

#### Null and base-typed behavior

Native `Clear`, or a call through a `TJSONValue`-typed reference, marks a correctly initialized node null without zeroing its retained `Value`. Objects serialize the state as `null`; arrays have a defect that receives blank `AsString` for this `jsNumber` and emits an empty token. On the base script type, `NotNull` is incorrectly bound to `IsNull` and returns the same value.

Native `TJSONInteger.CopyFrom` assumes another exact `TJSONInteger` without a runtime type guard. Native `IsEqual` compares type, name and `AsString`, ignores the null flag and can equate cleared integers with different retained values. Neither member is exposed through a `TJSONInteger`-typed script expression because of the hidden-ancestor registration defect.

**External references**

- [RFC 8259 section 6: Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6)
- [Embarcadero `IntToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.IntToStr)
- [Embarcadero `StrToInt64`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToInt64)
- [Free Pascal `IntToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/inttostr.html) and [Free Pascal `StrToInt64`](https://www.freepascal.org/docs-html/rtl/sysutils/strtoint64.html) - compatible integer conversion context; Velox executes the traced Delphi implementation.

<small>Created 2026-07-20</small>
