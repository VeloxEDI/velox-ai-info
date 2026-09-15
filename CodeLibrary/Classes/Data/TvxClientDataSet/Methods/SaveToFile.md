---
title: SaveToFile
description: Serialises an active Velox client dataset to a newly created or immediately truncated MIDAS packet file.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, client-dataset, packet, file, save]
---

```Delphi
procedure SaveToFile(const FileName: string; Format: TDataPacketFormat)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // The path is fictional. Any existing file at this path is overwritten.
  DATA1.SaveToFile('C:\VeloxData\FictionalOutput.xml', dfXMLUTF8);
  Value := True;
end;
```

### Usage

`SaveToFile` serialises an active Velox client dataset to a newly created or immediately truncated MIDAS packet file.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string` | Destination path opened in Velox process identity. A relative path uses the process's current directory. The method does not create parent directories, validate an allow-list or make a backup. |
| `Format` | `TDataPacketFormat` | Requested packet representation: `dfBinary`, `dfXML` or `dfXMLUTF8`. A `.xml` filename can override `dfBinary` as described below. |

**Errors and destructive failure states**

Invalid paths, missing directories, permissions, locks, disk capacity, pending-edit validation, provider activity, allocation, MIDAS serialisation and file writes can raise. Because `fmCreate` runs before edit validation and serialisation, any pre-existing target can already be zero-length or partially rewritten when an exception occurs.

the packet writer calls `TStream.Write` once and ignores the number of bytes returned. A file-stream OS error normally raises or reports failure by the stream, but any short write that returns without raising is not detected by this method. No success value confirms the final file length or integrity.

**Security and safety**

The script can overwrite any file writable by the Velox process account. Use a governed output directory, fixed trusted filenames where possible and operating-system ACLs as the real boundary.

Time and output size are linear in the serialised packet; serialisation also creates a complete in-memory packet before writing. Do not mutate the dataset concurrently, and do not let another operation consume the destination until the file stream has closed successfully.

### Additional Technical Info
`SaveToFile` serialises the client dataset as a MIDAS packet in binary, XML or UTF-8 XML form. It creates a new file or truncates an existing file, then delegates packet generation to `SaveToStream`.

The example writes a fictional path and was source-reviewed without being run. It is intentionally side-effectful: never use an existing or untrusted path unless replacement is intended.

**Signature**

The native Delphi method provides defaults, but the Velox script registration does not. Scripts must pass both arguments.

**Format selection**

| Value | Saved representation |
|---|---|
| `dfBinary` | Compact binary MIDAS packet, except that a case-insensitive `.xml` extension changes it to `dfXML`. |
| `dfXML` | XML packet in the MIDAS XML representation, including its extended-character escaping rules. |
| `dfXMLUTF8` | XML packet with extended characters represented using UTF-8. |

The `.xml` override applies only when the passed format is `dfBinary`. It does not change explicit `dfXMLUTF8`. For every other extension, including no extension, the requested format is used. Filename extensions are therefore hints on save and are not reliable format validation.

**Implementation and active-state gate**

The inherited method proceeds only when the dataset is active or has a live, non-nested internal DSBase. In the normal inactive state DSBase is nil, so the call silently does nothing: it returns no status and creates no file. An inactive saved packet that `SaveToStream` could write is not enough to pass this file-method gate.

When the gate passes, the method:

1. Resolves the mandatory script filename.
2. creates or truncates it immediately through `TFileStream.Create(FileName, fmCreate)`;
3. applies the `.xml`/`dfBinary` override; and
4. calls `SaveToStream`, then always frees the private stream.

There is no temporary file, atomic rename or rollback.

**Dataset and provider effects**

Packet generation calls `CheckBrowseMode`, so a pending edit/insert can be posted and validated after the destination has already been truncated. The inherited terminal can fetch remaining provider rows when on-demand provider fetching is configured. Normal `TvxClientDataSet` construction disables FetchOnDemand and its normal Velox activation detaches the SQL provider, so it ordinarily serialises the complete current in-memory snapshot.

The saved packet includes client-dataset schema and row representation rather than a simple flat export. Saving does not apply updates, execute database writes or commit an external transaction.

**Related entries**

- [`SaveToStream`](SaveToStream.md) is the delegated packet writer and explains browse-state and current-position behaviour.
- [`LoadFromFile`](LoadFromFile.md) loads a compatible packet and replaces the dataset.
- [`TDataPacketFormat`](../../../../Types/Enumerations/TDataPacketFormat.md) defines the three script enum values.

**External references**

- [Embarcadero DocWiki: `TCustomClientDataSet.SaveToFile`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TCustomClientDataSet.SaveToFile) - the inherited file writer registered by Velox.
- [Embarcadero DocWiki: `TDataPacketFormat`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TDataPacketFormat) - authoritative meanings of the packet representations.
- [Embarcadero DocWiki: `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create) - establishes `fmCreate` replacement behaviour.
- [Free Pascal: `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html) - compatible file-create reference; it does not define the Delphi MIDAS packet format.

<small>Created 2026-07-15</small>
