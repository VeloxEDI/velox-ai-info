---
title: LoadFromFile
description: Replaces the memory buffer from a read/share-deny-write file stream, with full-file allocation and nontransactional failure behavior.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, memory, file, load, filesystem]
---

```Delphi
procedure LoadFromFile(FileName: string);
```

### Example

```Delphi
procedure LoadPayload(const FileName: String; Buffer: TMemoryStream);
begin
  if Buffer = nil then Exit;

  Buffer.LoadFromFile(FileName);
  Buffer.Position := 0;
end;
```

### Usage

`LoadFromFile` replaces the memory buffer from a read/share-deny-write file stream, with full-file allocation and nontransactional failure behaviour.

### Additional Technical Info
`LoadFromFile` opens `FileName` with `fmOpenRead or fmShareDenyWrite`, calls [`LoadFromStream`](LoadFromStream.md), and frees the temporary file stream in `finally`. It reads the complete file from byte 0 and replaces the destination's logical content.

The method allocates memory equal to the file Size before reading. Enforce an approved maximum file size before loading untrusted or partner-controlled paths; a large file can exhaust the Velox process. The check and subsequent open/read are not atomic, so the file can change between them unless an external workflow controls writers.

If opening fails, the destination has not yet been changed. Once LoadFromStream begins, resizing and reading are nontransactional: an allocation/read error can leave the destination resized with partially replaced data. Position is not reliably reset to zero by the implementation, so set it explicitly before a later read as shown.

The temporary stream denies other writers according to host sharing semantics, but this is not a content-integrity guarantee across all filesystems/platforms. It also does not validate path roots or file type. The Velox process's filesystem permissions apply.

The example is source-reviewed only; no file was read.

**External references**

- [Embarcadero: `TMemoryStream.LoadFromFile`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream.LoadFromFile) - Delphi full-file load behavior.
- [Free Pascal: `TMemoryStream.LoadFromFile`](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.loadfromfile.html) - compatible implementation relationship to LoadFromStream.

<small>Created 2026-07-15</small>
