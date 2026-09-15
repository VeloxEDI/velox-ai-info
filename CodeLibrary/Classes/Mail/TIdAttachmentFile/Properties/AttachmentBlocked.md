---
title: AttachmentBlocked
description: Reports the stored result of the last temporary-file finalisation check for antivirus removal, rather than current backing-file availability.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, attachment, antivirus, blocked, temporary-file]
---

```Delphi
property AttachmentBlocked: Boolean read;
```

### Example

```Delphi
procedure SaveReceivedAttachment(const Attachment: TIdAttachmentFile;
  const ApprovedDestination: String);
begin
  if Attachment.AttachmentBlocked then
    Exit;

  Attachment.SaveToFile(ApprovedDestination);
end;
```

### Usage

`AttachmentBlocked` reports whether the last temporary-file finalisation check found that antivirus software had removed the attachment. It does not recheck whether the file currently exists.

### Additional Technical Info
`AttachmentBlocked` exposes a Boolean field on [`TIdAttachmentFile`](../../TIdAttachmentFile.md). Scripts can read but not assign it.

The name is narrower than a general security verdict. The field is set when a file-backed attachment finishes [`LoadFromStream`](../../TIdAttachment/Methods/LoadFromStream.md): Velox closes the just-written temporary stream and evaluates `not FileExists(StoredPathName)`. True therefore means that the expected temporary path was absent at that exact post-close check, which the implementation treats as likely on-access antivirus removal or blocking.

The property does not report scan engine identity, malware classification, quarantine location or a fresh filesystem test. False does not certify the bytes as safe or complete. A partial-copy failure can leave a file present and the field false. Apply the organisation's normal content-security controls independently.

#### Load policy and later save behavior

When the finalisation check yields true, the owning `TIdMessage` decides whether the load raises `EIdMessageCannotLoad`. If its native `ExceptionOnBlockedAttachments` setting is false, finalisation returns without raising and leaves the item in the message with `AttachmentBlocked=True`. That policy property is not part of this generated script surface.

Overridden [`SaveToFile`](../../TIdAttachment/Methods/SaveToFile.md) checks this field. When true, it does not create the requested destination; it sends the owner message a `BLOCKED BY ANTIVIRUS: <destination>` save notification and returns normally. A detached item without its expected owner can fail while making that callback.

Inherited [`SaveToStream`](../../TIdAttachment/Methods/SaveToStream.md) does not check the field. It attempts to open the backing path and normally raises a file-open error if the temporary file is gone. These two save methods therefore have intentionally different observable failure contracts.

#### Stale-state limits

The constructor initializes the field to false. It is not recomputed whenever the filesystem changes and is not reset by assigning [`StoredPathName`](StoredPathName.md). Important consequences include:

- an outgoing attachment whose source was later deleted can still report false;
- a previously blocked item can still report true after `StoredPathName` is pointed at another file;
- a file can disappear after a false finalisation check; and
- a file can exist while containing incomplete or subsequently replaced content.

Use the property to follow the decoder's recorded block path, not as the only existence, integrity or malware check. Even after a false result, handle save/open exceptions and verify required output.

Reading the Boolean is constant-time and does no I/O. The surrounding attachment is mutable and not thread-safe; concurrent loading or path mutation can make a value immediately stale.

The source-reviewed example uses the flag as an early guard and still relies on the save call's error contract. It was not executed by the documentation workflow.

**External references**

- [Indy upstream: `IdAttachmentFile.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdAttachmentFile.pas) - upstream temporary-file and block-indicator context; Velox's modified save notification/error behavior is source-reviewed separately.
- [Embarcadero DocWiki: `System.SysUtils.FileExists`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.FileExists) - Delphi existence test underlying the stored flag.
- [Free Pascal: `FileExists`](https://www.freepascal.org/docs-html/rtl/sysutils/fileexists.html) - compatible existence-test reference; it is not proof of Velox runtime behavior beyond the traced source.

<small>Created 2026-07-15</small>
