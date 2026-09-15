---
title: Bits
description: Reads or writes one Boolean flag, with strict read bounds and automatic logical growth on non-negative writes.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, bits, indexed-property, bounds, growth]
---

```Delphi
property Bits[Index: Integer]: Boolean read write;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Flags: TBits;
begin
  Flags := TBits.Create;
  try
    Flags.Bits[7] := True;  // grows Size from 0 to 8
    Flags.Bits[3] := False;
    Value := Flags.Bits[7];
  finally
    Flags.Free;
  end;
end;
```

### Usage

`Bits` reads or writes one Boolean flag, with strict read bounds and automatic logical growth on non-negative writes.

### Additional Technical Info
`Bits` provides zero-based indexed access to the packed flags. Delphi declares it as the default property, but using the explicit `Bits[Index]` form makes the operation and its growth behavior clearer in Velox scripts.

A read succeeds only when `Index` is between zero and [`Size`](Size.md) minus one. A negative index, an index equal to `Size`, or any larger index raises `EBitsError`; reading never grows the set and an empty set has no readable index.

A write also rejects a negative index. A non-negative index at or beyond the current end first sets `Size := Index + 1`, then writes the requested Boolean. This happens for both `True` and `False`, so `Flags.Bits[1000000] := False` still creates a million-and-one-bit logical set and can allocate substantial memory. Intermediate newly allocated words are initialized false.

The bit is selected by an `Integer`-word mask. Reads and writes are constant-time after any required growth. Growth can allocate and copy storage and can therefore raise an allocation exception in addition to `EBitsError` for invalid indices.

Shrinking `Size` does not necessarily clear bits outside the new logical range. When the shrink stays within retained word storage, expanding again can reveal the previous values. If a stable reset is required, assign the relevant positions false before shrinking, set `Size := 0` to free all storage, or explicitly initialize the expanded range.

The property is mutable and unsynchronised. A simultaneous resize and access is unsafe. Do not retain or share the object across concurrent Velox executions.

The source-reviewed example demonstrates write-driven growth and caller-owned lifetime. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TBits.Bits`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TBits.Bits) - documents strict read bounds and write-driven extension.
- [Free Pascal: `TBits.Bits`](https://www.freepascal.org/docs-html/rtl/classes/tbits.bits.html) - compatible indexed-property context; Velox follows the traced Delphi details above.

<small>Created 2026-07-15</small>
