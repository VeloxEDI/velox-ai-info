---
title: ProcessXSDSchema
description: Returns the configured XSD path after replacing only its default-directory token with Velox's application Schema folder.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-definition, xsd-schema, path]
---

```Delphi
function ProcessXSDSchema: String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Source <> nil then
    Value := Source.ProcessXSDSchema
  else
    Value := '';
end;
```

### Usage

`ProcessXSDSchema` returns the configured XSD path after replacing only its default-directory token with Velox's application Schema folder.

**Directory side effect**

Resolving a present default token obtains the application Schema folder through a helper that attempts to create that base directory when absent. This can perform filesystem I/O even though the method returns only a string. It does not create the XSD itself.

**Downstream XML behaviour**

For an XML File Definition, save validation rejects a nonblank resolved schema that does not exist. Runtime schema loading:

1. returns immediately for non-XML definitions or an already populated schema cache;
2. logs failure for a blank/missing schema;
3. loads it with MSXML and configured external-resolution behaviour;
4. raises/logs parse detail on invalid XML Schema;
5. captures target namespace and adds the document to the cache; and
6. derives single/multiple root-node state.

Consequently, a nonblank return value is not evidence that the schema exists, is safe, parsed successfully or matches the definition.

**Security and safety**

- XSDs are trusted executable-like configuration: imports/external resolution can cause additional resource access when enabled.
- Path traversal, mapped drives and UNC/local permissions are evaluated in Velox process identity.
- Loading/parsing is blocking and cached per FileDef instance after success.
- Configuration/schema-cache access is mutable and should not be raced across threads.

### Additional Technical Info
`ProcessXSDSchema` resolves the File Definition's configured XML Schema Definition (XSD) path.

**Implementation**

The method copies the stored XSD string. When `<DEFAULTDIR>` is present (case-insensitive Velox tag matching), it replaces the token with the application's shared Schema path.

No action-local, data-field or general/system tags are processed. The method does not validate XSD syntax, check that the result is a file, load/cache the schema, canonicalise a relative path or update FileType.

**Related entries**

- [`TvxFileDef`](../../TvxFileDef.md) — schema objects and execution lifecycle.
- [`ProcessExcelTemplate`](ProcessExcelTemplate.md) — analogous Excel-folder resolution.
- [`FileType`](../Properties/FileType.md) — XML branch selection.

<small>Created 2026-07-15</small>
