---
title: taRightJustify
description: Selects right-aligned TAlignment rendering and Velox left-padding or leading truncation for fixed-width fields.
sidebar_position: 188
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, delphi, alignment, right, fixed-width]
---

```Delphi
taRightJustify = 1
```

### Example

```Delphi
function IsRightAligned(Alignment: TAlignment): Boolean;
begin
  Result := Alignment = taRightJustify;
end;
```

### Usage

`taRightJustify` selects right-aligned TAlignment rendering and Velox left-padding or leading truncation for fixed-width fields.

### Additional Technical Info
`taRightJustify` is the second member of Delphi's `TAlignment` enumeration. Standard consumers place the end of each text line at the right edge of the available area.

Delphi's `TNumericField` constructor assigns this value after the base field constructor, so integer, floating-point and other numeric field descendants commonly carry right-aligned display metadata. Velox's fixed-width writer consumes that native field metadata as a serialization rule.

**Velox script exposure**

Velox registers `TAlignment` as a hidden scripting type and exposes the constants. Its current reduced TField import omits the native `Alignment` property, so scripts cannot directly force a field to this value through the documented TField surface. The constant remains usable in typed comparisons and compatible exposed signatures.

The example classifies an existing alignment without changing field or output state. It is source-reviewed and is not executed by the documentation workflow.

**Velox fixed-width behavior**

For non-delimited flat-file output, Velox applies this branch after producing the field text:

- if the text is shorter than `DisplayWidth`, it prepends spaces until the width is reached; or
- if the text is longer, it deletes leading content and retains only the rightmost `DisplayWidth` units.

For example, `123` at width 5 becomes `  123`, while `1234567` at width 5 becomes `34567`. The latter behavior is silent and can remove a minus sign, currency symbol, most-significant digits or other essential prefix. Right alignment must not be treated as safe numeric overflow handling.

Trimming and string quoting occur before measurement. Quotes count toward the fixed width and can be lost through leading truncation. Non-string fields use formatted `DisplayText`, so thousands separators, decimal places, dates and other display formats change the measured content.

Width is calculated using Delphi UTF-16 string units, not encoded bytes or user-perceived characters. Deleting the leading units can split a surrogate pair. Verify output encoding and boundary data whenever the receiving specification defines byte offsets.

Delimited output ignores Alignment. [`taCenter`](taCenter.md) also receives no fixed-width padding or truncation because no centred branch exists.

**Side effects, errors and performance**

The constant itself is immutable and side-effect free. Native field assignment can cause an active dataset layout notification, but that setter is not in the current Velox script wrapper. Padding/truncation is linear in the resulting string length and does not report lost content; range and length validation must occur before export.

**External references**

- [Embarcadero `System.Classes.TAlignment`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TAlignment)
- [Embarcadero `Data.DB.TField.Alignment`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.Alignment)
- [Free Pascal `TAlignment`](https://www.freepascal.org/docs-html/rtl/classes/talignment.html)
- [Free Pascal `TField.Alignment`](https://www.freepascal.org/docs-html/fcl/db/tfield.alignment.html)

<small>Created 2026-07-15</small>
