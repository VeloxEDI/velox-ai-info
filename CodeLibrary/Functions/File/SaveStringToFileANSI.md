---
title: "SaveStringToFileANSI"
description: "Creates or replaces a file with BOM-free text encoded using the system ANSI code page."
sidebar_position: 45
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - text
  - ansi
  - code page
  - destructive
---

```Delphi
Procedure SaveStringToFileANSI( const aContents, aFileName : string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  SaveStringToFileANSI('Fictional legacy payload',
    'C:\Fictional\Outbound\legacy-message.txt');
end;
```

### Usage

`SaveStringToFileANSI` creates or replaces a file with BOM-free text encoded using the system ANSI code page.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aContents` | `string`, `const` | Velox Unicode text to convert through the Velox host's system ANSI code page. |
| `aFileName` | `string`, `const` | Destination path; its parent directory must already exist. |

**Returns**

This procedure has no return value. Normal return does not prove that all encoded bytes were written.

**Errors**

File-construction and encoding/allocation exceptions propagate. Velox write failure may instead be reduced to an ignored zero/short count and return normally. Verify critical output independently.

**Usage notes**

Use ANSI only for a governed legacy format that names the expected code page operationally. Prefer UTF-8 for portable new files.

### Additional Technical Info
`SaveStringToFileANSI` creates or replaces a file with text encoded using Delphi's system ANSI code page. It writes only encoded content bytes—no BOM or length prefix. The procedure directly replaces the destination and does not reliably report a zero or short terminal write.

The example targets fictional data/path and would replace that file. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The direct runtime pointer calls `vxFiles.SaveStringToFile(aContents, aFileName, TEncoding.ANSI)`. It immediately creates/truncates an exclusive `TFileStream`, then `vxStream.StringToFileStream` obtains the encoded bytes through `GetBytes`, sets position zero, calls `TStream.Write` once and ignores the returned count, then seeks back to zero. A `finally` block closes the file.

Installed `THandleStream.Write` maps an operating-system write failure to a zero result rather than raising. Because the helper ignores that result, zero/short writes can return normally.

**Edge cases and quirks**

- On Windows, the process-wide ANSI singleton captures `GetACP` when first created. The same Unicode text can produce different bytes on hosts with different system code pages.
- Characters not representable by the selected code page can be substituted or otherwise follow Windows permissive conversion behaviour; the routine is not a lossless Unicode writer.
- Empty text still creates/truncates a zero-byte file.
- Destination truncation occurs before encoding/allocation. A later conversion exception leaves the old file lost.
- Line endings, embedded U+0000 characters and other content are encoded as supplied; no normalisation is performed.
- Replacement is not atomic and there is no size, round-trip, checksum or durability verification.
- An existing Windows symbolic-link path is followed by the underlying `CREATE_ALWAYS` open, so its target is truncated.

**Side effects**

Creates or irreversibly replaces the file and applies host-dependent lossy encoding where the text exceeds the ANSI repertoire.

**Performance and concurrency**

The complete encoded byte array coexists with the source string. Writing is synchronous and the destination is exclusive only while open; direct truncation provides no rollback or atomic publication.

**Related entries**

- [`LoadFileToStringANSI`](LoadFileToStringANSI.md) decodes through the system ANSI code page.
- [`SaveStringToFileUTF8`](SaveStringToFileUTF8.md) writes portable BOM-free UTF-8.
- [`SaveStringToFile`](SaveStringToFile.md) is intended to use this Windows default but currently has an unsafe script adapter.

**External references**

- [Embarcadero `TEncoding.ANSI`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ANSI), [`TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TStream.Write`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Write) - the exact encoding and ignored-count write APIs.
- [Free Pascal `TEncoding.ANSI`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.ansi.html) and [`TStream.Write`](https://www.freepascal.org/docs-html/rtl/classes/tstream.write.html) - compatible context; current code-page capture and silent-write behaviour follow Delphi/Velox source.
- [Microsoft `CreateFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew) - the direct create/truncate, exclusive-share and link-following terminal below Delphi.

<small>Created 2026-07-15</small>
