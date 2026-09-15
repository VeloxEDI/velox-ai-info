---
title: "vxFormatDateTime"
description: "Formats a TDateTime with Delphi tokens using a fresh Windows system-locale settings snapshot."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - format
  - date
  - time
  - locale
  - delphi
---

```Delphi
Function vxFormatDateTime(const Format: string; DateTime: TDateTime): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 19, 14, 30, 45, 125);
  Value := vxFormatDateTime('yyyy-mm-dd hh":"nn":"ss"."zzz', InputValue);
  // 2026-07-19 14:30:45.125
end;
```

### Usage

`vxFormatDateTime` formats a TDateTime with Velox tokens using a fresh Windows system-locale settings snapshot.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Format` | `string`, `const` | Velox date/time pattern. Tokens are case-insensitive; quote literal text where it could be interpreted as a token. |
| `DateTime` | `TDateTime` | Velox serial date/time. The integer part represents a date relative to 1899-12-30 and the fractional magnitude represents time. |

**Returns**

The formatted string. Names, AM/PM text and unquoted separator tokens can depend on the host's Windows system-default locale.

**Common tokens**

| Token | Output |
|---|---|
| `d`, `dd`, `ddd`, `dddd` | Day number, padded day, abbreviated day name or full day name. |
| `m`, `mm`, `mmm`, `mmmm` | Month number/padded number/abbreviated name/full name, except the minute context below. |
| `yy`, `yyyy` | Two- or four-digit year. |
| `h`, `hh` | Hour. Presence of AM/PM tokens selects 12-hour presentation. |
| `n`, `nn` | Minute. |
| `s`, `ss` | Second. |
| `z`, `zz`, `zzz` | Milliseconds with increasing zero padding. |
| `am/pm`, `a/p`, `ampm` | Locale-aware 12-hour marker forms. |
| `/`, `:` | Locale date/time separator placeholders unless quoted. |
| `c`, `ddddd`, `dddddd`, `t`, `tt` | Composite locale-driven date/time forms. |

`m` or `mm` immediately after an hour token is interpreted as minutes. Prefer `n`/`nn` for clarity.

**Usage notes**

For integration output, use numeric fields and quote punctuation that must be literal. Decide the timezone meaning before formatting and record it separately when the target requires one.

### Additional Technical Info
`vxFormatDateTime` converts a Delphi `TDateTime` to text using Delphi date/time tokens and a fresh snapshot of the Windows system-default locale. It formats the fields already encoded in the number; it does not perform timezone conversion.

The example quotes separator characters inside the Delphi pattern, so the shown numeric result does not depend on locale date/time separator characters. It is fictional, source-reviewed and was not executed by the documentation workflow.

**Implementation**

The formats import points directly to `vxFormats.vxFormatDateTime`. The function creates `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and calls the explicit-settings `System.SysUtils.DateTimeToString` terminal. It intentionally bypasses the global-settings `SysUtils.FormatDateTime` overload.

The public `FormatDateTime` registration in the same import calls this function, and `SQLDateTime`/`SQLDateTimeString` use it with a fixed legacy mask.

**Literal and locale behavior**

- Text inside single or double pattern quotes is emitted literally.
- Unquoted `/` and `:` are replaced with captured locale separators.
- Month/day names and AM/PM strings come from the captured system-default settings.
- Fully numeric tokens do not make output invariant if the pattern still contains unquoted locale separator placeholders.

**Edge cases and quirks**

- `TDateTime` does not store a timezone or UTC/local marker. This function cannot infer or change one.
- The wrapper uses `LOCALE_SYSTEM_DEFAULT`, not the interactive user's locale, a source file culture or a map option.
- Delphi's parser is permissive: unknown characters are generally copied, and an unmatched quote treats the remainder as literal text rather than acting as strict validation.
- An empty pattern follows Delphi's composite `c` behavior rather than always returning an empty string.
- Era tokens (`g`/`gg` and `e`/`ee`) take a specialised Windows path that consults the current thread locale. That can diverge from the wrapper's otherwise system-default settings snapshot.
- Free Pascal documents stricter invalid-character behavior and extra option overloads. Those contracts are not exposed by this Velox declaration.
- Very large/invalid raw serial values can fail during field decoding. Normal script-produced `TDateTime` values stay within Delphi's supported calendar range.

**Side effects**

Reads host locale information and allocates text. It does not mutate the input or global format settings.

**Errors**

Velox catches nothing. Invalid date serials, specialised operating-system locale failures and allocation/runtime failures can propagate. Do not use a successful call as evidence that a dynamic pattern was semantically intended; Delphi accepts many literal characters.

**Performance and concurrency**

Each call creates a format-settings record, decodes fields as demanded by the pattern and allocates the result. Ordinary tokens use the local settings record and avoid races on mutable global `FormatSettings`; specialised era handling still depends on thread/OS locale services.

**Related entries**

- [`FormatDateTime`](FormatDateTime.md) exposes the same effective formatter and is also documented at its canonical Date & Time path.
- [`SQLDateTime`](SQLDateTime.md) uses this function but leaves the time-separator colon unquoted.
- [`SQLDateTimeString`](SQLDateTimeString.md) adds a zero-to-`NULL` branch and SQL quotes.
- [`EncodeDateTime`](../DateTime/EncodeDateTime.md) constructs a checked value from individual fields.

**External references**

- [Embarcadero `System.SysUtils.FormatDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FormatDateTime)
- [Free Pascal `FormatDateTime`](https://www.freepascal.org/docs-html/rtl/sysutils/formatdatetime.html) - compatibility reference; its extra options and failure rules are not Velox behavior.

<small>Created 2026-07-15</small>
