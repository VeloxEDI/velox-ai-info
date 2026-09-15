---
title: Handle
description: Returns the opaque operating-system handle used by a THandleStream descendant without transferring ownership.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, thandlestream, file, native-handle, lifetime]
---

```Delphi
property Handle: THandle read;
```

### Example

```Delphi
procedure InspectHandle(const Stream: TFileStream; var HandleValue: THandle);
begin
  HandleValue := Stream.Handle;
  // Treat HandleValue as borrowed and valid only while Stream remains alive.
end;
```

### Usage

Returns the opaque operating-system handle used by a THandleStream item without transferring ownership.

- Treat the value as opaque, borrowed and platform-specific. Do not persist it, compare it with business keys or reuse it after the stream is freed.
- Do not close it independently when it belongs to a `TFileStream`; that creates a double-close/reuse hazard.
- Velox operations performed through the handle and stream share state and are not coordinated by this property.

### Additional Technical Info
`Handle` is declared by hidden ancestor `THandleStream` and is available on visible [`TFileStream`](../../../Stream/TFileStream.md) instances. It exposes the native file handle stored in `FHandle`; it is not a Velox record identifier or a portable file name.

#### Source-backed behaviour

The PascalScript runtime helper returns the current native `THandle` value directly. Reading it does not duplicate the operating-system handle, increase its lifetime, change the stream position or transfer responsibility for closing it.

A `THandleStream` constructed around an external handle does not itself add a closing destructor. `TFileStream`, however, overrides destruction and closes a valid handle. Therefore a handle read from a script-created `TFileStream` becomes invalid when that stream is freed. External native operations can also move the shared file pointer or invalidate the handle behind the stream.

#### Related members

Use [`TFileStream.Create`](../../../Stream/TFileStream/Methods/Create.md) to establish the file access/share mode and keep the stream alive for all operations that depend on this handle.

#### Official RTL references

- [Embarcadero: THandleStream.Handle](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.THandleStream.Handle)
- [Free Pascal: THandleStream.Handle](https://www.freepascal.org/docs-html/rtl/classes/thandlestream.handle.html)

<small>Created 2026-07-15</small>
