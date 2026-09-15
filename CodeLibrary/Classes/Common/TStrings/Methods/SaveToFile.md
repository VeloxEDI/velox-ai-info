---
title: SaveToFile
description: Creates or truncates a file and writes the list's complete text using retained or default encoding and current BOM settings.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, savetofile, encoding, overwrite]
---

```Delphi
procedure SaveToFile(FileName: string);
```

### Example

```Delphi
procedure SaveLines(const Items: TStringList; const FileName: string);
begin
  Items.SaveToFile(FileName);
end;
```

### Usage

`SaveToFile` creates or truncates a file and writes the list's complete text using retained or default encoding and current BOM settings.

- Existing files are truncated before encoding/writing completes; errors can leave a partial or empty file.
- The directory must already exist and access/share/disk errors propagate.
- For deterministic interchange, establish and test the producer/consumer encoding contract outside this limited overload surface.

### Additional Technical Info
`SaveToFile` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It is a destructive external side effect, not an atomic publish operation.

#### Source-backed behaviour

The registered overload creates `TFileStream(FileName, fmCreate)`, calls [`SaveToStream`](SaveToStream.md) with the list's retained `FEncoding`, and frees the stream. If no encoding was retained by a load, saving falls back to `DefaultEncoding` (`TEncoding.Default` on a new list).

Studio 37.0 `TStrings` defaults `WriteBOM=True` and `TrailingLineBreak=True`. Those controls and explicit encoding overloads are not exposed by this importer, so a new script-created list normally writes a preamble when its default encoding supplies one and terminates every entry with the platform line break.

#### Related members

[`SaveToStream`](SaveToStream.md) exposes destination positioning. [`LoadFromFile`](LoadFromFile.md) can retain a detected encoding for a later save. [`Text`](../Properties/Text.md) defines joined content.

#### Official RTL references

- [Embarcadero: TStrings.SaveToFile](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.SaveToFile)
- [Free Pascal: TStrings.SaveToFile](https://www.freepascal.org/docs-html/rtl/classes/tstrings.savetofile.html)

<small>Created 2026-07-15</small>
