---
title: "HexToBin"
description: "Creates a memory stream sized from hexadecimal text and decodes complete byte pairs into it."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - hexadecimal
  - binary
  - memory stream
---

```Delphi
function HexToBin(aHexString: String): TMemoryStream;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := HexToBin('414243');
  try
    Value := Buffer.Size;  // 3
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`HexToBin` creates a memory stream sized from hexadecimal text and decodes complete byte pairs into it.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aHexString` | `String` | Hexadecimal text. Safe use requires an even number of characters and only `0`-`9`, `A`-`F` or `a`-`f`. No prefix or separators are supported. |

**Returns**

A new `TMemoryStream` whose size is `Length(aHexString) div 2`. For fully valid input, its memory contains the decoded bytes and its `Position` remains zero. The caller must free it.

**Errors**

Invalid hex characters do not raise in the normal decoder path; they cause a short decode whose count is ignored. Construction or allocation exceptions are swallowed by the defective handler, with the unsafe result described above.

**Usage notes**

Require `Length mod 2 = 0` and every character to be hexadecimal. After a valid call, `Position` is already zero and the stream is ready for a current-position read. Do not attempt to detect malformed input only by comparing `Stream.Size`; that size was established before decoding.

### Additional Technical Info
`HexToBin` allocates a `TMemoryStream` with one byte for each complete pair of input characters and asks Delphi to decode hexadecimal pairs directly into its memory. A successfully returned stream is caller-owned and positioned at zero.

The example uses valid, even-length fictional text and always frees the returned stream. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox common-number implementation creates a memory stream, sets `Size` to the input length divided by two, and calls Delphi `System.Classes.HexToBin(PChar(Input), Stream.Memory, Stream.Size)`. Because the decoder writes directly through `Memory`, it does not advance the stream position.

Delphi's decoder stops when it reaches the requested output size or encounters the first invalid hexadecimal character and returns the number of bytes written. Velox ignores that count and leaves the preallocated stream size unchanged.

**Critical validation warning**

Validate the complete input before calling. If an invalid character occurs after one or more valid pairs, only the prefix is decoded. The rest of the already allocated stream buffer is not established as decoded data, yet remains included in `Size`. Consuming those trailing bytes can expose unspecified memory content or corrupt the integration payload.

**Edge cases and quirks**

- Odd-length input silently discards its final unmatched character because the stream size uses integer division.
- Empty input returns an empty stream at position zero.
- A `$` or `0x` prefix, whitespace, hyphens and other separators are invalid; the decoder stops at them rather than raising a conversion error.
- The stream holds raw bytes, not a text encoding. Its content must be interpreted by the next operation's explicit binary contract.
- A successfully returned object belongs to the caller. Always free it in `finally`.

**Unsafe exception path**

The current Velox exception handler frees the result object but does not set the function result to `nil` and does not re-raise. If an exception occurs after the stream has been assigned—such as a size-allocation failure—the function can return a reference to an already freed object. Reading or freeing that reference is unsafe. This is a current implementation defect, not a usable failure contract.

For untrusted, very large or otherwise failure-prone input, prefer validating and decoding through a routine with explicit success/count reporting until the product defect is corrected.

**Side effects**

Allocates a stream and its backing memory. No file or Velox dataset is accessed.

**Performance and concurrency**

Valid decoding is linear and preallocates the complete output. The operation is synchronous and uses only local state. Size-limit external input before allocating.

**Related entries**

- [`BinToHex`](BinToHex.md) formats a Variant array as hexadecimal text.
- [`HexToInt`](HexToInt.md) strictly parses hexadecimal text to an `Int64` and raises on invalid content.
- [`BytesToStream`](BytesToStream.md) safely copies an already decoded byte array into an existing stream.

**External references**

- [Embarcadero `System.Classes.HexToBin`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.HexToBin) - the exact Delphi buffer decoder called by Velox.
- [Free Pascal `HexToBin`](https://www.freepascal.org/docs-html/rtl/classes/hextobin.html) - documents compatible stop-at-invalid and returned-count semantics; Velox's ignored count and exception path are product-specific.

<small>Created 2026-07-15</small>
