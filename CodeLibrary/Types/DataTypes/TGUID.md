---
title: TGUID
description: Represents a GUID as a plain 16-byte PascalScript record with D1, D2, D3 and eight-byte D4 fields.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, guid, uuid, record, identifier]
---

```Delphi
TGUID = record
  D1: LongWord;
  D2: Word;
  D3: Word;
  D4: array[0..7] of Byte;
end;
```

### Example

```Delphi
procedure ReadGuidPart(GuidText: String; var FirstPart: Cardinal);
var
  G: TGUID;
begin
  G := StringToGUID(GuidText);
  FirstPart := G.D1;
end;
```

### Usage

`TGUID` represents a GUID as a plain 16-byte Velox scripting record with D1, D2, D3 and eight-byte D4 fields.

### Additional Technical Info
`TGUID` is registered by the PascalScript COM compiler library as a plain record matching the standard 16-byte GUID field layout. The exposed fields are [`D1`](TGUID/D1.md), [`D2`](TGUID/D2.md), [`D3`](TGUID/D3.md) and [`D4`](TGUID/D4.md).

The current script record does not import Delphi's modern `TGUID.Empty`, `Create`, `IsEmpty` or equality operators as record methods. Use the approved [`GUID conversion`](../../Functions/Conversion/GUIDToString.md) and [`GUID helpers`](../../Functions/Guid.md) instead.

Record assignment copies the value; there is no object ownership. An all-zero field record is the empty GUID, but prefer `EmptyGuid`/`IsEmptyGuid` so intent and future behavior are explicit.

Do not manually serialize the in-memory 16 bytes. Conventional text groups are numeric D1/D2/D3 plus D4 bytes, while raw memory on little-endian Windows stores the first numeric fields least-significant byte first. Protocol UUID byte order can differ. Use GUIDToString/StringToGUID or a protocol-specific conversion.

GUIDs provide a large identifier space, not authenticity, authorization, ordering or secrecy. Validate accepted textual syntax and never trust knowledge of a GUID as access control.

The example is source-reviewed only; no GUID was parsed.

**External references**

- [Embarcadero TGUID](https://docwiki.embarcadero.com/Libraries/Athens/en/System.TGUID) - native Delphi record and field layout.
- [Free Pascal TGUID](https://www.freepascal.org/docs-html/rtl/system/tguid.html) - compatible GUID record reference.
- [RFC 9562](https://www.rfc-editor.org/rfc/rfc9562.html) - UUID formats and byte-order conventions.

<small>Created 2026-07-15</small>
