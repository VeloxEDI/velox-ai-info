---
title: Create
description: Creates a byte stream from AString using the Velox host's default encoding, with no exposed encoding overload or empty constructor.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, string, create, encoding, codepage]
---

```Delphi
constructor Create(AString: string);
```

### Example

```Delphi
procedure CopyDefaultEncodedText(const Text: String; Dest: TStream);
var
  Source: TStringStream;
begin
  if Dest = nil then Exit;

  Source := TStringStream.Create(Text);
  try
    Dest.CopyFrom(Source, 0, 65536);
  finally
    Source.Free;
  end;
end;
```

### Usage

Creates a byte stream from AString using the Velox host's default encoding, with no exposed encoding overload or empty constructor.

### Additional Technical Info
`Create` converts AString to bytes with native `TEncoding.Default`, stores those bytes in a new TStringStream and sets Position to 0. Size becomes the encoded byte count, which can differ from `Length(AString)`.

Velox registers only this one-argument overload. The native empty, TBytes, explicit TEncoding and code-page overloads are not exposed. Supplying `''` creates an empty stream and is the available way to construct one with no initial bytes, but subsequent text-aware DataString/Encoding APIs are also not registered.

#### Portability boundary

Default encoding is host configuration, not an integration contract. A String containing characters absent from that encoding can be substituted or lost, and the same script can produce different bytes on differently configured machines. Use encoding-specific Code Library conversion functions where a protocol, file format or trading partner requires deterministic bytes.

After construction, inherited Read/Write operations are raw byte operations. They do not repeat the constructor's String conversion. The script-visible class ancestry is TStream, so TMemoryStream-only methods are unavailable despite the native object's deeper ancestry.

The caller owns a successful result and must call Free. Allocation/encoding failures occur during construction before a usable result exists. Avoid converting unbounded text without an external size limit.

The example is source-reviewed only; no stream was constructed or copied.

**External references**

- [Embarcadero: `TStringStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStringStream.Create) - native overload set and DataString initialization.
- [Embarcadero: `TEncoding`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding) - encoding abstraction used by the native constructor.
- [Free Pascal: `TStringStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tstringstream.create.html) - compatible constructor/encoding reference.

<small>Created 2026-07-15</small>
