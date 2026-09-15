---
title: taLeftJustify
description: Selects left-aligned TAlignment rendering and Velox right-padding or trailing truncation for fixed-width fields.
sidebar_position: 187
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, delphi, alignment, left, fixed-width]
---

```Delphi
taLeftJustify = 0
```

### Example

```Delphi
function DefaultTextAlignment: TAlignment;
begin
  Result := taLeftJustify;
end;
```

### Usage

`taLeftJustify` selects left-aligned TAlignment rendering and Velox right-padding or trailing truncation for fixed-width fields.

### Additional Technical Info
`taLeftJustify` is the first member of Delphi's `TAlignment` enumeration. Standard consumers place the start of each text line at the left edge of the available area.

It is also the zero/default `TField.Alignment` value. Delphi object fields are zero-initialised, and the base `TField` constructor does not replace this value. Numeric field descendants deliberately change their default to [`taRightJustify`](taRightJustify.md).

**Velox script exposure**

Velox registers `TAlignment` as a hidden scripting type and exposes its members as constants. The current reduced TField import exposes `DisplayText`, `DisplayWidth` and other field members but omits `Alignment`; a script therefore cannot currently assign this constant to a dataset field through that documented surface. The constant can still be returned, compared or passed wherever a compatible `TAlignment` signature is available.

The example returns the enum value without changing product or dataset state. It is source-reviewed and is not executed by the documentation workflow.

**Velox fixed-width behavior**

When flat-file output is non-delimited, Velox obtains the field text first and then applies this branch:

- if the text is shorter than `DisplayWidth`, it appends spaces until the configured width is reached; or
- if the text is longer, it keeps the leftmost `DisplayWidth` units and silently removes trailing content.

For example, `ABC` at width 5 becomes `ABC  `, while `ABCDEFG` at width 5 becomes `ABCDE`. No warning or overflow indicator is generated.

Trimming happens before width enforcement. If string quoting is enabled, the quotes are added before measurement and count toward the width; truncation can therefore remove data or a closing quote. Non-string fields use `DisplayText`, so display formatting also affects the measured content.

Delphi `Length(string)` and `SetLength` operate in UTF-16 code units on Windows, not encoded bytes or user-perceived characters. A configured width is therefore not automatically a byte width, and truncation can split a surrogate pair. Confirm the final file encoding and test non-ASCII boundary values when a partner specification defines byte positions.

Delimited output bypasses this entire branch. [`taCenter`](taCenter.md) also bypasses it because Velox has no centred fixed-width case.

**Side effects, errors and performance**

The constant itself has no side effects. Native assignment to `TField.Alignment` can raise a dataset layout-change event when the dataset is active, but the current script TField wrapper does not expose that setter. Fixed-width padding/truncation allocates a string proportional to the configured width and can silently lose content; validate widths before production output.

**External references**

- [Embarcadero `System.Classes.TAlignment`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TAlignment)
- [Embarcadero `Data.DB.TField.Alignment`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.Alignment)
- [Free Pascal `TAlignment`](https://www.freepascal.org/docs-html/rtl/classes/talignment.html)
- [Free Pascal `TField.Alignment`](https://www.freepascal.org/docs-html/fcl/db/tfield.alignment.html)

<small>Created 2026-07-15</small>
