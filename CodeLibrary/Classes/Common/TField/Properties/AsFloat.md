---
title: AsFloat
description: Reads or writes a concrete numeric-compatible field as an IEEE Double, subject to descendant rounding, scale, range and text-conversion rules.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, double, numeric, conversion]
---

```Delphi
property AsFloat: Double read write;
```

### Example

```Delphi
function GrossWeight(const Data: TvxClientDataSet): Double;
begin
  Result := Data.FieldByName('NetWeight').AsFloat +
    Data.FieldByName('PackagingWeight').AsFloat;
end;
```

### Usage

`AsFloat` reads or writes a numeric-compatible field as an IEEE Double, subject to field rounding, scale, range and text-conversion rules.

- Use [`AsCurrency`](AsCurrency.md) or a BCD-aware path when exact decimal scale is a business requirement.
- Check finite/range expectations before assigning calculated values.
- Do not rely on machine/locale-dependent string parsing; parse governed external text explicitly before assignment.

### Additional Technical Info
`AsFloat` asks the runtime field descendant to represent its value as a Delphi `Double` or to accept a `Double` assignment.

#### Source-backed behaviour

Base `TField` raises a field-access error. Numeric descendants implement the conversion; integer fields return their integer value as `Double` and round a `Double` assignment before range checking, while string fields parse using Delphi numeric conversion and current format settings. Currency/BCD descendants can apply their own scale rules. These paths mean the same script assignment can round, overflow or fail differently according to the runtime field class.

A null compatible numeric field normally reads `0.0`; use [`IsNull`](IsNull.md) to retain null semantics. IEEE `Double` cannot exactly represent every decimal database value or every 64-bit integer. Assignment goes through dataset write-state, read-only, `OnValidate`, provider verification and change-event handling.

#### Official RTL references

- [Embarcadero: TField.AsFloat](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.AsFloat)
- [Free Pascal: TField.AsFloat](https://www.freepascal.org/docs-html/current/fcl/db/tfield.asfloat.html)

<small>Created 2026-07-15</small>
