---
title: "Base64DecodeFile"
description: "Decodes standard Base64 text and writes the resulting bytes to a file."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - base64
  - decoding
  - file
---

```Delphi
Procedure Base64DecodeFile( const aBase64String, aFileName : string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Overwrites the destination if it already exists.
  Base64DecodeFile('VmVsb3ggZXhhbXBsZQ==',
    'C:\VeloxExamples\decoded-example.txt');
end;
```

### Usage

`Base64DecodeFile` decodes standard Base64 text and writes the resulting bytes to a file.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aBase64String` | `string`, `const` | Base64 text whose decoded bytes will become the complete file content. |
| `aFileName` | `string`, `const` | Destination path. An existing file is replaced; the parent directory must already exist. |

**Behaviour**

- The destination is created or truncated and then populated with the complete decoded byte sequence.
- Binary data is preserved; no UTF-8 or other text conversion is applied.
- The Velox Base64 decoder accepts the standard alphabet and permissively skips whitespace and other invalid characters.
- The operation does not append, create parent directories, choose a temporary file or perform an atomic replacement.

**Errors**

Invalid paths, missing directories, access denial, sharing violations, storage failures and memory-allocation errors propagate to the script. Malformed Base64 does not reliably raise because the decoder is permissive.

**Usage notes**

Use a controlled destination and apply independent size and integrity checks before accepting externally supplied content. When partial output is unacceptable, write to a controlled temporary name and perform an application-level verified replacement.

### Additional Technical Info
`Base64DecodeFile` decodes a standard Base64 string and saves the resulting bytes to the supplied file path. It is a procedure: success is indicated by normal completion, while failures raise an exception.

The example uses a fictional local path, is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox calls Delphi's shared `TNetEncoding.Base64.DecodeStringToBytes`, constructs a `TBytesStream` over the complete decoded result, then calls `SaveToFile`. The stream is released in a `finally` block.

**Edge cases and quirks**

- **The destination is overwritten if it exists.** Validate untrusted or dynamically constructed paths before calling this procedure.
- A zero-length result creates or truncates the destination to an empty file.
- Malformed, truncated or URL-safe Base64 may be accepted but produce partial or incorrect content because the decoder skips invalid symbols and accepts short final groups.
- If writing fails after the destination is created or truncated, a partial or empty file may remain.
- Relative paths are resolved in the execution context of the Velox process, which may differ between Designer and service execution. Prefer an intentional absolute or configured path.

**Side effects**

Creates, replaces and writes a file using the identity and permissions of the executing Velox process.

**Performance and concurrency**

The complete decoded content is first held in memory and then represented by a byte stream before being written. This is not a streaming decoder and may require substantial memory for large inputs. Concurrent calls targeting the same file can race, truncate one another or fail with sharing errors.

**Related entries**

- [`Base64DecodeBytes`](Base64DecodeBytes.md) returns the decoded bytes without file I/O.
- [`Base64EncodeFile`](Base64EncodeFile.md) reads a complete file and returns Base64 text.

**External references**

- [Embarcadero DocWiki: `TNetEncoding.DecodeStringToBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.NetEncoding.TNetEncoding.DecodeStringToBytes) - the Delphi decoding method used before the file write.
- [Free Pascal: `DecodeStringBase64`](https://www.freepascal.org/docs-html/fcl/base64/decodestringbase64.html) - related Free Pascal decoding reference; Velox uses Delphi and its acceptance rules.

<small>Created 2026-07-15</small>
