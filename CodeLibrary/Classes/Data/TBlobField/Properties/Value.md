---
title: Value
description: "This property is unsafe: it can truncate writes and return invalid text. Do not use it."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, blob, string, defect, security]
---

```Delphi
property Value: string read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Blob: TBlobField;
  Buffer: TMemoryStream;
begin
  // Do not read or assign Blob.Value in the current build.
  Blob := TBlobField(DATA_Self.FieldByName('Payload'));
  Buffer := TMemoryStream.Create;
  try
    Blob.SaveToStream(Buffer);
    Value := Buffer.Size;
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`Value` is unsafe in the current Velox version: it can truncate writes and return invalid or previously held text. Do not read or assign it.

**Errors**

Range-check, invalid-record, inactive-dataset, read-only/not-editing, allocation, BLOB-stream and data-access errors can raise. There is no validation, encoding error report or restoration of an overwritten BLOB.

**Usage notes**

Use `SaveToStream`/`LoadFromStream` for bytes. If content is text, transfer bytes through a stream and apply the explicitly required UTF-8, UTF-16 or legacy encoding conversion.

### Additional Technical Info
`Value` is registered to scripts as a read/write `string`, but its Velox adapter performs an incorrect raw-memory copy over Delphi's native byte-array property. **Do not read or assign this property in the current build. Use the BLOB stream methods for binary data and an explicitly encoded text path for text.**

The example intentionally avoids the property and demonstrates the byte-preserving alternative. It is source-reviewed and was not executed by the documentation workflow.

The declared script type does not match current native Delphi, where `TBlobField.Value` is `TArray<Byte>`. Free Pascal exposes a string Value through normal `GetAsString`/`SetAsString`; that is also not what the Velox adapter implements.

**Implementation**

On assignment, the adapter allocates a byte array whose byte length equals `Length(T)`, then executes a raw `Move` of exactly that many bytes from the UTF-16 string's storage before assigning the native byte-array Value. A Delphi Unicode string needs two bytes per UTF-16 code unit on this Windows build, so only the first half of the string's storage is retained. For example, ordinary little-endian text `AB` supplies four bytes but the adapter stores only the first two (`41 00`).

On read, the adapter evaluates native `Self.Value` twice. The first complete BLOB read supplies the byte count used to allocate a Unicode string with one *character* per blob byte. A second complete BLOB read supplies the raw pointer for a Move of only that original byte count. This allocates twice as much character payload as it fills. The unwritten half can retain uninitialised or previous string memory while the returned length still includes it.

**Edge cases and quirks**

- Writes truncate/misalign UTF-16 data; reads do not reverse that transformation and are not a round trip.
- Returned strings can contain embedded nulls, malformed UTF-16 and stale/uninitialised characters. Returning, comparing or logging them is a correctness and potential information-disclosure risk.
- The two native reads are not an atomic snapshot. Concurrent record movement or BLOB mutation can make the second byte array shorter than the first count, allowing the raw Move to read beyond the second array.
- An empty string or empty BLOB still makes the helper index `T[1]` and byte-array element zero. The current Velox project enables Delphi range checking, so either access can raise `ERangeError` even though the requested Move count is zero.
- Native Value assignment creates a dataset BLOB write stream. On the common client dataset this requires edit/insert/new-value state, replaces the old BLOB and leaves posting/applying to the caller.
- The adapter bypasses native `TBlobField.GetAsString`/`SetAsString`; neither Delphi's ANSI conversion for ordinary BLOBs nor its UTF-16 wide-memo conversion repairs this property.

**Side effects**

Assignment can truncate the current record's BLOB and mark it modified before a later failure. Reading can fetch/materialise the full BLOB. Neither operation posts or commits the dataset.

**Performance and concurrency**

A read performs two complete native BLOB fetches and allocates their byte arrays plus a string with one two-byte character per byte, in addition to dataset BLOB buffering. The property can therefore multiply I/O and amplify peak memory well beyond the BLOB size. Dataset cursor/edit state is shared and not synchronised for concurrent use.

**Related entries**

- [`SaveToStream`](../Methods/SaveToStream.md) reads the BLOB without the defective string adapter.
- [`LoadFromStream`](../Methods/LoadFromStream.md) writes byte-preserving content from a stream.

**External references**

- [Embarcadero DocWiki: `Data.DB.TBlobField.Value`](https://docwiki.embarcadero.com/Libraries/Athens/en/API%3AData.DB.TBlobField.Value) - shows the current native Delphi byte-array declaration; inherited prose on the page is historical and does not describe the Velox adapter.
- [Free Pascal: `TBlobField.Value`](https://www.freepascal.org/docs-html/fcl/db/tblobfield.value.html) - documents a string property implemented through text accessors, unlike Velox's raw memory helper.

<small>Created 2026-07-15</small>
