---
title: Size
description: Gets or sets the logical bit count, resizing word-rounded storage while preserving overlapping allocated bytes.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, bits, size, allocation, resize]
---

```Delphi
property Size: Integer read write;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Flags: TBits;
begin
  Flags := TBits.Create;
  try
    Flags.Size := 64;
    Flags.Bits[63] := True;
    Value := Flags.Size;

    Flags.Size := 0;  // releases all bit storage
  finally
    Flags.Free;
  end;
end;
```

### Usage

`Size` gets or sets the logical bit count, resizing word-rounded storage while preserving overlapping allocated bytes.

### Additional Technical Info
`Size` is the number of logical bit positions. A new [`TBits`](../../TBits.md) has `Size=0`. Valid read indexes are zero through `Size - 1`; the value is not the highest valid index.

Assigning a negative value raises `EBitsError` and leaves the current size unchanged. Assigning the existing value is a no-op. Assigning zero frees the complete backing allocation. A positive value calculates enough storage for the requested count, rounded to native `Integer` words; in the Windows Velox runtime that is 32 bits/four bytes per word.

When the rounded allocation size changes, the implementation allocates a zero-filled replacement, copies the overlapping old bytes and frees the old block. New complete words are therefore false. Allocation failure propagates before the old block is freed, so the existing set remains available when the initial allocation itself fails.

When old and new logical sizes fit in the same number of words, no allocation or clearing occurs. This creates an important shrink/re-grow behavior: setting size from 32 to 8 hides bits 8..31 but retains them in the same word; setting it back to 32 exposes their prior values. Crossing a word boundary frees removed words, so values in those freed words are lost. Code must not assume every newly re-exposed position is false.

Resizing is O(number of copied bytes) when the allocation changes and constant-time otherwise. A very large value can exhaust process memory. The implementation performs no application-level size limit and is not thread-safe.

The source-reviewed example releases storage explicitly before freeing the object. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TBits.Size`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TBits.Size) - Delphi property reference.
- [Free Pascal: `TBits.Size`](https://www.freepascal.org/docs-html/rtl/classes/tbits.size.html) - compatible logical-size context; allocation details above come from the Delphi source used by Velox.

<small>Created 2026-07-15</small>
