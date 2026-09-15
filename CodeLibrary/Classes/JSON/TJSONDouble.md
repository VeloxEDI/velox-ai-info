---
title: TJSONDouble
description: Represents a mutable binary64 JSON number whose text conversion is locale-sensitive and limited to 15 significant digits.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, double, number, locale]
---

```Delphi
TJSONDouble = class(TJSONNumber)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Document.AddDouble('amount', 12.5);
    Value := Document.AsString;  // Formatting uses process settings.
  finally
    Document.Free;
  end;
end;
```

### Usage

`TJSONDouble` represents a mutable binary64 JSON number whose text conversion is locale-sensitive and limited to 15 significant digits.

### Additional Technical Info
The native `TJSONDouble` class stores a Delphi `Double`; correctly constructed helper/parser nodes have `ValueType = jsNumber`. Its native `TJSONNumber` ancestor descends from `TJSONValue`, is hidden and adds no fields or methods.

The PascalScript compiler registration does **not** reproduce that native inheritance: it registers hidden `TJSONNumber` directly beneath `TObject`, then registers `TJSONDouble` beneath it. A `TJSONDouble`-typed script expression consequently exposes only [`Value`](TJSONDouble/Properties/Value.md) and the `TObject` surface. It cannot call `TJSONValue` members such as `AsString`, `IsNull`, `Clear`, `CopyFrom` or `IsEqual`, and it is not compile-time assignable to `TJSONValue`.

This also changes direct construction. `TJSONDouble.Create` resolves through PascalScript's `TObject.Create`, not the registered virtual [`TJSONValue.Create`](TJSONValue/Methods/Create.md), so it allocates the native object without running the JSON value-type initializer. Its `Value` field works, but do not treat that directly constructed instance as a correctly initialized JSON node or attempt to insert it into a tree. Prefer native helper/parser construction, as in the example. A helper-created node is owned by its parent.

#### Conversion contract

When native JSON code serializes a correctly initialized node—or when it is accessed through a base-typed `TJSONValue` reference—`AsString` calls Delphi `FloatToStr` with the process `FormatSettings`. In the installed Studio 37 implementation this uses general formatting with 15 significant digits. It does not use a JSON-invariant decimal point, so a decimal-comma locale can emit text such as `12,5`; when inserted unquoted into an object or array, that is not the intended JSON number and can change the apparent structure.

Native/base-typed `AsString` assignment calls locale-sensitive `StrToFloat`, then stores the result as a `Double`. Surrounding blanks may be accepted by the Delphi converter, exponent notation is accepted and invalid text raises `EConvertError`. Because the override clears null state before conversion, a failed assignment leaves the prior numeric payload but makes the node non-null. This member is not exposed through a `TJSONDouble`-typed script variable because of the compiler hierarchy defect.

This differs from the Deltics JSON reader: the reader chooses `TJSONDouble` only when the source token contains a period. An exponent-only token such as `1e3` is routed to `TJSONInteger` and then fails, even though direct `TJSONDouble.AsString := '1e3'` is convertible.

`Double` can represent NaN and infinities, and `Value` does not reject them. RFC 8259 does not permit those values as JSON numbers. General formatting can also lose low-order binary64 precision because it is limited to 15 significant digits. Treat generated text as an interoperability boundary, not a lossless round trip.

#### Null and base-typed behavior

Native [`Clear`](TJSONValue/Methods/Clear.md), or a call through a `TJSONValue`-typed reference, marks a correctly initialized node null but retains the stored `Double`; reading `Value` through a valid class view still returns it. Objects serialize that state as `null`. Arrays instead receive blank `AsString` for the `jsNumber` node, creating an empty token or collapsing a one-item array to `[]`.

When the instance is reached through a `TJSONValue` reference, that type's script `NotNull` property remains incorrectly wired to `IsNull`. Native `TJSONDouble.CopyFrom` assumes another exact `TJSONDouble` without a runtime guard, and native `IsEqual` compares formatted `AsString`; neither member is available through a `TJSONDouble`-typed script expression. Values that format identically at 15 digits can therefore compare equal through the base API even when their stored binary64 payloads differ.

**External references**

- [RFC 8259 section 6: Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6)
- [Embarcadero `FloatToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.FloatToStr)
- [Embarcadero `StrToFloat`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToFloat)
- [Free Pascal `FloatToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/floattostr.html) and [Free Pascal `StrToFloat`](https://www.freepascal.org/docs-html/rtl/sysutils/strtofloat.html) - compatible conversion and locale context; Velox executes the traced Delphi implementation.

<small>Created 2026-07-20</small>
