---
title: LoadFromFile
description: Replaces the list from a shared-read file using BOM detection or the list's current default encoding.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, loadfromfile, encoding, file]
---

```Delphi
procedure LoadFromFile(FileName: string);
```

### Example

```Delphi
procedure LoadLines(const Items: TStringList; const FileName: string);
begin
  Items.LoadFromFile(FileName);
end;
```

### Usage

`LoadFromFile` replaces the list from a shared-read file using BOM detection or the list's current default encoding.

- Treat the filename as untrusted input only after applying your workflow's path/access controls.
- File-not-found, access, sharing, decoding, memory and list-event errors propagate.
- The operation is not rollback-safe: old entries may already be cleared when decoding or insertion fails.

### Additional Technical Info
`LoadFromFile` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It performs external file I/O and replaces current entries; it is not an incremental append.

#### Source-backed behaviour

The registered overload opens `TFileStream(FileName, fmOpenRead or fmShareDenyWrite)`, then calls the nil-encoding overload of [`LoadFromStream`](LoadFromStream.md). The RTL detects a supported byte-order mark; without one it uses the list's `DefaultEncoding` (initially `TEncoding.Default`). Detected/current encoding is retained internally for a later save.

Existing entries are cleared during loading. With the current default line break, inputs of at least `$15000000` bytes use the streaming reader branch; smaller inputs are buffered in memory. The importer does not expose an overload for explicitly selecting an encoding.

#### Related members

[`LoadFromStream`](LoadFromStream.md) starts from a stream's current position. [`SaveToFile`](SaveToFile.md) creates/truncates and uses retained/default encoding.

#### Official RTL references

- [Embarcadero: TStrings.LoadFromFile](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.LoadFromFile)
- [Free Pascal: TStrings.LoadFromFile](https://www.freepascal.org/docs-html/rtl/classes/tstrings.loadfromfile.html)

<small>Created 2026-07-15</small>
