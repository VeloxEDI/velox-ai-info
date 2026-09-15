---
title: Text
description: Gets edit-mode text or submits text through OnSetText/the concrete parser, so formatting, locale, callbacks and assignment side effects are field-specific.
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, text, edit-format, callback]
---

```Delphi
property Text: string read write;
```

### Example

```Delphi
procedure SetQuantityText(const Data: TvxClientDataSet; const Input: string);
begin
  Data.Edit;
  Data.FieldByName('Quantity').Text := Input;
end;
```

### Usage

Gets edit-mode text or submits text through OnSetText/the parser, so formatting, locale, callbacks and assignment side effects are field-specific.

- Prefer typed members for deterministic integration data.
- Use only governed, explicit formats if external text must be parsed through this property.
- Do not assume assigning text stores the supplied characters when `OnSetText` or a typed field is involved.

### Additional Technical Info
`Text` is the edit-oriented textual interface to a field. It is not necessarily identical to [`AsString`](AsString.md) or display-formatted [`DisplayText`](DisplayText.md).

#### Source-backed behaviour

The getter calls `OnGetText(Field, Text, False)` when assigned; otherwise it calls the concrete `GetText` with display mode false. Numeric descendants can choose an edit format rather than their display format. The setter calls `OnSetText` with a mutable copy when a handler exists and does not perform a second automatic assignment afterward—the handler is responsible for setting a value. Without a handler it calls virtual `SetText`, whose base delegates to `SetAsString`.

Concrete parsing can clear on empty text, strip configured thousand separators, use current locale date/number rules, round/range-check, or reject invalid input. A successful assignment follows normal edit-state, validation, provider and change-event handling. Callback code runs synchronously and can modify other state or raise exceptions.

#### Official RTL references

- [Embarcadero: TField.Text](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.Text)
- [Free Pascal: TField.Text](https://www.freepascal.org/docs-html/current/fcl/db/tfield.text.html)

<small>Created 2026-07-15</small>
