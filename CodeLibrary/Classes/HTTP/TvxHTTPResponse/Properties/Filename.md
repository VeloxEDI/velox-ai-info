---
title: Filename
description: Extracts the conventional filename parameter without extended decoding, URL fallback or filesystem sanitisation.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, filename, content-disposition, security]
---

```Delphi
property Filename: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  SuggestedName: string;
begin
  Http.Get('https://api.example.invalid/v1/export');
  SuggestedName := Http.Response.Filename;
  { Display or validate it; never pass it directly to a file API. }
  Value := SuggestedName;
end;
```

### Usage

Extracts the conventional filename parameter without extended decoding, URL fallback or filesystem sanitisation.

### Additional Technical Info
`Filename` extracts the conventional `filename` parameter from the first raw `Content-Disposition` response field using Indy's parameter parser. Quoted conventional values are supported. If the field or parameter is absent, the result is `''`.

The helper has important limits:

- it does not decode the RFC 5987/8187 extended `filename*` parameter;
- it does not fall back to the final request URL (the apparent URL fallback in source is commented out);
- it does not choose a basename, remove directory components or normalise Unicode;
- it does not reject control characters, reserved names or traversal sequences; and
- it does not prove that the body is safe or complete.

Treat the result as an untrusted display suggestion only. If a workflow writes [`Content`](Content.md) to disk, choose an application-controlled destination, map or generate a safe name, enforce an allowed extension and directory, and preserve the remote value separately only when required for audit. Never concatenate this property directly onto a filesystem path.

Repeated `Content-Disposition` fields use the first named value. The result can be stale if a new request fails before Indy receives headers. Consult [`ContentDisposition`](ContentDisposition.md) or the raw [`Header`](Header.md) for diagnostics, while applying the same trust boundary.

**External references**

- [RFC 6266: Content-Disposition in HTTP](https://www.rfc-editor.org/rfc/rfc6266)
- [RFC 8187: Character encoding and language for HTTP field parameters](https://www.rfc-editor.org/rfc/rfc8187)
- [Microsoft file and path naming rules](https://learn.microsoft.com/windows/win32/fileio/naming-a-file)

<small>Created 2026-07-20</small>
