---
title: Stream
description: "Aliases TMemoryStream without allocating or copying its mutable byte buffer, cursor, size, or ownership."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, reference, alias, stream, memory, ownership]
---

```Delphi
Stream = TMemoryStream
```

### Example

```Delphi
procedure BuildBuffer(var Buffer: Stream);
begin
  Buffer := TMemoryStream.Create;
  try
    Buffer.Size := 0;
    // Use Buffer while it remains owned by this procedure.
  finally
    Buffer.Free;
    Buffer := nil;
  end;
end;
```

### Usage

Aliases TMemoryStream without allocating or copying its mutable byte buffer, cursor, size, or ownership.

#### Shared object state

Assigning a `Stream` variable copies the object reference. Both variables then see the same heap buffer, `Position`, `Size` and mutations. Reading through one advances the cursor observed through the other; writing, clearing or resizing through one changes the same content. Use `CopyFrom` or a purpose-built conversion when independent bytes are required.

The actual producer controls ownership:

- a `TMemoryStream.Create` result is script-owned and should be released with `Free` in `finally`;
- a stream supplied by a host property or callback is normally borrowed unless that entry explicitly transfers it;
- passing a stream to another object does not transfer ownership unless that operation says so; and
- freeing one alias invalidates every other alias to the same object.

Setting a freed variable to `nil` reduces accidental reuse but cannot clear other aliases. A nil stream has no buffer, and a member call through it fails.

#### Size, encoding and failure boundaries

The visible stream properties adapt Velox Int64 Position/Size to script `LongInt`. Keep script-managed memory streams below signed 32-bit limits and apply a stricter business limit to partner-controlled content. Allocation, copying and conversion can temporarily require multiple complete buffers.

The stream stores bytes, not text. Raw String-based `Read`/`Write` calls do not select an encoding or resize a destination string for the caller. Use the documented conversion helper when the bytes represent text, Base64 or another encoded format.

Mutations are not transactional or thread-safe. An exception can leave Position, Size or content partially changed. Do not share an instance across concurrent Velox work.

### Additional Technical Info
`Stream` is installed during every Velox script compilation with `AddTypeCopyN('Stream', 'TMemoryStream')`. It is compile-time-equivalent to [`TMemoryStream`](../../Classes/Stream/TMemoryStream.md). The alias does not mean the abstract `TStream` ancestor, wrap an external stream, allocate a buffer or copy bytes.

**Related Code Library entries**

- [TMemoryStream](../../Classes/Stream/TMemoryStream.md) - complete construction, cursor, allocation and method guidance.
- [Stream classes](../../Classes/Stream.md) - comparison of the exposed stream implementations.

**External references**

- [Embarcadero TMemoryStream](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream) - Delphi heap-backed stream.
- [Free Pascal TMemoryStream](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.html) - compatible class and lifetime model.

<small>Created 2026-07-15</small>
