---
title: StoredPathName
description: Gets or directly replaces the local backing path without copying bytes, validating the path or transferring temporary-file cleanup state.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, attachment, path, filesystem, cleanup]
---

```Delphi
property StoredPathName: String read write;
```

### Example

```Delphi
procedure ReportBackingPath(const Attachment: TIdAttachmentFile;
  var Value: Variant);
begin
  // Reading is useful for diagnostics; avoid exposing the path to untrusted output.
  Value := Attachment.StoredPathName;
end;
```

### Usage

`StoredPathName` gets or replaces the local path used for the attachment. Assignment changes only the path text; it does not copy the file, validate the path or transfer temporary-file cleanup responsibility.

#### Critical temporary-file cleanup hazard

Do not assign this property on a received/decoded attachment or on an attachment populated through an load method. Those paths set the hidden temporary flag true. The destructor later calls `DeleteFile(StoredPathName)` using the property's **current** value and ignores the Boolean result.

If a script replaces the path while that flag is true, destruction can delete the newly named unrelated file and leave the original Velox temporary file orphaned. The setter provides no way to clear or transfer the hidden flag. This is both a data-loss and local-authority risk.

The safe pattern is to treat the property as read-only in scripts. To use different bytes, construct/attach a new outgoing attachment through the owning mail API, or copy bytes with the documented load/save methods while preserving the owner and metadata contracts.

### Additional Technical Info
`StoredPathName` is the local path used by [`TIdAttachmentFile`](../../TIdAttachmentFile.md) when it opens, saves or cleans up attachment bytes. It is distinct from inherited `FileName`, which is normally only the display/MIME base name.

For an outgoing attachment created with a path, the property initially contains that argument and later send/save operations read the live file. For content decoded or loaded through [`LoadFromStream`](../../TIdAttachment/Methods/LoadFromStream.md), it contains a Velox-generated system temporary filename.

Reading the property returns the stored String without checking existence, accessibility or ownership. It can disclose local directory names and host layout, so do not place it in customer-facing logs, messages or map output unless that disclosure is explicitly acceptable.

#### Assignment is a raw field write

The setter performs only `Self.StoredPathName := value` against the native field. It does **not**:

- canonicalise, validate or check the path;
- copy, move, open or delete content at assignment time;
- update inherited `FileName`, `ContentType` or other MIME metadata;
- reset [`AttachmentBlocked`](AttachmentBlocked.md);
- change the hidden `FileIsTempFile` cleanup flag; or
- transfer cleanup ownership from an old path to a new path.

Consequently, assigning an outgoing attachment changes which live file future operations read, while its recipient-visible filename and MIME type can still describe the previous path. A missing or inaccessible replacement is accepted immediately and fails only on later access.

#### Paths, races and failures

Paths are resolved by the Velox process identity. Relative paths are dependent on service working context; use controlled absolute paths for outgoing files. Path existence is a race, not a reservation: a file can change between any validation and later send/save.

Property reads and writes allocate only the managed String and perform no direct I/O. Later operations can synchronously read, overwrite or delete the named file. The property and attachment are not thread-safe; never mutate the path while another flow is sending, saving, loading or destroying the item.

The source-reviewed example deliberately reads rather than assigns the path and warns about disclosure. It was not executed by the documentation workflow.

**External references**

- [Indy upstream: `IdAttachmentFile.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdAttachmentFile.pas) - upstream stored-path and temporary-file design; the documented Velox hazards are confirmed against its modified descendant.
- [Embarcadero DocWiki: `System.SysUtils.DeleteFile`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.DeleteFile) - Delphi cleanup primitive called by the destructor.
- [Free Pascal: `DeleteFile`](https://www.freepascal.org/docs-html/rtl/sysutils/deletefile.html) - compatible cleanup reference; Velox executes Delphi and its bundled modified class.

<small>Created 2026-07-15</small>
