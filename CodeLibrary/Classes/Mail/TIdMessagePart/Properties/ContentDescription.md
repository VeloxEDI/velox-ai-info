---
title: ContentDescription
description: Reads or replaces the first Content-Description header value without encoding or validating the descriptive text.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, content-description, header]
---

```Delphi
property ContentDescription: string read write;
```

### Example

```Delphi
procedure Describe(const Part: TIdMessagePart);
begin
  Part.ContentDescription := 'Daily integration result';
end;
```

### Usage

`ContentDescription` reads or replaces the first Content-Description header value without encoding or validating the descriptive text.

### Additional Technical Info
`ContentDescription` is a convenience view over the first `Content-Description` entry in the part's owned header list.

Nonempty assignment adds or replaces that first entry. Empty assignment deletes only the first matching entry; if duplicate headers exist, a later one can become visible. Reading a missing header returns empty, which is indistinguishable from an explicitly absent description.

The setter does not MIME-encode non-ASCII text, unfold/validate external input or change the part body/type. Header folding and final encoding are downstream concerns. Avoid control characters and externally supplied raw header content unless it has been sanitized by the calling application.

Native part `Assign` copies the complete Headers list, including this value. Header lookup/update is linear in header count and can trigger header-list mutation state; the part is not thread-safe.

The source-reviewed example uses simple ASCII and was not sent.

**External references**

- [Indy upstream: `TIdMessagePart.GetContentDescription`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - exact header mapping.
- [RFC 2045 section 8](https://www.rfc-editor.org/rfc/rfc2045.html#section-8) - Content-Description field.

<small>Created 2026-07-15</small>
