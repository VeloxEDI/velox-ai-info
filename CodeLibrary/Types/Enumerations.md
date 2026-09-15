---
title: Enumerations
description: Source-backed ordinal contracts used by Velox scripts across data, JSON, XML, mail, HTTP, authentication, logging and errors.
sidebar_position: 2
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, types, enumerations, ordinal, api-contracts]
---

Velox PascalScript enumerations are named ordinal types. Unless stated otherwise, the first declared member has ordinal 0 and each following member increases by one. The name is the stable scripting concept; the numeric ordinal is an implementation detail that can drift when an importer omits, inserts or reorders a host value.

## Select an enumeration

| Area | Enumeration | Use | Critical boundary |
|---|---|---|---|
| Client datasets | [`TDataPacketFormat`](Enumerations/TDataPacketFormat.md) | Binary or XML packet serialization | Format controls bytes and encoding, not logical rows. |
| Lists | [`TDuplicates`](Enumerations/TDuplicates.md) | Sorted-list duplicate policy | Comparison rules and existing entries affect results. |
| Datasets | [`TFieldType`](Enumerations/TFieldType.md) | Field/parameter logical type | Script importer omits host `ftLargeUint`. |
| HTTP | [`TIdHTTPProtocolVersion`](Enumerations/TIdHTTPProtocolVersion.md) | HTTP/1.0 or 1.1 | This is separate from TLS. |
| Mail | [`TIdMessageEncoding`](Enumerations/TIdMessageEncoding.md) | Whole-message layout | Not character or transfer encoding. |
| Mail | [`TIdMessageFlags`](Enumerations/TIdMessageFlags.md) | IMAP message state | Flags normally travel in a set. |
| Mail | [`TIdMessagePartType`](Enumerations/TIdMessagePartType.md) | Text versus attachment part | Result follows runtime class behavior. |
| Mail | [`TIdMessagePriority`](Enumerations/TIdMessagePriority.md) | Five-level message priority | Ordinals map to X-Priority 1..5. |
| PascalScript VM | [`TIFException`](Enumerations/TIFException.md) | Runtime error category | Parameter meaning depends on the error member. |
| JSON | [`TJSONValueType`](Enumerations/TJSONValueType.md) | Runtime JSON value kind | Guard conversions by kind and null state. |
| Datasets | [`TLocateOption`](Enumerations/TLocateOption.md) | Locate matching behavior | Used through `TLocateOptions`; provider behavior matters. |
| XML | [`TsdElementType`](Enumerations/TsdElementType.md) | NativeXML node kind | Raw navigation includes non-element nodes. |
| Authentication | [`TvxAuthType`](Enumerations/TvxAuthType.md) | Basic, bearer, OAuth or Windows selection | Script importer omits host `fatNTLM`. |
| File audit | [`TvxFileEventType`](Enumerations/TvxFileEventType.md) | File lifecycle event | Omitted host `fetDownload` shifts later ordinals. |
| File definitions | [`TvxFileType`](Enumerations/TvxFileType.md) | Legacy file parser family | `fftExcel` is an old alias-like member. |
| OAuth | [`TvxGrantType`](Enumerations/TvxGrantType.md) | Grant flow | Password grant is obsolete; Auto is provider data. |
| HTTP | [`TvxHTTPMethod`](Enumerations/TvxHTTPMethod.md) | Request method or routing sentinel | Any/Custom are not ordinary fixed methods. |
| Logging | [`TvxLogStatusType`](Enumerations/TvxLogStatusType.md) | Outcome/severity state | Status drives persistence, routing and notifications. |
| TLS | [`TvxSSLClientType`](Enumerations/TvxSSLClientType.md) | SSL/TLS protocol mapping | Several labels collapse to TLS 1.2. |
| TLS | [`TvxTLSType`](Enumerations/TvxTLSType.md) | No, implicit or explicit TLS policy | Require and explicit modes have different failure behavior. |

## Rules for technical consumers

- Compare named members and use `case` statements. Do not persist `Ord(...)` unless the same exact importer declaration is part of the data contract.
- An enumeration is one value. A `set of` type can hold zero or more members; see the separate [Sets](Sets.md) branch.
- Validate values entering through configuration, JSON, databases, Variants or numeric casts before assigning them to an enumeration.
- Treat importer/host mismatches as type-boundary defects. `TvxFileEventType` has a shifted ordinal after omitted `fetDownload`; `TvxAuthType` omits trailing `fatNTLM`; `TFieldType` omits trailing `ftLargeUint`.
- `Low`, `High`, `Ord`, `Pred` and `Succ` express ordinal mechanics but do not provide business meaning. Prefer explicit named mapping tables.
- Code Library declarations for `TFieldType` and `TIFException` were truncated to 300 characters in the generated index; their child pages reconstruct the complete script registration from product source.

**External references**

- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal ordering and operations.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration language model.

<small>Created 2026-07-15</small>
