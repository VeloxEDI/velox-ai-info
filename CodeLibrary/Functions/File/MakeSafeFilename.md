---
title: "MakeSafeFilename"
description: "Trims a name and replaces controls, non-ASCII text and selected Windows-invalid characters with hyphens."
sidebar_position: 34
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
Function MakeSafeFilename( const aFilename : String) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MakeSafeFilename('  Fictional:Order?.csv  ');
  // Fictional-Order-.csv
end;
```

### Usage

`MakeSafeFilename` trims a name and replaces controls, non-ASCII text and selected Windows-invalid characters with hyphens.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFilename` | `String`, `const` | One filename component to transform. A complete path loses all `/` and `\` separators. |

**Returns**

A trimmed string containing only ASCII characters from code 32 through 126, except that `*`, `?`, `|`, `\`, `/`, `<`, `>`, `:`, and `"` are replaced by `-`. Other allowed ASCII characters are retained unchanged.

**Behaviour**

- Interior spaces and ordinary ASCII punctuation remain.
- Path separators are replaced, so the output is flattened to one component.
- All non-ASCII letters/symbols are lost rather than transliterated.
- Existing hyphens and replacement hyphens are not collapsed or removed.
- Empty/trimmed-away input returns `''`.

**Errors**

No normal content-dependent exception; conversion/allocation failures can propagate.

**Usage notes**

Validate empty/reserved/overlong outputs and collision policy after transformation. Use [`MakeSafeCleanFilename`](MakeSafeCleanFilename.md) when the additional one-pass whitespace/hyphen cleanup is desired.

### Additional Technical Info
`MakeSafeFilename` trims leading/trailing spaces and control characters, then replaces every remaining control character, every non-ASCII character and a fixed set of Windows-invalid filename characters with `-`.

The example shows the source-derived transformation and was not executed by the documentation workflow. The result is a Velox convention, not a complete guarantee that Windows or another destination will accept the name.

**Implementation**

The function first calls installed Delphi `Trim`, which removes boundary characters with ordinal values less than or equal to space. It then scans the Unicode string one UTF-16 code unit at a time. Any unit below `#32`, above `#126`, or in the explicit invalid-character set is replaced in place with `-`.

**Edge cases and quirks**

- An emoji is represented by two UTF-16 surrogate code units, so it normally becomes two hyphens.
- Windows reserved device names (`CON`, `PRN`, `AUX`, `NUL`, `COM1` and similar) are still returned unchanged.
- Trailing dots, dot-only names, filename length, reserved control semantics and destination-specific restrictions are not validated.
- The result can be empty, collide with another transformed name, or exceed a path limit.
- Replacing separators prevents direct traversal syntax inside this one component, but safe final-path construction still requires a governed root and canonical containment check.

**Side effects**

None.

**Performance and concurrency**

One trim plus one full scan makes work linear in input length. The result is independent and no shared mutable state is used.

**Related entries**

- [`MakeSafeCleanFilename`](MakeSafeCleanFilename.md) adds fixed cleanup passes and strips boundary hyphens.
- [`MakeUniqueFilename`](MakeUniqueFilename.md) addresses a currently existing path but does not sanitise text.
- [`ExtractFileName`](ExtractFileName.md) isolates a name component before sanitisation.

**External references**

- [Embarcadero `System.SysUtils.Trim`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Trim)
- [Free Pascal `Trim`](https://www.freepascal.org/docs-html/rtl/sysutils/trim.html) - compatible boundary-trimming context; the ASCII range and replacement set are Velox-owned.

<small>Created 2026-07-15</small>
