---
title: "ConvertHtmlHexToTColor"
description: "Converts a six-digit HTML RGB hex string to a Windows BGR TColor integer, returning red for other lengths."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - colour
  - hexadecimal
---

```Delphi
function ConvertHtmlHexToTColor(Color: String): Integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ConvertHtmlHexToTColor('#336699'); // $00996633 in BGR order
end;
```

### Usage

`ConvertHtmlHexToTColor` converts a six-digit HTML RGB hex string to a Windows BGR TColor integer, returning red for other lengths.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Color` | `String` | Expected as exactly six hexadecimal digits, optionally beginning with `#`. No trim is performed. |

**Returns**

For six digits `RRGGBB`, the result is the integer `$00BBGGRR`. If the post-processing text length is not six, the function returns decimal `255`, which is `$000000FF` and therefore red in `TColor` byte order.

The fallback is a valid colour, not an error indicator. A caller cannot distinguish an invalid-length input from the valid colour `#FF0000` by inspecting the result alone.

### Additional Technical Info
`ConvertHtmlHexToTColor` converts six HTML-style RGB hexadecimal digits into the integer byte order used by a Windows `TColor`: `$00BBGGRR`.

It is a parser/converter only. It does not apply a colour to a component and it does not support CSS shorthand, alpha channels, colour names or surrounding whitespace. The example is fictional and source-reviewed only.

**Implementation**

1. `uPSI_vxCommon` registers `vxCommon.ConvertHtmlHexToTColor` directly.
2. The nested helper reads the first character. If it is `#`, `StringReplace` removes every hash character in the string, not only the leading one.
3. A six-character result is reordered as `'$00' + BB + GG + RR`.
4. Delphi `StrToInt` parses that `$`-prefixed hexadecimal text.
5. Any other length returns `255`.

**Edge cases and quirks**

- Empty input attempts to read `Color[1]`. Product range checking is enabled, so it raises `ERangeError` before the length fallback.
- A leading hash activates replacement of all hashes. For example, malformed `'#12#3456'` becomes `'123456'` and is accepted.
- A hash that is not first is not removed and usually causes either the length fallback or a conversion error.
- Six non-hex characters pass the length test and then raise `EConvertError` in `StrToInt`.
- Eight-digit `AARRGGBB`/`RRGGBBAA`, three-digit CSS shorthand, colour names and whitespace-padded text return the red fallback because their lengths are not six.
- Letter case is accepted by Delphi's hexadecimal parser.
- The result is a raw Windows/VCL colour integer. It is not an HTML integer in `RRGGBB` order and has no alpha component.

**Side effects and errors**

The operation is pure. `ERangeError` and `EConvertError` propagate; the wrapper does not log or translate them. Validate/trim the input before calling when malformed text is possible.

**Related entries**

- [`ExtractNumber`](ExtractNumber.md) is another permissive text-to-number helper, with different filtering and locale rules.

**External references**

- [Embarcadero DocWiki: `System.UITypes.TColor`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.UITypes.TColor)
- [Embarcadero DocWiki: `System.SysUtils.StrToInt`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StrToInt)
- [Free Pascal: `SysUtils.StrToInt`](https://www.freepascal.org/docs-html/rtl/sysutils/strtoint.html)

<small>Created 2026-07-15</small>
