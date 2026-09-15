---
title: AsSQLTrim
description: Quotes trimmed formatted field text but retains AsSQL's lossy, unvalidated setter and adds post-decoding trimming.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, sql, quote, trim, lossy, security]
---

```Delphi
property AsSQLTrim: string read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Getter only: this is SQL-shaped display text, not a parameter. }
  Value := Field.AsSQLTrim;
end;
```

### Usage

`AsSQLTrim` quotes trimmed formatted field text but retains AsSQL's lossy, unvalidated setter and adds post-decoding trimming.

**Lossy setter defect**

Like `AsSQL`, the setter starts with `Copy(Value, 2, Length(Value)-3)`. A correct-looking `'abc'` therefore decodes as `ab`, losing the final data character. It then converts doubled apostrophes to singles, applies `Trim` to the already-truncated text and assigns `AsString`.

No surrounding-quote validation occurs. Whitespace significant to the business value is also removed. Do not assign this property or use it as a round-trip encoding.

Assignment follows the field's edit, conversion, range and validation rules, changes the active record and can raise an error. It does not post or commit.

### Additional Technical Info
`AsSQLTrim` is the trimmed-display-text variant of [`AsSQL`](AsSQL.md).

The getter applies Delphi `Trim` to `DisplayText`, removes NUL characters, doubles embedded apostrophes and wraps the result in single quotes. Leading/trailing characters at or below U+0020 are removed before quoting. Null/blank text becomes `''`, not SQL `NULL`; numeric/date/Boolean display text is still quoted as a string.

Display formatting and `OnGetText` can influence the result. This is not raw field serialization and not parameter binding. Prefer parameters for database commands.

**External references**

- [Embarcadero DocWiki: `TField.DisplayText`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.DisplayText) documents the formatted source.
- [Embarcadero DocWiki: `Trim`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Trim) documents the Delphi trimming operation.
- [Free Pascal: `TStringHelper.Trim`](https://www.freepascal.org/docs-html/rtl/sysutils/tstringhelper.trim.html) provides compatible trim context; quoting and the setter defect are Velox-specific.

<small>Created 2026-07-15</small>
