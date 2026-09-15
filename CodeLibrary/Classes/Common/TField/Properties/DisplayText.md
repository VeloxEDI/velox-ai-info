---
title: DisplayText
description: Produces the field's display-formatted text by invoking OnGetText in display mode or the concrete field's display conversion.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, displaytext, formatting, callback]
---

```Delphi
property DisplayText: string read;
```

### Example

```Delphi
function PrintableAmount(const Data: TvxClientDataSet): string;
begin
  Result := Data.FieldByName('Amount').DisplayText;
end;
```

### Usage

`DisplayText` produces the field's display-formatted text by invoking OnGetText in display mode or the field's display conversion.

- Use typed `As...` or `Value` members for machine-to-machine transfer.
- Use this property for logs/reports only when configured formatting is intended.
- Do not parse the result back as a canonical value without an explicit matching format and locale contract.

### Additional Technical Info
`DisplayText` returns presentation text for the current value. It can differ from [`AsString`](AsString.md) and [`Text`](Text.md).

#### Source-backed behaviour

`TField.GetDisplayText` starts with an empty string. If `OnGetText` is assigned, it calls that handler with `DisplayText=True` and returns the text supplied by the callback. Otherwise it calls the concrete field's virtual `GetText` in display mode. Numeric/date descendants can apply their display format; the base implementation falls back to `GetAsString`.

The read is therefore not guaranteed to be a simple or side-effect-free buffer lookup: application code in `OnGetText` runs synchronously and its exception propagates. Formatting can be locale-dependent and lossy. A null field commonly produces an empty string, but the callback can choose another representation. Velox uses `DisplayText` in several serialization/helper paths, including SQL-safe helper text and non-string JSON output, so a configured display format can affect those representations.

#### Official RTL references

- [Embarcadero: TField.DisplayText](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.DisplayText)
- [Free Pascal: TField.DisplayText](https://www.freepascal.org/docs-html/current/fcl/db/tfield.displaytext.html)

<small>Created 2026-07-15</small>
