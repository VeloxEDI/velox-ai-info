---
title: taCenter
description: Selects centred TAlignment rendering but falls through Velox fixed-width export without centring or width enforcement.
sidebar_position: 186
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, delphi, alignment, centre, fixed-width]
---

```Delphi
taCenter = 2
```

### Example

```Delphi
function IsCentredAlignment(Alignment: TAlignment): Boolean;
begin
  Result := Alignment = taCenter;
end;
```

### Usage

`taCenter` selects centred TAlignment rendering but falls through Velox fixed-width export without centring or width enforcement.

### Additional Technical Info
`taCenter` is the third member of Delphi's `TAlignment` enumeration. A control or other consumer that implements the standard meaning positions text horizontally in the centre of its available area.

The constant expresses an alignment choice; it does not itself measure, pad, truncate or render text. The consuming class decides how—and whether—to implement centring.

**Velox script exposure**

Velox registers `TAlignment = (taLeftJustify, taRightJustify, taCenter)` as a hidden scripting type and exposes its members as constants. The current reduced TField script import does not expose native `TField.Alignment`, so scripts cannot use this constant to change a dataset field's alignment through that documented surface. It remains valid in compatible `TAlignment` expressions and any exposed signature that accepts the type.

The example classifies a value only. It is source-reviewed and is not executed by the documentation workflow.

**Critical fixed-width export quirk**

Velox's non-delimited flat-file writer has explicit branches for [`taLeftJustify`](taLeftJustify.md) and [`taRightJustify`](taRightJustify.md), but no `taCenter` branch and no fallback. If a native dataset field is centred:

- a value shorter than `DisplayWidth` is written without left or right padding;
- a value longer than `DisplayWidth` is written without truncation; and
- the resulting record can be shorter or longer than the configured fixed-width layout.

This is not centred padding. It is a fall-through that bypasses width enforcement and can shift every following field. Treat a centred native field in a fixed-width output definition as a configuration defect unless downstream layout explicitly permits variable width.

Delimited output bypasses the alignment case entirely, so this quirk applies only when `FieldDelimited` is false. Trimming and string quoting still occur before the case, even though no width processing follows for this member.

**Core behavior and boundaries**

- The ordinal is 2 even though this page appears first among the `ta*` pages under alphabetical navigation.
- UI consumers can account for font metrics, control padding and bidirectional layout; the enum alone does not define those policies.
- `TField.Alignment` is primarily display metadata. Velox additionally reuses it as fixed-width serialization metadata, with the incomplete behavior above.
- The constant is resolved at script compile time, has no shared state and is safe to compare concurrently.

**External references**

- [Embarcadero `System.Classes.TAlignment`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TAlignment)
- [Embarcadero `Data.DB.TField.Alignment`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.Alignment)
- [Free Pascal `TAlignment`](https://www.freepascal.org/docs-html/rtl/classes/talignment.html)
- [Free Pascal `TField.Alignment`](https://www.freepascal.org/docs-html/fcl/db/tfield.alignment.html)

<small>Created 2026-07-15</small>
