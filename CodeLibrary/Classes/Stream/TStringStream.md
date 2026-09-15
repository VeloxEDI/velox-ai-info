---
title: TStringStream
description: Converts an initial Unicode String to host-default encoded bytes while exposing only the base TStream surface to Velox scripts.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, string, encoding, bytes, default-codepage]
---

```Delphi
TStringStream = class(TStream)
```

### Example

```Delphi
procedure UseTextAsStream(const Text: String);
var
  Source: TStringStream;
begin
  Source := TStringStream.Create(Text);
  try
    // Source.Position = 0; Source.Size is the encoded byte count.
  finally
    Source.Free;
  end;
end;
```

### Usage

`TStringStream` converts an initial Unicode String to host-default encoded bytes while exposing only the base TStream surface to Velox scripts.

### Additional Technical Info
`TStringStream` makes encoded bytes derived from a String available through the [`TStream`](TStream.md) cursor/I/O contract. Velox exposes only [`Create(AString)`](TStringStream/Methods/Create.md) plus inherited TStream members.

The native RAD Studio 37 class actually descends through `TBytesStream` and `TMemoryStream`, but the PascalScript compiler registers it directly under TStream. Consequently, native memory-stream-only methods such as Clear, LoadFromFile, LoadFromStream and SetSize are not callable through this scripting type even though they exist on the runtime object.

#### Encoding and content access

The exposed constructor calls native `TStringStream.Create(AString)`, which uses `TEncoding.Default`. The resulting bytes therefore depend on the Velox host's default code page/encoding. Size is encoded byte length, not String character count, and Position begins at zero.

This makes the class unsuitable as a portable wire-format choice when systems must agree on UTF-8, UTF-16 or another explicit encoding. Prefer the Code Library's encoding-specific StringToStream functions for deterministic integration payloads.

Native TStringStream exposes DataString and Encoding, but neither is registered in this visible scripting surface. Read bytes or use the matching stream-to-string helper instead. Inherited raw Read/Write still use the Velox String-as-byte-buffer adapter and do not automatically decode/encode each call.

#### Lifetime

A constructed instance is script-owned and must be freed. It owns its encoded byte buffer. Passing it to another method normally lends the object for the duration of that call; do not free it while a consumer still uses it. It is mutable, cursor-based and not thread-safe.

The example is source-reviewed only; no string stream was created.

**External references**

- [Embarcadero: `TStringStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStringStream) - native class, encoding and byte-backed behavior.
- [Free Pascal: `TStringStream`](https://www.freepascal.org/docs-html/rtl/classes/tstringstream.html) - compatible string-stream concept.

<small>Created 2026-07-15</small>
