---
title: "Compression"
description: "Functions for creating ZIP archives and compressing or decompressing byte arrays, Unicode strings and files with zlib or gzip wrappers."
sidebar_position: 6
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compression
  - zlib
  - gzip
  - zip
---

The Compression group exposes three related but different formats:

- `ZLib...` functions read or create a **zlib-wrapped deflate stream**.
- `GZip...` functions are intended to read or create a **gzip member**.
- `Zip` creates a **ZIP archive** containing one or more named files.

These formats all use the deflate algorithm in the current implementation, but their wrappers and container structures are not interchangeable. A `.zip` archive is not a gzip stream, and a gzip member is not accepted by the `ZLibDecompress...` functions.

## Choosing a function

Use the byte-array functions when the integration already owns a binary payload. Use the string pairs only when both producer and consumer agree that text is encoded as Delphi `TEncoding.Unicode`: UTF-16 little-endian code units without a byte-order mark. The file functions return a complete result in memory; they do not replace or rewrite the source file.

Use `Zip` only when a conventional multi-entry archive is required. It creates or truncates its destination before reading the sources and normally stores each readable source under its backslash-delimited base filename. A source supplied with forward slashes can retain path text in the archive entry because the implementation strips only the final backslash-delimited component.

## Current implementation warnings

The gzip helpers are Velox-owned adaptations of Delphi's zlib code and are not equivalent in reliability to the `ZLib...` wrappers:

- `GZipDecompressFile` does not decompress. The current implementation returns the source file's bytes unchanged. Do not use it where decompression is required.
- `GZipDecompress` can keep enlarging its output buffer after truncated or otherwise non-progressing input returns `Z_BUF_ERROR`. This can consume memory until another failure stops the call. Validate and size-limit untrusted data before invoking it.
- `GZipCompress` contains an incorrect output pointer in its buffer-growth branch. Its initial allocation is normally generous, but if that branch is reached, subsequent output starts at the beginning of the result and can overwrite bytes already produced.
- The gzip file helpers construct stream resources outside their protected cleanup blocks. Some construction or copy failures can leak objects until process termination.

These are descriptions of the current product source, not intended contracts. Prefer the `ZLib...` family when gzip compatibility is not required, and verify any gzip-dependent integration with representative non-production data in the same deployed Velox version.

## Resource and security considerations

Compression is not encryption. None of these functions adds confidentiality, authentication, a password or a signature. Decompression size is not capped, so a small hostile input can expand into a large allocation. Apply an integration-level size and trust policy before decompressing external data.

The byte and string functions allocate their complete results. The zlib/gzip file adapters stream the source through 32 KiB or internal stream buffers but retain the complete returned bytes. `Zip` reads each source file into memory and also allocates a compressed buffer for it. All calls are synchronous and provide no timeout, cancellation or progress callback to a script.

File access occurs under the Windows identity and permissions of the executing Velox process. File readers request sharing that allows other processes to continue reading and writing, so a concurrently changed source is not a stable snapshot. `Zip` also has destructive destination semantics: an existing writable destination is truncated, and a partially written destination is deleted when the function reports failure.

## Related groups

- [`Encryption, hashing and encoding`](EncryptionHashEncode.md) contains Base64 and other representations useful for transporting returned byte arrays as text.
- [`File`](File.md) contains general file operations; apply the same service-account and path-safety rules.
- [`Functions`](../Functions.md) explains how callable Code Library entries are exposed to Velox scripts.

## External references

- [Embarcadero `System.ZLib`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.ZLib)
- [Free Pascal `ZStream` unit](https://www.freepascal.org/docs-html/fcl/zstream/index.html) - compatibility context only; Velox runs the Delphi implementation and contains additional product-specific wrappers.
- [Library of Congress: ZIP File Format (PKWARE)](https://www.loc.gov/preservation/digital/formats/fdd/fdd000354.shtml)
