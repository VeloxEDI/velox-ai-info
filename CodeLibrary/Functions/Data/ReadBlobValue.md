---
title: "ReadBlobValue"
description: "Attempts to read a blob field into a string but currently returns uninitialized character data for non-empty blobs."
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - blob
  - stream
  - unicode
  - defect
  - security
---

```Delphi
Function ReadBlobValue(aField: TBlobField): String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Do not use this helper in the current build; see the defect below.
  Value := Null;
end;
```

### Usage

`ReadBlobValue` attempts to read a blob field into a string but currently returns uninitialized character data for non-empty blobs.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aField` | `TBlobField` | Blob field on the current dataset record. Must be non-`nil` and valid for the active record. |

**Returns**

The declaration says `String`, but non-empty blobs are not copied into it in the current build. Do not interpret the returned length or characters as blob content.

**Usage notes**

Use a supported encoding-aware text field API or binary stream/byte-array path. A correct future Velox must define whether the blob is binary, UTF-8, UTF-16 or another encoding; rewind before reading; size the destination in the proper units; and verify the read count.

### Additional Technical Info
`ReadBlobValue` is intended to save a `TBlobField` into memory and return its bytes as a Delphi string. **The current implementation never rewinds the memory stream before reading, ignores the zero-byte read, and returns a string whose payload was not populated from the blob. Do not use it.**

The example intentionally does not invoke the function. It is source-reviewed and no blob/runtime test bed was executed.

**Implementation trace and defect**

Velox creates an empty `TMemoryStream` and calls `aField.SaveToStream(Stream)`. Installed Delphi `TBlobField.SaveToStream` creates a read blob stream and calls destination `Stream.CopyFrom(BlobStream, 0)`. `CopyFrom` writes at the destination's current position and advances it, so the memory stream is positioned at its end.

Velox then calls:

```Delphi
SetLength(Result, Stream.Size);
Stream.Read(Result[1], Stream.Size);
```

Because `Position = Size`, `TCustomMemoryStream.Read` returns `0`. The return count is ignored and no blob byte reaches `Result`. Installed Delphi string allocation sets the length and terminator but does not initialize the new character payload, so a non-empty result can contain stale/uninitialized memory rather than predictable NUL characters. Returning or logging it creates a potential information-disclosure and correctness risk.

There is a second unit error: `Stream.Size` is bytes, while `SetLength(UnicodeString, N)` allocates `N` two-byte characters. Even after adding a rewind, raw bytes cannot safely be read into a Unicode string without a defined encoding and correct byte-to-character conversion.

**Edge cases**

- A null/empty blob yields stream size `0`, then the code still evaluates `Result[1]`. The current Velox project enables Delphi range checking, so indexing the zero-length string raises `ERangeError` before the zero-count `Read` can complete.
- `aField = nil`, an inactive dataset or an invalid current record can raise.
- Arbitrary binary data is not text and may contain invalid UTF-16, embedded NULs or odd byte counts.
- The code uses `Read`, not `ReadBuffer`, and ignores the number actually read.

**Side effects and errors**

A temporary stream is allocated and always freed. There is no exception handler, so field/stream/allocation errors propagate into the script. The uninitialized return can expose process-memory remnants even when no exception occurs.

**Performance and concurrency**

The entire blob is copied into a memory stream and a second, incorrectly sized string allocation is made, so memory cost is at least proportional to the blob and can be substantially higher. Dataset field state remains context-owned and must not be read concurrently.

**Related entries**

- [`CreateBlobValue`](CreateBlobValue.md) has a separate Variant byte-array buffer overflow.

**External references**

- [Embarcadero `Data.DB.TBlobField.SaveToStream`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TBlobField.SaveToStream) - the blob-to-stream operation used by Velox.
- [Embarcadero `System.Classes.TStream.Position`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.Position) - current byte offset that must be rewound before reading saved content.
- [Embarcadero `System.Classes.TStream.Read`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.Read) - returns the number of bytes actually read and advances the current position.
- [Free Pascal `TBlobField.SaveToStream`](https://www.freepascal.org/docs-html/fcl/db/tblobfield.savetostream.html) - compatible whole-blob stream-copy concept.
- [Free Pascal `TStream.Read`](https://www.freepascal.org/docs-html/rtl/classes/tstream.read.html) - compatible read-count contract and the distinction from `ReadBuffer`.

<small>Created 2026-07-15</small>
