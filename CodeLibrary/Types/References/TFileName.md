---
title: TFileName
description: "Names a Unicode String intended for a file path while adding no normalization, existence, access, or security guarantee."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, reference, filename, path, string, security]
---

```Delphi
TFileName = String
```

### Example

```Delphi
procedure GetLeafName(const Path: TFileName; var Leaf: String);
begin
  Leaf := ExtractFileName(Path);
end;
```

### Usage

`TFileName` names a Unicode String intended for a file path while adding no normalization, existence, access, or security guarantee.

#### Path interpretation belongs to the operation

Whether text names a file, directory, URL, mask or non-filesystem identifier is determined by the receiving function. The alias does not:

- make a relative path absolute or anchor it to a Velox folder;
- expand environment variables or Velox tags;
- normalize `.`/`..`, separators, casing, Unicode or a UNC/device prefix;
- test existence, file-versus-directory kind, sharing state or permissions;
- follow or reject symbolic links and Windows reparse points;
- reserve the path against a create/delete/replace race; or
- grant the service account access.

Some extraction helpers only split text and perform no I/O. File functions execute under the running Designer/service account and have their own sharing, overwrite, encoding, error and side-effect contracts. Read the exact operation page rather than inferring behavior from this parameter type.

#### Security guidance

For partner-controlled names, define an allowed root and operation-specific extension/name policy. Resolve or construct the candidate with an approved helper, then verify that the effective destination remains under the allowed root. Be aware that text-only prefix checks can be defeated by `..`, alternate separators, case rules, UNC/device forms, reparse points and time-of-check/time-of-use races.

Do not log full paths when they can contain customer identifiers, credentials, temporary secrets or private directory structure. An empty value is not automatically the current directory; its meaning is operation-specific and can be destructive if treated as a default.

### Additional Technical Info
The SysUtils type importer registers `TFileName` as the normal PascalScript [`String`](../DataTypes/String.md). The current String is a managed UnicodeString. `TFileName` communicates intent to a reader and matches Delphi declarations; it does not create a distinct runtime representation or automatically call any path routine.

Assignment and parameter passing use normal managed-string behavior. A value can be empty and can contain relative segments, mixed separators, wildcard characters, reserved device names, embedded NUL, invalid filesystem characters or text longer than a target API accepts. The alias validates none of these.

**Related Code Library entries**

- [String](../DataTypes/String.md) - exact managed Unicode representation.
- [File functions](../../Functions/File.md) - operation-specific path parsing, I/O, side effects and failure behavior.
- [ExtractFileName](../../Functions/File/ExtractFileName.md) - text-only leaf-name extraction used in the example.

**External references**

- [Embarcadero TFileName](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TFileName) - Delphi semantic String alias.
- [Free Pascal TFileName](https://www.freepascal.org/docs-html/rtl/sysutils/tfilename.html) - compatible semantic filename type.
- [Microsoft naming files, paths, and namespaces](https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file) - Windows path forms and reserved-name context.

<small>Created 2026-07-15</small>
