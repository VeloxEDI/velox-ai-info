---
title: "ResemblesText"
description: "Reports whether two strings resemble each other through Delphi's configurable phonetic comparison."
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - text
  - soundex
  - phonetic
---

```Delphi
Function ResemblesText( const AText, AOther : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ResemblesText('Robert', 'Rupert');
end;
```

### Usage

`ResemblesText` reports whether two strings resemble each other through Velox's configurable phonetic comparison.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AText` | `string`, `const` | First text value. |
| `AOther` | `string`, `const` | Second text value. |

**Returns**

It returns `False` when that procedure variable is nil.

**Behaviour**

Under the default procedure, each input is converted independently to a Soundex code and the codes are compared exactly. Soundex is a coarse phonetic grouping aid, not a spelling, identity or language-aware similarity score.

**Errors**

The standard procedure has no expected content-dependent exception for ordinary strings. Any exception raised by a replacement procedure propagates through this call.

**Usage notes**

Use explicit [`SoundexSimilar`](SoundexSimilar.md) when the algorithm and length must be visible in the script. Use exact keys and additional evidence for deduplication or identity decisions.

### Additional Technical Info
`ResemblesText` calls Delphi's process-wide phonetic comparison procedure. In the normal Velox runtime that procedure is `SoundexProc`, which compares four-character Soundex codes.

The example normally returns `True` because both names have the default code `R163`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox registers `System.StrUtils.ResemblesText` directly. The routine itself sets `False`, checks `Assigned(ResemblesProc)`, and invokes that procedure variable when present. Delphi initialises the variable to `SoundexProc`; the default procedure calls `SoundexSimilar` with the default length of four.

This indirection is material: the public name does not permanently guarantee Soundex. Native code in the Velox process can replace or clear the global procedure, although the variable is not exposed as a normal Velox script assignment.

**Edge cases and quirks**

- Two empty strings normally return `True` because both default Soundex results are empty. One empty and one non-empty string return `False`.
- The default Soundex algorithm primarily scores ASCII letters. Non-Latin text and punctuation can collapse to weak or misleading codes.
- Different names can share a code. A `True` result must not be treated as proof that people, organisations or addresses are the same.
- If native host code sets `ResemblesProc` to nil, every call returns `False`. A replacement procedure can change results, performance and errors process-wide.
- This function uses `ResemblesProc`, not the separate `AnsiResemblesProc` variable.
- Free Pascal documents its corresponding default behaviour, but cannot establish whether a particular Velox process has changed Delphi's global procedure.

**Side effects**

The standard Soundex procedure has no external side effect. The dispatcher reads shared process-wide procedure state; a host-supplied replacement can have its own effects.

**Performance and concurrency**

The default work is linear in both input lengths and allocates two short codes. Reads of a stable procedure pointer are inexpensive, but changing the global pointer concurrently is host-wide mutable state and is outside the script's control.

**Related entries**

- [`SoundexSimilar`](SoundexSimilar.md) explicitly compares Soundex codes at a requested length.
- [`Soundex`](Soundex.md) returns the code for inspection or storage.
- [`SameText`](SameText.md) performs case-insensitive text equality instead of phonetic grouping.

**External references**

- [Embarcadero `System.StrUtils.ResemblesText`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.ResemblesText)
- [Free Pascal `ResemblesText`](https://www.freepascal.org/docs-html/rtl/strutils/resemblestext.html) - compatibility context; Delphi's current `ResemblesProc` value defines Velox's actual algorithm.

<small>Created 2026-07-15</small>
