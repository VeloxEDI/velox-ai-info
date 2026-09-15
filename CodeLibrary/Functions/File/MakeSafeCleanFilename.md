---
title: "MakeSafeCleanFilename"
description: "Applies Velox's ASCII filename replacement and one-pass whitespace/hyphen cleanup."
sidebar_position: 33
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - filename
  - sanitisation
  - ascii
---

```Delphi
Function MakeSafeCleanFilename( const aFilename : String) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MakeSafeCleanFilename('  Fictional: Order  42?.csv  ');
  // Fictional- Order 42-.csv
end;
```

### Usage

`MakeSafeCleanFilename` applies Velox's ASCII filename replacement and one-pass whitespace/hyphen cleanup.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFilename` | `String`, `const` | One filename component to transform. Passing a complete path destroys its separators. |

**Returns**

The ASCII-only, replaced and cleaned string. The result can be empty and is not guaranteed to be a valid, unique or usable Windows filename.

**Behaviour**

- Leading/trailing spaces/control characters are removed by the `Trim`.
- Invalid/non-ASCII characters are first changed to `-`.
- One pass reduces matched double spaces and hyphen patterns.
- All leading and trailing hyphens are removed, including genuine hyphens originally supplied by the caller.
- Interior dots, spaces and many punctuation characters remain.

**Errors**

No normal content-dependent exception; conversion/allocation failures can propagate.

**Usage notes**

Check for an empty/reserved/overlong result and apply the destination's exact filename policy after transformation. Preserve original customer-facing text separately when lossy replacement is unacceptable.

### Additional Technical Info
`MakeSafeCleanFilename` first applies [`MakeSafeFilename`](MakeSafeFilename.md), then performs fixed cleanup passes for double spaces, `'- -'` and `'--'`, and finally removes every leading/trailing hyphen. It is a lossy Velox naming convention, not a complete Windows filename validator.

The example shows the source-derived transformation and was not executed by the documentation workflow.

**Implementation**

After `MakeSafeFilename`, the function conditionally calls Delphi `StringReplace(..., [rfReplaceAll])` once for each ordered pattern: two spaces become one, `'- -'` becomes `'-'`, then `'--'` becomes `'-'`. Delphi replacement is non-recursive: matches created or left by a replacement are not repeatedly processed to a fixed point. Two loops then remove boundary hyphens.

**Edge cases and quirks**

- Cleanup is not recursive. Long interior runs can still contain repeated spaces or hyphens after the single pass.
- A string made entirely from invalid characters/hyphens can become empty.
- Unicode characters, including each UTF-16 surrogate code unit of an emoji, are replaced with hyphens before cleanup.
- Windows reserved device names (`CON`, `NUL`, `COM1` and similar), trailing dots, length limits and dot-only names are not handled.
- The function does not add an extension, preserve a path, check existence or reserve the result.
- “Safe” does not mean safe against path traversal when a caller later combines this value incorrectly; validate the final path under an approved root.

**Side effects**

None.

**Performance and concurrency**

Several complete-string scans/copies make work linear with a small constant multiplier. Removing many leading hyphens uses repeated `Delete` calls and can become quadratic for a long all-hyphen prefix. No shared state is used.

**Related entries**

- [`MakeSafeFilename`](MakeSafeFilename.md) performs the initial exact character replacement without cleanup.
- [`MakeUniqueFilename`](MakeUniqueFilename.md) selects a currently unused candidate but does not sanitise it.
- [`AppendIdFilename`](AppendIdFilename.md) appends an identifier without sanitisation.

**External references**

- [Embarcadero `System.SysUtils.Trim`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Trim)
- [Embarcadero `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StringReplace) - explicitly documents non-recursive replacement.
- [Free Pascal `Trim`](https://www.freepascal.org/docs-html/rtl/sysutils/trim.html) and [Free Pascal `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - compatible API context; Velox defines the replacement list and cleanup order.

<small>Created 2026-07-15</small>
