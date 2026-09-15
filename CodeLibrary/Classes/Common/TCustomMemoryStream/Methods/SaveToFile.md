---
title: SaveToFile
description: Creates or truncates a file and writes the complete logical buffer of a TCustomMemoryStream descendant to it.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcustommemorystream, file, save, overwrite]
---

```Delphi
procedure SaveToFile(FileName: string);
```

### Example

```Delphi
procedure SaveBuffer(const Buffer: TMemoryStream; const FileName: string);
begin
  Buffer.SaveToFile(FileName);
end;
```

### Usage

`SaveToFile` creates or truncates a file and writes the complete logical buffer of a memory stream to it.

- Treat the target as a destructive side effect: an existing file is lost even if a later write fails.
- The parent directory must already exist. File-name, access, sharing, disk-full and device errors propagate.
- The operation is not atomic and does not create a temporary file or rollback. Readers can observe a partial file.

### Additional Technical Info
`SaveToFile` is declared by hidden ancestor `TCustomMemoryStream` and is normally called on a visible [`TMemoryStream`](../../../Stream/TMemoryStream.md). It persists raw bytes; it performs no text encoding, framing or Velox data conversion.

#### Source-backed behaviour

The installed Studio 37.0 implementation constructs `TFileStream(FileName, fmCreate)`, calls [`SaveToStream`](SaveToStream.md), and frees the temporary stream in `finally`. `fmCreate` creates a new file or truncates an existing file before the memory write begins.

The inherited save path writes exactly `Size` bytes starting at the memory buffer's address. It does **not** start at the source stream's current `Position`, and it does not change that position. An empty buffer therefore creates or truncates the file to zero bytes.

#### Related members

Use [`SaveToStream`](SaveToStream.md) when the destination stream and its lifetime are already controlled. See [`TFileStream.Create`](../../../Stream/TFileStream/Methods/Create.md) for explicit file mode and sharing choices.

#### Official RTL references

- [Embarcadero: TCustomMemoryStream.SaveToFile](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCustomMemoryStream.SaveToFile)
- [Free Pascal: TCustomMemoryStream.SaveToFile](https://www.freepascal.org/docs-html/rtl/classes/tcustommemorystream.savetofile.html)

<small>Created 2026-07-15</small>
