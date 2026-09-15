---
title: AttachmentTempDirectory
description: Selects the process-local directory used when received file attachments are materialized, without creating or validating that directory.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, attachment, temporary-file, directory, security]
---

```Delphi
property AttachmentTempDirectory: string read write;
```

### Example

```Delphi
procedure SelectAttachmentWorkspace(const ControlledDirectory: string);
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  // The directory must already exist and be writable by the Velox process.
  Msg.AttachmentTempDirectory := ControlledDirectory;
  Msg.LoadFromFile('C:\VeloxData\Inbound\message.eml', False);
end;
```

### Usage

`AttachmentTempDirectory` selects the process-local directory used when received file attachments are materialized, without creating or validating that directory.

### Additional Technical Info
`AttachmentTempDirectory` selects the directory passed to Indy's temporary-filename generator when a received attachment is decoded into a [`TIdAttachmentFile`](../../TIdAttachmentFile.md). An empty string leaves temporary placement to the underlying Indy/system default.

The setter only applies Indy's trailing-path-delimiter removal. It does not expand a relative path, canonicalise it, create the directory, test permissions, reserve a filename or verify free space. Failures occur later when attachment decoding attempts to create a file, after the source stream and message may already have been partially processed.

#### Lifetime and cleanup

[`Clear`](../Methods/Clear.md), [`ClearHeader`](../Methods/ClearHeader.md) and the clear-first [`LoadFromStream`](../Methods/LoadFromStream.md) path do **not** reset this property. Set it before loading; the retained setting controls attachment files created during that load.

Decoded file attachments mark their generated backing files as temporary. Clearing [`MessageParts`](MessageParts.md), clearing the message or destroying it destroys those attachments and attempts to delete their current stored paths. Do not point the setting at an uncontrolled shared directory, and do not rewrite a received attachment's `StoredPathName`, because its hidden cleanup flag follows the object rather than the original path.

Paths are interpreted under the Velox process identity and working environment. Prefer an existing, access-controlled absolute directory dedicated to the operation. Treat filenames and errors as sensitive host information, and bound attachment size/count upstream because this property provides no quota or cleanup-on-process-crash guarantee.

The example performs no preflight and is illustrative only; the documentation workflow did not access the filesystem or parse a message.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - property normalization and message lifetime.
- [Indy upstream: `IdAttachmentFile.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdAttachmentFile.pas) - receive-time temporary-file creation and destruction.
- [Embarcadero DocWiki: `System.SysUtils.ExcludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.ExcludeTrailingPathDelimiter) - Delphi path-delimiter semantics; Indy uses its corresponding helper.
- [Free Pascal: `ExcludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/excludetrailingpathdelimiter.html) - compatible path helper reference; Velox executes Delphi/Indy.

<small>Created 2026-07-15</small>
