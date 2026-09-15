---
title: LoadFromFile
description: Opens a JSON file for shared reading, then destructively replaces the receiver through the ancestor's erase-first stream loader.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, loadfromfile, file, destructive, parsing]
---

```Delphi
procedure LoadFromFile(const aFileName: String);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Document.LoadFromFile('C:\Fictional\Inbound\payload.json');
    Value := Document.AsDisplayText;
  finally
    Document.Free;
  end;
end;
```

### Usage

`LoadFromFile` reads JSON from a file and replaces the current value. If the file is empty or the read or parse fails, the previous value has already been cleared.

### Additional Technical Info
`LoadFromFile` opens `aFileName` through `TFileStream` using `fmOpenRead or fmShareDenyWrite`, passes that stream to the non-virtual ancestor [`LoadFromStream`](LoadFromStream.md), and always frees the file stream. Other readers can normally open the file, while writers are denied during this call.

Opening happens before the receiver is erased. A missing/inaccessible file, sharing violation or open-time permission error therefore preserves existing children. After a successful open, the loader immediately calls the concrete receiver's `Erase`; empty input, decoding/parsing failure, nil/scalar result or copy failure occurs after prior content has been destroyed.

Same-kind object-to-object or array-to-array input is deep-copied. Opposite structured types are not rejected: the implementation reinterprets the source through the coincident object/array list layout, so object fields loaded into an array retain names that array output ignores, while array values loaded into an object become blank-name fields. A scalar source is unsafely treated as a container and can raise an access violation or otherwise fail unpredictably.

The reader detects five Unicode BOM forms and defaults BOM-less files to UTF-8, but its decoder does not validate continuation bytes and corrupts supplementary-plane UTF-8/UTF-16/UTF-32 characters through incorrect arithmetic/16-bit truncation. It parses one value and ignores trailing content, retaining all documented parser defects. Copying can leave partially populated new state if recursive cloning fails.

Paths are resolved in the Velox process/service account and working-directory context. This method adds no allow-list, sandbox, path normalization policy, size limit or audit step. Use only trusted configured paths and avoid exposing arbitrary script/user input as `aFileName`. The entire parsed tree is held in memory.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TFileStream.Create)
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html) - analogous open/share context; Velox uses Delphi flags.
- [RFC 8259 section 8.1: UTF-8 JSON](https://www.rfc-editor.org/rfc/rfc8259#section-8.1)

<small>Created 2026-07-15</small>
