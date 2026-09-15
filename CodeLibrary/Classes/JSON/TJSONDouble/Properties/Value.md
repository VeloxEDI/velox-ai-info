---
title: Value
description: Reads or replaces the retained Double payload without enforcing JSON range, finiteness or text-format rules.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, double, value, precision]
---

```Delphi
property Value: Double read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Number: TJSONDouble;
begin
  Number := TJSONDouble.Create;  // Compiler resolves TObject.Create; see below.
  try
    Number.Value := 1234.5;
    Value := Number.Value;
  finally
    Number.Free;
  end;
end;
```

### Usage

`Value` reads or replaces the retained Double payload without enforcing JSON range, finiteness or text-format rules.

### Additional Technical Info
`Value` exposes the native binary64 field held by [`TJSONDouble`](../../TJSONDouble.md). Newly allocated storage reads `0.0`. Assignment stores the supplied `Double` unchanged and internally clears the native null flag; zero is an ordinary number, not a null sentinel.

The importer's hidden-ancestor defect means a `TJSONDouble`-typed script variable does not expose [`IsNull`](../../TJSONValue/Properties/IsNull.md), `AsString` or other `TJSONValue` members. Its inherited `Create` is PascalScript's `TObject.Create` and skips the JSON value-type initializer. The example is therefore valid for reading/writing the registered field, but that directly created instance must not be treated as a correctly initialized serializable JSON node. Helper- and parser-created instances run the native constructor and are the supported tree values.

No JSON validation occurs on assignment. NaN, positive infinity and negative infinity can be stored even though RFC 8259 does not permit them. The property also does not round to a decimal representation; loss or locale effects occur later when native `AsString` or a parent serializer calls `FloatToStr` with global format settings and 15 significant digits.

Reading `Value` bypasses native null state. If native code or a base-typed reference marks a correctly constructed node null, this property still returns the previous payload while conversion properties return their null defaults or blank text. Check null state on the base `TJSONValue` reference before applying a validated class view.

For portable JSON, reject non-finite values and validate the eventual serialized text under a dot-decimal locale or at an invariant boundary. A parent-owned node is borrowed; assigning this property does not change ownership or lifetime.

**External references**

- [RFC 8259 section 6: Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6)
- [Embarcadero `FloatToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.FloatToStr)
- [Free Pascal `FloatToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/floattostr.html) - compatible formatting context.

<small>Created 2026-07-20</small>
