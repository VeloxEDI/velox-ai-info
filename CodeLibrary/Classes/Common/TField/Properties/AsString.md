---
title: AsString
description: Reads or writes the concrete field's unformatted string conversion, with null, encoding, precision and accepted-input rules controlled by its descendant class.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, string, conversion, 'null']
---

```Delphi
property AsString: string read write;
```

### Example

```Delphi
procedure NormalizeCode(const Data: TvxClientDataSet);
begin
  Data.Edit;
  Data.FieldByName('Code').AsString :=
    UpperCase(Trim(Data.FieldByName('Code').AsString));
end;
```

### Usage

`AsString` reads or writes the field's unformatted string conversion, with null, encoding, precision and accepted-input rules controlled by its field class.

- Use this member for data transfer only when the field's type-specific string contract is acceptable.
- Do not use formatted display text for round-trip values.
- Treat blob/binary data as bytes or streams; string conversion can be encoding-sensitive and may contain null characters.

### Additional Technical Info
`AsString` is the concrete field's value conversion to or from a Delphi Unicode string. It is a data conversion path, not necessarily the text a user sees.

#### Source-backed behaviour

Base `TField.GetAsString` returns a parenthesised field-class description and uppercases it when the field is non-null; base assignment raises. Real dataset fields override this behaviour. String fields return their stored text, numeric/date fields produce an unformatted conversion, and blob descendants can treat bytes as string data. A null field commonly returns `''`, so empty string and null collapse unless [`IsNull`](IsNull.md) is checked separately.

Assignment is descendant-specific: empty text often clears numeric/date fields, string fields store empty text as a value subject to size, and parsing of numeric/date text can use current locale settings. The write also requires edit/insert state and invokes validation/provider checks. [`DisplayText`](DisplayText.md) may apply display formats or `OnGetText`; [`Text`](Text.md) uses edit formatting and `OnSetText`.

#### Official RTL references

- [Embarcadero: TField.AsString](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.AsString)
- [Free Pascal: TField.AsString](https://www.freepascal.org/docs-html/current/fcl/db/tfield.asstring.html)

<small>Created 2026-07-15</small>
