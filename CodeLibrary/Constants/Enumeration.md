---
title: Enumeration
description: "Enumeration members and compatibility constants for Velox scripting, covering datasets, files, transports, JSON, XML, mail and compiler state."
sidebar_position: 2
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, constants, enumeration, ordinal, set, dataset, transport]
---

## Available families

The 207 entries in this group are the names scripts use for enum members and a small number of enum-like compatibility constants. The detailed page for each member gives its exact ordinal, source type, aliases, supported consumers and version boundary.

| Type or family | Members | Primary use |
|---|---:|---|
| `Boolean` | 2 | [`False`](Enumeration/False.md) and [`True`](Enumeration/True.md); intrinsic Boolean values, not numeric status codes. |
| `TComponentState` | 11 | `csAncestor` through `csWriting`; component streaming/design flags exposed as individual members of a set type. |
| [`TDataPacketFormat`](../Types/Enumerations/TDataPacketFormat.md) | 3 | `dfBinary`, `dfXML`, `dfXMLUTF8`; ClientDataSet packet serialization formats. |
| [`TDuplicates`](../Types/Enumerations/TDuplicates.md) | 3 | `dupIgnore`, `dupAccept`, `dupError`; string-list duplicate policy. |
| [`TFieldType`](../Types/Enumerations/TFieldType.md) | 52 | `ftUnknown` through `ftOraInterval`; dataset field metadata, not a request to convert a value. |
| [`TIdHTTPProtocolVersion`](../Types/Enumerations/TIdHTTPProtocolVersion.md) | 2 | `pv1_0`, `pv1_1`; the HTTP versions exposed by this Indy import. |
| [`TIdMessageEncoding`](../Types/Enumerations/TIdMessageEncoding.md) | 3 | `meDefault`, `meMIME`, `mePlainText`; message encoding policy. |
| [`TIdMessageFlags`](../Types/Enumerations/TIdMessageFlags.md) | 6 | `mfAnswered`, `mfDeleted`, `mfDraft`, `mfFlagged`, `mfRecent`, `mfSeen`; flags combined in a message-flags set. |
| [`TIdMessagePartType`](../Types/Enumerations/TIdMessagePartType.md) | 2 | `mptText`, `mptAttachment`; mail body-part role. |
| [`TIdMessagePriority`](../Types/Enumerations/TIdMessagePriority.md) | 5 | `mpHighest` through `mpLowest`; mail priority hint. |
| [`TIFException`](../Types/Enumerations/TIFException.md) | 25 | `ErNoError` plus compiler/runtime error categories; diagnostic identities, not exception instances. |
| [`TJSONValueType`](../Types/Enumerations/TJSONValueType.md) | 6 | `jsNull`, `jsString`, `jsNumber`, `jsObject`, `jsArray`, `jsBoolean`; JSON node kinds. |
| [`TLocateOption`](../Types/Enumerations/TLocateOption.md) | 2 | `loCaseInsensitive`, `loPartialKey`; flags combined in a locate-option set. |
| `TValueRelationship` compatibility | 3 | [`LessThan`](Enumeration/LessThan.md), [`Same`](Enumeration/Same.md), [`MoreThan`](Enumeration/MoreThan.md); signed comparison results `-1`, `0`, `1`. |
| `TOperation` | 2 | `opInsert`, `opRemove`; collection-notification operation. |
| `TAlignment` | 3 | `taLeftJustify`, `taRightJustify`, `taCenter`; horizontal alignment. |
| [`TsdElementType`](../Types/Enumerations/TsdElementType.md) | 18 | `xeElement`, `xeAttribute` and XML lexical/node categories used by the SimpleXML surface. |
| [`TvxAuthType`](../Types/Enumerations/TvxAuthType.md) | 8 | `fatNone` through `fatNetsuiteOAuth`; Velox transport authentication configuration. |
| [`TvxFileEventType`](../Types/Enumerations/TvxFileEventType.md) | 9 | `fetNone` through `fetWrite`; file-log/event category. |
| [`TvxFileType`](../Types/Enumerations/TvxFileType.md) | 6 | `fftFlatFile` through `fftExcelFile`; Velox file-definition kind. |
| [`TvxGrantType`](../Types/Enumerations/TvxGrantType.md) | 4 | `gtAuto`, `gtAuthCode`, `gtClientCredentials`, `gtPassword`; OAuth grant selection. |
| [`TvxHTTPMethod`](../Types/Enumerations/TvxHTTPMethod.md) | 10 | `hmAny`, standard verbs and `hmCustom`; configured HTTP method. |
| [`TvxLogStatusType`](../Types/Enumerations/TvxLogStatusType.md) | 9 | `flsNotSet` through `flsHighlight`; in-memory/log status ordinal, which is not every database lifecycle domain. |
| [`TvxSSLClientType`](../Types/Enumerations/TvxSSLClientType.md) | 9 | `fstAuto`, legacy SSL/TLS names and alias spellings; transport-library compatibility layer. |
| [`TvxTLSType`](../Types/Enumerations/TvxTLSType.md) | 4 | `fttNoTLSSupport` through `fttImplicitTLS`; mail TLS connection mode. |

## Enum members, ordinals and sets

An enum member has meaning only in its declaring domain. PascalScript ultimately evaluates most of these values as ordinals, so unrelated members with the same number can compare equal or be accepted by a weakly typed call while expressing the wrong intent. Prefer the public member name over a literal integer and verify the receiving property or parameter's enum type.

Types such as `TComponentState`, `TLocateOptions` and `TIdMessageFlags` are **sets** of enum members. A member is not the complete set: use set syntax such as `[loCaseInsensitive, loPartialKey]` where the imported signature expects a set. Do not add ordinals arithmetically. Duplicate aliases may map to the same bit and do not create an additional state.

Enum ordinals are implementation contracts, not durable external interchange formats unless the detailed child page explicitly traces a matching database/API contract. Persisting a raw ordinal makes upgrades and cross-domain mistakes difficult to detect.

## Important compatibility boundaries

- `fstTLS11`/`fstTLS1_1` and `fstTLS12`/`fstTLS1_2` are spelling aliases. A configured TLS label does not guarantee that the installed protocol stack or remote peer permits it.
- `flsOK` has display wording `Successful`, while the general VxData status family uses code `Success`. Other lifecycle status families reuse ordinals differently.
- `TFieldType` describes stored/provider metadata. Field classes, provider support, size, precision and conversion rules still determine what can be read or written.
- `TIFException` identifies PascalScript failures. Some names preserve upstream capitalization (`Er...`) and all should be copied exactly as displayed.
- Boolean `True` and `False` must not be substituted for same-valued business constants such as `Status_Success` or `Status_NotSet`.
- XML, HTTP and mail members expose the versions/types compiled into Velox; they are not a complete catalogue of newer standards.

Reading an enum member is constant-time and side-effect free. Effects, validation and errors occur when a consumer uses it—for example, opening a transport, locating a dataset record or serializing a packet. Each child page documents that terminal path and its quirks.

**External references**

- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Simple_Types_(Delphi)#Enumerated_Types)
- [Embarcadero set types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Structured_Types_(Delphi)#Sets)
- [Free Pascal ordinal and enumerated types](https://www.freepascal.org/docs-html/ref/refsu4.html)
- [Free Pascal set types](https://www.freepascal.org/docs-html/ref/refsu16.html)

<small>Created 2026-07-15</small>
