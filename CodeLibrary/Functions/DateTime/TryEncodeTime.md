---
title: "TryEncodeTime"
description: "Tries to encode hour, minute, second and millisecond fields as a time-of-day fraction."
sidebar_position: 152
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - time
  - encoding
  - validation
  - milliseconds
---

```Delphi
function TryEncodeTime(Hour, Min, Sec, MSec: Word;
  var Time: TDateTime): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  EncodedTime: TDateTime;
begin
  if TryEncodeTime(14, 30, 45, 125, EncodedTime) then
    Value := EncodedTime;
end;
```

### Usage

`TryEncodeTime` tries to encode hour, minute, second and millisecond fields as a time-of-day fraction.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Hour` | `Word` | Hour `0..23`. |
| `Min` | `Word` | Minute `0..59`. |
| `Sec` | `Word` | Second `0..59`; leap-second value 60 is invalid. |
| `MSec` | `Word` | Millisecond `0..999`. |
| `Time` | `TDateTime`, `var` | Receives the encoded fraction on success. |

**Errors**

Any error encountered while encoding returns `False` instead of being raised to the script.

### Additional Technical Info
`TryEncodeTime` exposes a Velox/PascalScript adapter that attempts to encode four clock fields as a time-only `TDateTime` fraction. It catches encoding exceptions and returns a Boolean result.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Returns**

`True` when `System.SysUtils.EncodeTime` succeeds; otherwise `False`.

**Implementation**

The modified PascalScript runtime registers its own adapter rather than binding `System.SysUtils.TryEncodeTime` directly. Inside a broad `try/except`, it assigns `Time := EncodeTime(Hour, Min, Sec, MSec)` and returns `True`; any exception is swallowed and converted to `False`.

**Edge cases and quirks**

- Installed Delphi 37.0 `EncodeTime` rejects hour 24. Exact `24:00:00.000` therefore returns `False`, despite current DocWiki text saying the upstream try routine accepts that boundary.
- On failure, the assignment never completes and the script's `var Time` retains its previous numeric value. Consume it only after a `True` result.
- The adapter catches every exception, not just the expected `EConvertError`; diagnostic detail is discarded.
- There is no date or timezone information in the returned fraction.
- Precision is one millisecond.

**Side effects**

Writes `Time` on success only. No I/O or shared state.

**Performance and concurrency**

Constant-time arithmetic and exception handling with no shared mutable state.

**Related entries**

- [`EncodeTime`](EncodeTime.md) propagates the conversion exception.
- [`TryEncodeDateTime`](TryEncodeDateTime.md) calls Delphi's direct try encoder rather than this PascalScript adapter.
- [`DecodeTime`](DecodeTime.md) decomposes an encoded value.

**External references**

- [Embarcadero `System.SysUtils.TryEncodeTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TryEncodeTime) - the page's hour-24 claim differs from the installed `EncodeTime` terminal used by Velox's adapter.
- [Free Pascal `TryEncodeTime`](https://www.freepascal.org/docs-html/rtl/sysutils/tryencodetime.html)

<small>Created 2026-07-15</small>
