---
title: "Base64EncodeFile"
description: "Reads a complete file and returns its bytes as unwrapped standard Base64 text."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - base64
  - encoding
  - file
---

```Delphi
Function Base64EncodeFile( const aFileName : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Base64EncodeFile('C:\VeloxExamples\fictional-input.bin');
end;
```

### Usage

`Base64EncodeFile` reads a complete file and returns its bytes as unwrapped standard Base64 text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `string`, `const` | Path of the file to read using the executing Velox process's identity and execution context. |

**Returns**

The complete file content encoded with the standard Base64 alphabet and `=` padding. An empty file returns an empty string.

**Behaviour**

- The file is opened for reading and its entire content is encoded as binary bytes.
- No character-set conversion, compression or content-type detection occurs.
- Output uses standard Base64 with no inserted CR/LF wrapping.
- The source file is not intentionally modified.

**Errors**

Missing files, invalid paths, access denial, sharing violations, files that are too large for available memory and other stream/encoding exceptions propagate to the script.

**Usage notes**

Check file size before encoding untrusted or potentially large paths. Base64 does not prove that the source was complete or unmodified; use an appropriate hash, MAC or signature when the consuming protocol requires integrity.

### Additional Technical Info
`Base64EncodeFile` reads the complete contents of a named file and returns those bytes as standard Base64 text without line wrapping.

The example uses a fictional local path, is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox creates a `TMemoryStream` and a `TBase64Encoding` configured with line length `0`, loads the complete file into the stream, and passes the stream's memory pointer and size to `EncodeBytesToString`. Both objects are released in a `finally` block.

**Edge cases and quirks**

- Relative paths resolve in the current execution context and may behave differently in Designer and service processes. Prefer a controlled absolute or configured path.
- The source can change between path validation and loading, and another process can change it while this helper runs subject to Windows sharing rules.
- A zero-byte file yields an empty string, which is also the result of encoding a zero-length in-memory value.
- Standard output is not automatically suitable for a URL component because it can contain `+`, `/` and `=`.

**Side effects**

Reads a file and consumes a file handle temporarily. Access is performed as the executing Velox process account.

**Performance and concurrency**

This is not streaming: the entire file and the resulting Base64 string are held in memory. Base64 output is about one third larger than the input before string-storage overhead. Independent files can be read concurrently, while behaviour for a file being written concurrently depends on the other process's sharing mode.

**Related entries**

- [`Base64DecodeFile`](Base64DecodeFile.md) writes decoded content to a file.
- [`Base64EncodeBytes`](Base64EncodeBytes.md) encodes an in-memory byte array.
- [`HashString`](HashString.md) computes a SHA-384 digest of text, not file bytes.

**External references**

- [Embarcadero DocWiki: `TNetEncoding.EncodeBytesToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.NetEncoding.TNetEncoding.EncodeBytesToString) - the Delphi byte-to-Base64 method used after loading the file.
- [Free Pascal: `EncodeStringBase64`](https://www.freepascal.org/docs-html/fcl/base64/encodestringbase64.html) - related cross-compiler Base64 reference; Velox uses Delphi's implementation.

<small>Created 2026-07-15</small>
