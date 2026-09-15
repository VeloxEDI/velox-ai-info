---
title: OpenBit
description: Returns the first false bit index, or Size when no logical bit is open, without reserving or growing the set.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, bits, openbit, search, sentinel]
---

```Delphi
function OpenBit: Integer;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Flags: TBits;
  Index: Integer;
begin
  Flags := TBits.Create;
  try
    Flags.Size := 3;
    Flags.Bits[0] := True;
    Flags.Bits[1] := True;

    Index := Flags.OpenBit;
    if Index < Flags.Size then
    begin
      Flags.Bits[Index] := True;  // reserve it explicitly
      Value := Index;
    end
    else
      Value := -1;
  finally
    Flags.Free;
  end;
end;
```

### Usage

`OpenBit` returns the first false bit index, or Size when no logical bit is open, without reserving or growing the set.

### Additional Technical Info
`OpenBit` scans from bit zero and returns the first logical position whose value is false. The search reads packed `Integer` words, skips words that are entirely true and then scans individual bits in the first non-full word.

The method is observational: it does not set the returned bit, change [`Size`](../Properties/Size.md) or reserve anything. Another mutation between the search and the write can invalidate the result. In a single-threaded script, explicitly set [`Bits[Index]`](../Properties/Bits.md) after checking the sentinel, as the example does.

If every bit in the logical range is true, the current Delphi implementation returns `Size`. It also clamps an unused false padding bit in the last allocated word to `Size`. For an empty set, `Size=0` and the method returns `0`; that value is the full/empty sentinel and is not a readable bit index.

This differs materially from Free Pascal, whose official `TBits.OpenBit` documentation specifies `-1` when no open bit exists. Velox executes Delphi `System.Classes`, so test `Index < Flags.Size`; do not test only for `-1` and do not copy the Free Pascal sentinel into a Velox flow.

The scan is O(`Size`) in the worst case with word-level skipping. It allocates nothing and normally raises no exception for a valid object, but calling through a nil or stale reference remains invalid. The set is not thread-safe.

The source-reviewed example converts the Delphi sentinel to `-1` for its own result and explicitly reserves a found bit. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TBits.OpenBit`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TBits.OpenBit) - Delphi API reference.
- [Free Pascal: `TBits.OpenBit`](https://www.freepascal.org/docs-html/rtl/classes/tbits.openbit.html) - documents the incompatible `-1` full sentinel.

<small>Created 2026-07-15</small>
