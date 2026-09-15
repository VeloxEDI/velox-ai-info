---
title: Stream
description: Source-backed guidance for abstract, memory, file and text-backed byte streams exposed through Velox's PascalScript adapter.
sidebar_position: 10
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, classes, stream, bytes, memory, files, encoding]
---

The Stream branch exposes Delphi byte-stream classes through a Velox-specific PascalScript adapter. Every stream has a mutable cursor, but storage, ownership, supported operations and error behavior depend on the concrete descendant.

## Choosing a stream

| Requirement | Class | Important boundary |
|---|---|---|
| Accept a stream supplied by another API | [`TStream`](Stream/TStream.md) | Abstract borrowed contract; actual capabilities and owner come from the provider. |
| Build or copy bytes in memory | [`TMemoryStream`](Stream/TMemoryStream.md) | Script-created and caller-owned; resizing can allocate and exposes raw-memory semantics. |
| Read or write an operating-system file | [`TFileStream`](Stream/TFileStream.md) | Constructor mode controls open/create/truncate/share behavior and grants filesystem authority. |
| Start from or return text-backed bytes | [`TStringStream`](Stream/TStringStream.md) | Initial Delphi String is encoded with `TEncoding.Default`, not guaranteed UTF-8. |

Do not instantiate abstract TStream. A stream created explicitly by a script must normally be freed in `try..finally`. A stream passed into a callback or returned as a child of another object is normally borrowed; freeing it can corrupt its owner. Follow the member/provider page when ownership is not explicit.

## Velox byte-buffer contract

The adapter declares `Read`, `Write`, `ReadBuffer` and `WriteBuffer` with a PascalScript `String` buffer while the native methods still consume untyped memory. `Count` is bytes, not characters. These methods do not encode, decode or resize the String.

Before reading, allocate enough writable String backing storage. Before writing, ensure Count does not exceed the bytes actually present. Passing an empty/short string with a larger Count can write outside managed storage or disclose/read unrelated memory. Prefer stream-to-stream [`CopyFrom`](Stream/TStream/Methods/CopyFrom.md) or documented conversion helpers when possible.

`Read`/`Write` can transfer fewer bytes and return the actual count. `ReadBuffer`/`WriteBuffer` demand the exact count but can already have advanced the cursor or changed storage before raising. None of these operations provides rollback.

## Cursor and size limits

Native Delphi `Position` and `Size` are Int64. Velox's runtime helpers copy those properties through signed 32-bit `LongInt`, while `Seek` and `CopyFrom` retain Int64 arguments/results. Large streams can therefore be seekable through methods but unsafe to inspect or set through the properties. Keep property-based access within `-2,147,483,648..2,147,483,647` and avoid assuming a wrapped/truncated value is valid.

All reads/writes/copies start at a cursor defined by the relevant method. Some load/copy helpers rewind sources; ordinary I/O does not. Save operations do not universally truncate a destination stream, so overwrite-at-position-zero can leave a stale tail unless the specific destination is cleared/resized first.

## Concrete storage hazards

`TMemoryStream.LoadFromStream` replaces logical content but leaves the destination cursor at the end; direct Size growth can expose uninitialized bytes until overwritten. `TFileStream` mode/share flags determine whether it opens, creates or truncates and how it conflicts with other handles. Filesystem calls are synchronous and partial files can remain after failure.

`TStringStream` is not the preferred way to guarantee an interoperable wire encoding because its exposed constructor uses the host default encoding. Use explicit Velox conversion/encoding functions and a byte stream for protocols requiring UTF-8 or another fixed charset.

Streams and cursors are not thread-safe. Do not share one instance across concurrent flows without external serialization. Validate untrusted lengths before allocating/copying and enforce limits upstream.

## External references

- [Embarcadero TStream](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream), [TMemoryStream](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream), [TFileStream](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream) and [TStringStream](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStringStream) - Delphi runtime contracts.
- [Free Pascal Streams](https://www.freepascal.org/docs-html/rtl/classes/tstream.html) - compatible model and comparison reference; Velox follows the shipped Delphi implementation where behavior differs.

<small>Created 2026-07-15</small>
