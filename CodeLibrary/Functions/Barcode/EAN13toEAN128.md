---
title: "EAN13toEAN128"
description: "Builds Velox's legacy ReportBuilder-encoded GS1-128 string from a barcode and the numeric sum of two date arguments."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - barcode
  - gs1-128
  - reportbuilder
  - tdatetime
---

```Delphi
Function EAN13toEAN128( const aBarcode : string; aPackDate, aExpiryDate : TDateTime): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  ExpiryDate: TDateTime;
begin
  ExpiryDate := EncodeDate(2027, 6, 30);

  // Zero avoids changing ExpiryDate when the implementation adds both dates.
  Value := EAN13toEAN128('9412345543219', 0, ExpiryDate);
end;
```

### Usage

`EAN13toEAN128` builds Velox's legacy ReportBuilder-encoded GS1-128 string from a barcode and the numeric sum of two date arguments.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aBarcode` | `string`, `const` | Source barcode text. Velox `Trim` removes leading and trailing spaces and control characters, then only the first 12 characters are retained. No digit or length validation is performed. |
| `aPackDate` | `TDateTime` | First serial date/time value. Despite the name, no packaging-date application identifier is emitted; this number is added to `aExpiryDate`. |
| `aExpiryDate` | `TDateTime` | Second serial date/time value. The numeric sum of both date arguments is formatted for application identifier `17`. |

**Returns**

A string with this exact logical layout:

| Segment | Content |
|---|---|
| 1 | ReportBuilder `Char(210)` start-set-C control |
| 2 | ReportBuilder `Char(207)` FNC1 control |
| 3 | Literal application identifier `02` |
| 4 | Literal indicator digit `1` |
| 5 | First 12 characters of `Trim(aBarcode)` |
| 6 | Decimal result of `CheckSum` over segments 4 and 5 |
| 7 | Literal application identifier `17` |
| 8 | `YYMMDD` representation of `aPackDate + aExpiryDate` |

With a valid 12-character source body, segments 4 through 6 contain 14 digits. Shorter input produces a shorter field; longer input is silently truncated.

**Usage notes**

Treat this as a compatibility helper for existing reports, not as a general EAN-13-to-GS1-128 conversion. Confirm the business meaning of application identifiers `02` and `17`, correct the date-source decision outside the helper, and validate the final report with the applicable GS1 and trading-partner requirements.

### Additional Technical Info
`EAN13toEAN128` builds one legacy ReportBuilder manual-encoding string containing start set C, FNC1, GS1 application identifier `02`, a derived 14-digit content GTIN field, application identifier `17`, and a six-digit date. It does not produce image data or configure the receiving barcode component.

This function has counter-intuitive legacy behaviour: it adds `aPackDate` and `aExpiryDate` as two floating-point `TDateTime` serial values and formats the sum as the one date following application identifier `17`.

**Implementation**

Velox registers the function directly. The implementation calls Delphi `SysUtils.Trim`, then `System.Copy` from position `1` for `12` characters and prefixes the literal indicator `1`. It passes that result to Velox `CheckSum`, converts the returned integer with `SysUtils.IntToStr`, and concatenates the hard-coded ReportBuilder characters and application identifiers.

For the final segment it calls Velox `vxFormatDateTime('YYMMDD', aPackDate + aExpiryDate)`. That wrapper creates `TFormatSettings` from the Windows system default locale and delegates to the `SysUtils.DateTimeToString` overload that receives explicit format settings.

**Behaviour**

The initial string characters are U+00D2 (`Ò`) and U+00CF (`Ï`) in the current Delphi string representation. The shipped ReportBuilder Code 128 implementation interprets those values as its private start-C and FNC1 controls. They are not human-readable GS1 data and are not a general-purpose Code 128 byte sequence.

Application identifier `02` represents the GTIN of contained trade items and expects a 14-digit data field. Application identifier `17` represents an expiry date in `YYMMDD` form. The function assembles those labels but does not enforce their GS1 semantic prerequisites.

**Edge cases and quirks**

- `aPackDate + aExpiryDate` adds two dates' serial-day counts; it does not add an interval to a date or choose between two dates. For two ordinary modern dates the result is typically a date many decades later. The example uses `0` for `aPackDate` solely to leave the expiry serial unchanged, because Delphi `TDateTime(0)` is the numeric zero corresponding to 30 December 1899.
- The function emits no packaging-date field. The parameter name `aPackDate` does not describe a separate output segment.
- The original barcode's thirteenth digit is ignored along with every later character. The function recomputes a check digit after prefixing indicator `1`; it does not verify the input's existing EAN-13 check digit.
- Trimming affects only the two ends. Embedded spaces or other non-digits remain and cause `CheckSum` to raise when it converts them.
- A source shorter than 12 characters remains short. Empty or whitespace-only input forms the data value `1`, for which `CheckSum` returns `7`; the function still returns an assembled string.
- `YYMMDD` uses a two-digit year and contains no century. The fixed numeric format avoids names and separators, but the terminal formatter still receives Windows system-locale settings and a Delphi `TDateTime` value.
- A date sum outside the range accepted by the Delphi formatter raises; there is no range check before formatting.
- ReportBuilder automatic Code 128 encoding can remove and replace the explicit start control. To preserve manual set selection, the receiving report must use the compatible manual-encoding configuration.

**Side effects**

The function allocates and returns a string only. It does not modify the dates, configure ReportBuilder, create an image or access a printer or scanner.

**Errors**

An invalid character in the selected barcode text can propagate `EConvertError` from `CheckSum` and `StrToInt`. Date conversion or formatting exceptions propagate from the Delphi runtime. The function catches, logs and translates none of these failures.

**Performance and concurrency**

Work and allocations are linear in at most the first 12 trimmed barcode characters, apart from the runtime cost of trimming the full input and formatting the date. The function and its Velox helpers use local state. The explicit `TFormatSettings` instance avoids dependence on mutable global formatting variables during the terminal formatting call.

**Related entries**

- [`CheckSum`](CheckSum.md) calculates the data check digit inserted by this function.
- [`StartGS1128C`](StartGS1128C.md) returns the same ReportBuilder start-C and FNC1 prefix used here.

**External references**

- [GS1 Application Identifiers](https://ref.gs1.org/ai/?lang=en)
- [GS1 General Specifications, release 26.0](https://ref.gs1.org/standards/genspecs/26.0.0/)
- [ReportBuilder: Manual Encode 128](https://rbwiki.digital-metaphors.com/rcl/barcode/manual-encode-128/)
- [Free Pascal: `Trim`](https://www.freepascal.org/docs-html/rtl/sysutils/trim.html)
- [Free Pascal: `Copy`](https://www.freepascal.org/docs-html/rtl/system/copy.html)
- [Free Pascal: `IntToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/inttostr.html)
- [Free Pascal: `DateTimeToString`](https://www.freepascal.org/docs-html/rtl/sysutils/datetimetostring.html)
- [Free Pascal: `TDateTime`](https://www.freepascal.org/docs-html/rtl/system/tdatetime.html)
- [Embarcadero DocWiki: `System.SysUtils.Trim`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Trim)
- [Embarcadero DocWiki: `System.Copy`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Copy)
- [Embarcadero DocWiki: `System.SysUtils.IntToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.IntToStr)
- [Embarcadero DocWiki: `System.SysUtils.DateTimeToString`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.DateTimeToString)
- [Embarcadero DocWiki: `System.TDateTime`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TDateTime)

<small>Created 2026-07-15</small>
