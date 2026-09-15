---
title: "BytesToStream"
description: "Clears a supplied memory stream and writes the complete byte array into that caller-owned stream."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - bytes
  - stream
  - memory stream
---

```Delphi
procedure BytesToStream(const aBytes: TBytes; var aStream: TMemoryStream);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Data: TBytes;
  Buffer: TMemoryStream;
begin
  Data := Base64DecodeBytes('QUJD');
  Buffer := TMemoryStream.Create;
  try
    BytesToStream(Data, Buffer);
    Value := Buffer.Size;  // 3
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`BytesToStream` clears a supplied memory stream and writes the complete byte array into that caller-owned stream.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aBytes` | `TBytes`, `const` | Complete byte array to copy. An empty array is valid. |
| `aStream` | `TMemoryStream`, `var` | Existing caller-owned stream to clear and populate. The object reference must not be `nil`. Velox does not reassign it. |

**Returns**

No value. On successful completion, `aStream.Size = Length(aBytes)`. Its position is at the end of the data for a non-empty array and at zero for an empty array.

**Errors**

Nil-object access, memory-allocation and script/runtime errors propagate. With the cleared stream at position zero and a positive array length, the current `TMemoryStream.Write` returns the complete count or raises; the ignored return value does not introduce a current short-write branch. There is no transaction or rollback to the previous stream content.

**Usage notes**

Allocate the stream before calling and free it in `finally`. Treat the clear-and-copy operation as one ownership boundary. If preservation of existing content matters, write into a separate stream and replace the caller's reference only after success.

### Additional Technical Info
`BytesToStream` replaces the content of an existing `TMemoryStream` with a `TBytes` value. The procedure does not create, return or free the stream. The caller retains ownership.

The example converts fictional Base64 text to three bytes, writes them to a caller-owned stream and reports the resulting size. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox stream import binds to a short product wrapper. It first calls `aStream.Clear`. Delphi `TMemoryStream.Clear` releases the stream's allocated buffer and resets capacity, size and position to zero. If the array is empty, the wrapper exits. Otherwise it calls `aStream.Write(aBytes[0], Length(aBytes))` from position zero.

The current Delphi `TMemoryStream.Write` grows memory as needed, copies the requested bytes and advances both size and position. The wrapper ignores the returned byte count; normal `TMemoryStream` behaviour is to complete the write or raise.

**Edge cases and quirks**

- The operation is destructive. Existing stream content and capacity are discarded before the new write begins.
- A `nil` stream raises when `Clear` is invoked. The `var` parameter does not mean that Velox allocates or replaces the object.
- Empty input leaves a valid, empty stream with `Size = 0` and `Position = 0`.
- After non-empty input, reset `Position := 0` before passing the stream to a consumer that reads from its current position.
- If allocation for the new content fails, the old content is already lost and the stream remains empty. The current `TMemoryStream.Write` grows the complete buffer before its single memory copy, so it does not return a successfully written prefix in this call path.

**Side effects**

Mutates the supplied stream object. No file, dataset or Velox configuration is accessed by this wrapper.

**Performance and concurrency**

The procedure performs a complete in-memory copy and requires capacity for the full byte array. It is synchronous. A `TMemoryStream` is not safe for simultaneous reads/writes from multiple callers without external coordination.

**Related entries**

- [`HexToBin`](HexToBin.md) allocates and returns a memory stream from hexadecimal text.
- [`Base64DecodeBytes`](../EncryptionHashEncode/Base64DecodeBytes.md) creates bytes from Base64 text.

**External references**

- [Embarcadero `TMemoryStream.Clear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream.Clear) and [`TMemoryStream.Write`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream.Write) - the exact Delphi terminal methods.
- [Free Pascal `TMemoryStream.Clear`](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.clear.html) and [`TMemoryStream.Write`](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.write.html) - compatible stream-operation references; Velox executes Delphi's implementation.

<small>Created 2026-07-15</small>
