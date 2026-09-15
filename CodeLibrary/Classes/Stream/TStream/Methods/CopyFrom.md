---
title: CopyFrom
description: Copies bytes from a borrowed source using an explicitly sized buffer, with rewind-on-nonpositive Count and partial-output failure semantics.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, copy, buffer, position, partial-write]
---

```Delphi
function CopyFrom(Source: TStream; Count: Int64; BufferSize: Integer): Int64;
```

### Example

```Delphi
procedure CopyCompleteStream(Source, Dest: TStream);
var
  Copied: Int64;
begin
  if (Source = nil) or (Dest = nil) then Exit;

  Copied := Dest.CopyFrom(Source, 0, 65536);
  Log('Copied bytes: ' + IntToStr(Copied));
end;
```

### Usage

`CopyFrom` copies bytes from a borrowed source using an explicitly sized buffer, with rewind-on-nonpositive Count and partial-output failure semantics.

### Additional Technical Info
`CopyFrom` reads from borrowed `Source` and writes into the receiving stream at its current [`Position`](../Properties/Position.md). It returns bytes copied. Neither stream is freed.

Unlike the native Delphi declaration, Velox requires all three arguments because PascalScript registration does not carry default parameter values. `BufferSize` must be greater than zero; otherwise `ERangeError` is raised before copying. It controls temporary memory/chunk size, not the amount copied.

#### Count behavior in the installed runtime

| Count | Behavior |
|---|---|
| `> 0` | Copy exactly Count bytes from the source's current Position. |
| `= 0` | Set source Position to 0, obtain source Size and copy the whole source. |
| `< 0` | Also set source Position to 0 and replace Count with source Size; if that Size is negative/unknown, read chunks until Read returns 0. |

The destination Position is never reset automatically. In whole-source mode only the source is rewound. A positive Count larger than remaining input calls [`ReadBuffer`](ReadBuffer.md) and raises after any earlier chunks were already written.

Writes use [`WriteBuffer`](WriteBuffer.md), so a destination short write is retried and then raises if progress stops. Copying is not transactional: on any read/write exception, both cursors and destination Size/content can already be partially advanced. The current Delphi implementation can preallocate capable destinations and shrinks that preallocation to the reached Position if copying fails, but already written bytes remain.

Source and destination should be distinct. Passing the same stream shares one cursor and can overwrite, extend or otherwise corrupt content rather than create a snapshot. Also do not concurrently use either stream during the copy.

The example is source-reviewed only; no bytes were copied.

**External references**

- [Embarcadero: `TStream.CopyFrom`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.CopyFrom) - native contract and default arguments that Velox does not expose.
- [Free Pascal: `TStream.CopyFrom`](https://www.freepascal.org/docs-html/rtl/classes/tstream.copyfrom.html) - compatible stream-copy reference.

<small>Created 2026-07-15</small>
