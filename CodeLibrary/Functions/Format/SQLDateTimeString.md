---
title: "SQLDateTimeString"
description: "Returns NULL for zero or a quoted millisecond Microsoft SQL date/time literal for another TDateTime."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sql
  - datetime
  - 'null'
  - microsoft-sql-server
  - locale
---

```Delphi
Function SQLDateTimeString(const ADate: TDateTime): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 19, 14, 30, 45, 125);
  Value := SQLDateTimeString(InputValue);
  // Usually '2026-07-19 14:30:45.125', including the two single quotes.
end;
```

### Usage

`SQLDateTimeString` returns NULL for zero or a quoted millisecond Microsoft SQL date/time literal for another TDateTime.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ADate` | `TDateTime`, `const` | Date/time serial. Exact numeric zero is treated as SQL null rather than Velox's epoch date. |

**Returns**

- `NULL` (uppercase, with no quotes) when `ADate = 0`.
- Otherwise, formatted date/time text surrounded by one single quote at each end, typically `'2026-07-19 14:30:45.125'`.

**Errors**

The zero branch cannot raise a formatting error. The nonzero branch can propagate date decoding, locale, allocation or runtime exceptions. A database can later reject a syntactically generated literal for its own range, type, language or conversion reasons.

**Usage notes**

Use typed parameters for new SQL work. When maintaining legacy text SQL, preserve the exact `NULL` versus quoted-value contract and confirm the target accepts the host-locale time separator.

### Additional Technical Info
`SQLDateTimeString` creates legacy Microsoft SQL expression text from a Delphi `TDateTime`. Zero returns the SQL keyword `NULL`; any nonzero value is formatted with `YYYY-MM-DD HH:NN:SS.ZZZ` and surrounded by ASCII single quotes.

It is registered as the script-facing name for `vxSQLFormat.MSSQLDateTimeString`. The result is intended for text SQL construction, but a typed database parameter is normally safer and preserves null/type information without parsing a generated string.

The example is fictional, source-reviewed and was not executed against a product runtime or database.

**Implementation**

The import binds `SQLDateTimeString` to `MSSQLDateTimeString`. Native source implements exactly two branches:

```Delphi
if ADate = 0 then
  Result := 'NULL'
else
  Result := vxFormat('''%s''',
    [vxFormatDateTime('YYYY-MM-DD HH:NN:SS.ZZZ', ADate)]);
```

The inner date formatter captures `LOCALE_SYSTEM_DEFAULT`; the outer `vxFormat` call uses another fresh system-default settings record, although `%s` itself only inserts the already formatted text. There is no database call, connection lookup or SQL dialect selection.

**Output details**

- Year, month, day, hour, minute, second and millisecond fields are zero-padded by the Delphi tokens.
- Hyphens, space and period are literal.
- Unquoted `:` tokens are replaced by the Windows system-default **time separator**, so the inner text is not fully locale-invariant.
- The quotes are literal ASCII apostrophes added by the outer format call.
- The date/time contains no timezone suffix or offset.

**Zero sentinel**

The helper uses exact floating comparison `ADate = 0` as a sentinel. That makes it impossible to represent the valid Delphi epoch instant 1899-12-30 00:00:00 through this function: it becomes SQL `NULL`. A tiny nonzero time fraction or any other date uses the quoted branch.

[`SQLDateTime`](SQLDateTime.md) does not share this sentinel rule and formats zero as the epoch. Choose between the functions deliberately.

**Edge cases and quirks**

- The returned `NULL` is SQL syntax, not an empty string, Delphi null, variant null or quoted `'NULL'` text.
- Nonzero output is a complete SQL string literal fragment. Adding another layer of quotes produces incorrect SQL.
- The function is named for Microsoft SQL and hardcodes one legacy shape; it does not validate the target column type, range or fractional precision.
- Locale-specific time separators can make the literal dependent on server parsing rules.
- It does not convert UTC/local time, append a timezone or know the semantic timezone of `ADate`.
- This helper is safe from user-text quote injection only because its input is numeric `TDateTime` and the generated inner fields contain no user-supplied string. That does not make general SQL interpolation safe.
- SQL expression construction still loses the explicit type information and execution-plan benefits of a parameter.

**Side effects**

None beyond locale reads and string allocation. No SQL is executed.

**Performance and concurrency**

Zero returns a constant immediately. Nonzero calls two locale-explicit wrappers and allocates the inner and quoted strings. Their settings records are local, so they do not race on Delphi's mutable global `FormatSettings`.

**Related entries**

- [`SQLDateTime`](SQLDateTime.md) always returns unquoted text and formats zero as 1899-12-30.
- [`vxFormatDateTime`](vxFormatDateTime.md) supplies the inner field formatting.
- [`vxFormat`](vxFormat.md) supplies the outer single-quote template.
- [`EncodeDateTime`](../DateTime/EncodeDateTime.md) constructs a checked value for the nonzero branch.

**External references**

The SQL-null/quoting wrapper is Velox-specific. These references document the Delphi format terminal:

- [Embarcadero `System.SysUtils.FormatDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FormatDateTime)
- [Free Pascal `FormatDateTime`](https://www.freepascal.org/docs-html/rtl/sysutils/formatdatetime.html) - compatibility reference only.

<small>Created 2026-07-15</small>
