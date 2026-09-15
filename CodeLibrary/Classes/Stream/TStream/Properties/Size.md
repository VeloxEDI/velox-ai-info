---
title: Size
description: Gets or changes logical byte length through a 32-bit script helper, with support, allocation and truncation behavior delegated to descendants.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, size, length, longint, truncate]
---

```Delphi
property Size: LongInt read write;
```

### Example

```Delphi
procedure TruncateAtCursor(Stream: TStream);
begin
  if Stream = nil then Exit;

  Stream.Size := Stream.Position;
end;
```

### Usage

`Size` gets or changes logical byte length through a 32-bit script helper, with support, allocation and truncation behaviour determined by the stream being used.

### Additional Technical Info
`Size` is the stream's logical byte length where the concrete descendant supports sizing. Assigning a smaller value normally truncates data; assigning a larger value can allocate/extend storage whose new bytes are not generally guaranteed to be initialized.

Velox narrows Delphi's native Int64 Size to signed 32-bit LongInt through the PascalScript runtime helper. Streams larger than the LongInt range cannot be represented safely through this property and may truncate or raise. This also limits script-requested resizing even where the native descendant supports larger data.

The base TStream getter can obtain Size by saving Position, seeking to the end, and restoring Position. Descendants can override it. On a stream without seeking/sizing, reading Size can fail; if a seek/restore fails, cursor state may not be recoverable. Network/forward-only streams may report an unknown value instead.

Setter behavior is also descendant-specific:

- TMemoryStream reallocates and clamps Position only when past the new end.
- TFileStream changes file length and requires a suitable writable handle.
- read-only or unsized streams can reject or ignore resizing according to their implementation.

The example is destructive. It keeps only bytes before the current cursor and cannot restore the discarded tail. File and memory mutation is immediate and nontransactional.

The example is source-reviewed only; no stream was truncated.

**External references**

- [Embarcadero: `TStream.Size`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Size) - native Int64 logical-size property.
- [Free Pascal: `TStream.Size`](https://www.freepascal.org/docs-html/rtl/classes/tstream.size.html) - compatible logical length semantics.

<small>Created 2026-07-15</small>
