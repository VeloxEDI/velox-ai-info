---
title: "FormatDateTime"
description: "Formats a TDateTime with Delphi format tokens using a fresh snapshot of the Windows system-default locale."
sidebar_position: 45
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - formatting
  - locale
  - delphi
---

```Delphi
function FormatDateTime(const fmt: string; D: TDateTime): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 14, 30, 45, 125);
  Value := FormatDateTime('yyyy-mm-dd hh":"nn":"ss"."zzz', InputValue);
  // '2026-07-18 14:30:45.125'
end;
```

### Usage

`FormatDateTime` formats a TDateTime with Velox format tokens using a fresh snapshot of the Windows system-default locale.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `fmt` | `string`, `const` | Velox date/time format pattern. Common tokens include `yyyy`, `mm`, `dd`, `hh`, `nn`, `ss` and `zzz`; quote literal text where it could be read as a token. |
| `D` | `TDateTime` | Encoded date/time to format. No timezone conversion is performed. |

**Returns**

The formatted string. Its exact result can depend on the format pattern, the encoded fields and the Windows system locale active on the Velox host.

**Behaviour**

- Numeric tokens produce the corresponding calendar or clock fields; repeated token letters generally control width.
- `n`/`nn` mean minutes. `m`/`mm` normally mean month, but Velox interprets them as minutes when they immediately follow an hour token.
- `/` and `:` in a pattern are locale placeholders for the locale's date and time separators. Enclose either character in single or double format quotes when it must be emitted literally.
- Textual day/month names and AM/PM strings come from the captured system-default locale.

**Errors**

Velox does not catch formatter failures. The Velox parser is not a strict format validator, so malformed or unintended patterns can produce text without raising. Unsupported raw date values, operating-system locale failures and normal allocation/runtime failures can still propagate from the RTL.

**Usage notes**

Use fully numeric patterns with quoted or literal separators for integration output that must be stable across hosts. Use locale-sensitive tokens only when presentation should deliberately follow the server's Windows system locale.

### Additional Technical Info
`FormatDateTime` converts a `TDateTime` to text using Delphi date/time format tokens. The effective Velox registration is a Velox wrapper that takes a fresh snapshot of the Windows **system-default** locale for each call. It does not use the earlier direct global-`FormatSettings` registration with the same public name.

The example deliberately uses numeric fields and literal separators, so its output is independent of month/day names and locale separator characters. It is fictional, deterministic and source-reviewed; it was not executed by the documentation workflow.

**Implementation**

Velox registers this name twice. The base PascalScript date library first exposes the direct `System.SysUtils.FormatDateTime` overload. Later, the formats import registers the same compile-time signature and runtime name. The modified PascalScript compiler permits duplicates and searches registered procedures from newest to oldest; the runtime import table uses the same reverse search. The later formats entry therefore wins at both stages.

That effective entry calls `vxFormats.FormatDateTime`, then `vxFormatDateTime`. The wrapper creates a local `TFormatSettings` with `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and calls Delphi `DateTimeToString` with that record. This makes the locale choice explicit and avoids reading the mutable global `FormatSettings` record used by the earlier registration.

**Edge cases and quirks**

- Output can differ between Velox hosts whose Windows system locales differ. It can also change after the host's system-default locale changes.
- The wrapper captures `LOCALE_SYSTEM_DEFAULT`, not a per-map locale, source-data locale or timezone.
- `FormatDateTime` formats the fields already present in `D`; it does not convert between UTC and local time and cannot tell which interpretation the value carries.
- The earlier direct registration remains in source but is shadowed by the later wrapper. The separate unindexed generated page under the Format group is a known generator anomaly; this Date & Time page is the indexed public entry.
- Delphi's formatter is permissive: an unrecognised character is generally copied to the result, and an unmatched quote consumes the rest of the pattern as literal text. Free Pascal documents an `EConvertError` for an invalid format character, so its failure contract must not be applied to Velox.
- On Windows, Delphi's era tokens (`g`/`gg` and `e`/`ee`) call operating-system era formatting through the current thread locale. That specialised path can therefore have a different locale dependency from the wrapper's system-default `TFormatSettings` snapshot.
- Free Pascal documents additional `Options` arguments and has its own localisation rules. Those overloads are not exposed by this Velox declaration.
- Millisecond output is limited to the resolution represented by `TDateTime`/Delphi's formatting path.

**Side effects**

The function reads the host's system-default locale. It does not modify the input or global format settings.

**Performance and concurrency**

Each call constructs a `TFormatSettings` record and allocates the result string. The record is local, so concurrent calls do not race on Delphi's mutable global `FormatSettings`; however, they still depend on the process-visible operating-system locale.

**Related entries**

- [`DateToStr`](DateToStr.md) uses the host's default short-date formatting rather than an explicit pattern.
- [`EncodeDateTime`](EncodeDateTime.md) constructs the value used by the example.

**External references**

- [Embarcadero `System.SysUtils.FormatDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FormatDateTime) - documents the Delphi format language and overload family beneath the Velox wrapper.
- [Free Pascal `FormatDateTime`](https://www.freepascal.org/docs-html/rtl/sysutils/formatdatetime.html) - compatibility reference; Free Pascal exposes options not present in Velox.

<small>Created 2026-07-15</small>
