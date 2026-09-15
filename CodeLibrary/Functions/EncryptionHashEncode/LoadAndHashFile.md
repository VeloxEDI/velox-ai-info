---
title: "LoadAndHashFile"
description: "Reads a file and returns an uppercase MD5 hexadecimal digest of its complete byte content."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - file
  - md5
  - hash
---

```Delphi
Function LoadAndHashFile( const aFileName : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := LoadAndHashFile('C:\VeloxExamples\fictional-order.edi');
end;
```

### Usage

`LoadAndHashFile` reads a file and returns an uppercase MD5 hexadecimal digest of its complete byte content.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `string`, `const` | File to open in Velox process identity. Relative paths use the process's current path context; use an unambiguous governed path in production. |

**Returns**

A 32-character uppercase MD5 value using characters `0-9` and `A-F`. An empty file returns the standard empty-byte MD5 value `D41D8CD98F00B204E9800998ECF8427E`; it does not return an empty string.

**Behaviour**

- File bytes are hashed exactly; no text decoding, newline conversion or Unicode normalisation occurs.
- The private stream starts at zero, so a stable file is hashed from its first byte to its current end.
- `fmShareDenyNone` allows other processes to retain or obtain compatible access while hashing.
- The file is opened and read synchronously on the executing Velox thread.

**Errors**

Missing files, access denial, invalid paths, share violations, device/network failures, stream-size/read failures, hashing-interface/provider failures and memory errors propagate to the script. There is no sentinel return, retry, timeout or partial-success result.

**Usage notes**

Use this helper only where a partner or legacy store requires MD5 compatibility. For ordinary Velox change fingerprints, prefer a stronger current algorithm and persist the algorithm name, output encoding and casing with the stored value. If the file can change, arrange application-level quiescence or hash an immutable copy.

### Additional Technical Info
`LoadAndHashFile` reads the complete byte content of a file and returns its MD5 digest as 32 uppercase hexadecimal characters. It is suitable for compatibility workflows that already define MD5 as a file fingerprint. It must not be used to establish that an untrusted file is authentic or safe.

The path is fictional. The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox creates a `TFileStream` with `fmOpenRead or fmShareDenyNone`. A newly opened stream starts at position zero. The wrapper passes it to [`MD5HashStream`](MD5HashStream.md), which creates the shipped Indy `TIdHashMessageDigest5`, hashes from the current position through the reported stream size and formats the 16-byte digest with Indy's uppercase hexadecimal conversion. Indy uses its registered hashing interface when that interface and MD5 are available (the shipped application can bind this interface to OpenSSL); otherwise it uses its native MD5 implementation. Both the hasher and file stream are freed in `finally` blocks.

This path uses the shipped Indy MD5 implementation. It does not call Delphi `System.Hash.THashMD5.GetHashStringFromFile`.

**Edge cases and quirks**

- MD5 has practical collision attacks. Two different inputs can be deliberately constructed with the same digest, so do not use this result as a signature, trust decision, malware check or authorisation control.
- The output is uppercase. [`MD5HashHex`](MD5HashHex.md), which uses Delphi `System.Hash`, returns lowercase hexadecimal for non-empty text.
- Sharing does not provide a snapshot. If another process changes or replaces the file during the read, the result can represent bytes observed across that change rather than one stable version.
- A relative path, mapped drive or network location is resolved in the Velox service/application account and session, which may differ from an interactive user's environment.
- The helper follows the filesystem's normal path and link resolution. It performs no allow-list, size, extension or content validation.

**Side effects**

The function opens and reads the file. It does not intentionally write or delete it. The open handle can still interact with concurrent rename/delete rules imposed by the filesystem and other handles.

**Performance and concurrency**

Runtime is linear in file size. Indy processes the stream incrementally rather than loading the complete file into one byte array, so hash working memory is bounded, although operating-system buffering still applies. Independent calls own independent streams and hash objects. Concurrent calls are safe only to the extent that the underlying file remains stable and accessible.

**Related entries**

- [`MD5HashStream`](MD5HashStream.md) exposes the same shipped Indy terminal for an existing stream and consumes it from its current position.
- [`MD5HashHex`](MD5HashHex.md) hashes UTF-8 text through Delphi `System.Hash` and uses lowercase output.
- [`HashString`](HashString.md) provides Velox's SHA-384 text fingerprint helper.

**External references**

- [Embarcadero DocWiki: `THashMD5.GetHashStringFromFile`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Hash.THashMD5.GetHashStringFromFile) - a comparable Delphi core file-hash API; Velox uses shipped Indy here and differs in sharing and uppercase formatting.
- [Free Pascal: `MD5File`](https://www.freepascal.org/daily/packages/hash/md5/md5file.html) - compatibility context for producing an MD5 digest from a file, not the Velox terminal implementation.
- [Free Pascal: `MD5Print`](https://www.freepascal.org/daily/packages/hash/md5/md5print.html) - compatibility context for converting an MD5 digest to text.

<small>Created 2026-07-15</small>
