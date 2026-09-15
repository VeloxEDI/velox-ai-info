---
title: "FormatDateTime"
description: "Formats a TDateTime with Delphi tokens and a fresh system-locale snapshot from an orphaned generated path."
sidebar_position: 2
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
  - generator-anomaly
---

```Delphi
Function FormatDateTime(const Format: string; DateTime: TDateTime): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 19, 14, 30, 45, 125);
  Value := FormatDateTime('yyyy-mm-dd hh":"nn":"ss"."zzz', InputValue);
  // 2026-07-19 14:30:45.125
end;
```

### Usage

Use `FormatDateTime` when a script needs to turn a `TDateTime` into display, filename, log or message text using Velox date/time pattern tokens. Quote literal separators when the output must be stable across machines; for example, `yyyy-mm-dd hh":"nn":"ss"` keeps the colon characters literal instead of using locale-specific separators.

The function formats the value exactly as supplied and does not convert between local time and UTC. Establish the intended time basis before formatting, especially for data exchanged with another system, and use an explicit interchange format when a timezone or offset is required.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Format` | `string`, `const` | Velox pattern containing date/time tokens, literal characters and optional locale separator placeholders. |
| `DateTime` | `TDateTime` | Serial date/time to format. It carries no timezone metadata. |

**Returns**

Formatted text. Exact names, AM/PM text and unquoted `/` or `:` separators can vary with the Velox host's Windows system-default locale.

### Additional Technical Info

`FormatDateTime` formats a `TDateTime` with Delphi date/time tokens. The effective script symbol is the later Velox formats registration, which delegates to [`vxFormatDateTime`](vxFormatDateTime.md) and captures Windows system-default locale settings for each call.

This physical page is a known generator/index anomaly. `_Index.json` assigns `FormatDateTime` to the already approved [canonical Date & Time page](../DateTime/FormatDateTime.md), but the generator also left this unindexed Format-group page. Both pages describe the same callable; there is not a second Format-group overload. Keeping this page documented makes the Docusaurus route truthful without changing `_Index.json`.

The example is fictional, uses quoted literal punctuation, is source-reviewed and was not executed by the documentation workflow

**Effective registration**

Velox registers `FormatDateTime` twice. The base modified PascalScript date library first exposes the direct `System.SysUtils.FormatDateTime` name. Later, `uPSI_vxFormats` registers the same compile-time signature and runtime name to `vxFormats.FormatDateTime`.

The modified compiler permits duplicate registrations and searches procedures newest-to-oldest; runtime lookup uses the same reverse order. The later formats registration wins at compile and runtime. Its wrapper calls `vxFormatDateTime`, which constructs `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and invokes Delphi `DateTimeToString` with that local record. The earlier global-settings terminal is therefore shadowed for this public symbol.

**Pattern behavior**

- `yyyy`, `mm` and `dd` produce numeric year, month and day.
- `ddd`/`dddd` and `mmm`/`mmmm` produce locale day/month names.
- `hh`, `nn`, `ss` and `zzz` produce hour, minute, second and milliseconds.
- `m`/`mm` immediately after an hour token means minutes; elsewhere it means month. `n`/`nn` is unambiguous.
- `am/pm`, `a/p` or `ampm` selects 12-hour output and locale marker text.
- Unquoted `/` and `:` are locale placeholders. Quote them when a literal separator is required.
- An empty pattern uses Delphi's composite `c` representation.

**Edge cases and quirks**

- No UTC/local conversion is performed. Identical serial values format identically regardless of the business meaning assigned to them.
- Locale is the machine system default, not necessarily the logged-in account's regional configuration.
- Delphi generally copies unrecognised pattern characters and treats the remainder after an unmatched quote as literal text. The formatter is not a strict pattern validator.
- Windows era tokens use current-thread-locale operating-system calls, a specialised dependency that can differ from the local `TFormatSettings` record.
- The generated route is unindexed and should not be treated as another public overload, registration or ownership source.
- Free Pascal documents extra option overloads and a stricter invalid-character error. Those differences are compatibility context only.

**Side effects**

Locale reads and result allocation only. No global settings or input value are changed.

**Errors**

Velox does not catch date decode, operating-system locale, allocation or runtime failures. Permissive pattern parsing means many malformed-looking masks produce literal output rather than an exception.

**Performance and concurrency**

The effective wrapper creates a local settings record per call, avoiding ordinary access to mutable global `FormatSettings`. Result construction is proportional to pattern/output length.

**Remarks**

Use the canonical Date & Time page as the index-backed reference. This page exists so direct Docusaurus access to the orphaned generated route does not expose a blank help file.

**Related entries**

- [Canonical indexed `FormatDateTime`](../DateTime/FormatDateTime.md) documents the same symbol.
- [`vxFormatDateTime`](vxFormatDateTime.md) is the underlying Velox wrapper.
- [`SQLDateTime`](SQLDateTime.md) applies the wrapper with a fixed legacy SQL mask.

**External references**

- [Embarcadero `System.SysUtils.FormatDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FormatDateTime)
- [Free Pascal `FormatDateTime`](https://www.freepascal.org/docs-html/rtl/sysutils/formatdatetime.html) - qualified compatibility reference.

<small>Created 2026-07-15</small>
