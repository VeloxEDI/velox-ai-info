---
title: LoadFromFile
description: Opens a file for shared reading and replaces the pending HTTP request body with its complete current byte content.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, file, request-body, filesystem]
---

```Delphi
procedure LoadFromFile(const aFileName: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.LoadFromFile('C:\VeloxData\outbound\request.json');
  Http.Header['Content-Type'] := 'application/json';
  Http.Post('https://api.example.invalid/import');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`LoadFromFile` opens a file for shared reading and replaces the pending HTTP request body with its complete current byte content.

### Additional Technical Info
`LoadFromFile` opens `aFileName` with read access and `fmShareDenyNone`, then clears the internal pending-request [`Content`](../Properties/Content.md) and copies the complete file from position zero. A successfully opened empty file clears the pending body.

The open happens **before** the body is cleared. If the path is missing, inaccessible or cannot be opened, the exception propagates and earlier pending content remains. Once open succeeds, a later allocation/read exception can leave empty or partially replaced content. The file stream is always freed.

The path is interpreted by the Velox process account and current Windows environment. It can be absolute or relative; no workspace, extension, size, symlink/reparse-point or allowlist restriction is applied. Do not let untrusted data select arbitrary local/network paths. The shared-read mode permits another process to modify the file during copying, so this is not an atomic snapshot against concurrent writers.

Body-capable methods send the internal stream only when its size is positive. The complete pending body is normally cleared after the request, including after network errors, while an authentication preflight exit can preserve it. This method does not infer or set the media type from the filename.

Copying duplicates the entire file in memory before any network send. Check file size and operational limits before loading large inputs.

**External references**

- [Embarcadero DocWiki: `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create)
- [Embarcadero DocWiki: `TStream.CopyFrom`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.CopyFrom)
- [Free Pascal: `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html)
- [Free Pascal: `TStream.CopyFrom`](https://www.freepascal.org/docs-html/rtl/classes/tstream.copyfrom.html)

<small>Created 2026-07-15</small>
