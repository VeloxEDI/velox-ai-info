---
title: TJSONText
description: Provides the shared object-and-array composition, parsing, file, stream and formatted-output surface used by Velox JSON containers.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, text, object, array, stream]
---

```Delphi
TJSONText = class(TJSONValue)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
  Lines: TJSONArray;
begin
  Document := TJSONObject.Create;
  try
    Document.AddString('reference', 'DEMO-1001');
    Lines := Document.AddArray('lines');
    Lines.AddInteger(2);
    Value := Document.AsDisplayText;
  finally
    Document.Free;
  end;
end;
```

### Usage

`TJSONText` provides the shared object-and-array composition, parsing, file, stream and formatted-output surface used by Velox JSON containers.

### Additional Technical Info
`TJSONText` is the shared native ancestor of [`TJSONObject`](TJSONObject.md) and [`TJSONArray`](TJSONArray.md). It supplies named child creation, object-or-array parsing, destructive loading, UTF-8 output and human-readable formatting. The current generated index deliberately exposes this ancestor and places its inherited members here, even though one importer re-registration labels the class category hidden. These paths are therefore public reference paths; they are not Common navigation.

The native class is abstract because its unregistered `Add(TJSONValue)` and `Erase` primitives must be supplied by a concrete object or array. Do not call inherited `TJSONText.Create`: the base [`TJSONValue.Create`](TJSONValue/Methods/Create.md) constructor cannot classify a raw `TJSONText` instance and raises `EJSONError`. Construct `TJSONObject`/`TJSONArray`, obtain a returned `TJSONText`, or use the parsed factories instead.

#### Generated surface and registration gaps

The generated surface contains:

- owned child composition: [`AddArray`](TJSONText/Methods/AddArray.md), `AddBoolean`, `AddDateTime`, `AddDouble`, `AddGUID`, `AddInt64`, `AddInteger`, `AddNull`, `AddObject`, `AddString` and deep-cloning [`AddText`](TJSONText/Methods/AddText.md);
- parsing/loading: [`CreateFromStream`](TJSONText/Methods/CreateFromStream.md), [`CreateFromString`](TJSONText/Methods/CreateFromString.md), [`LoadFromFile`](TJSONText/Methods/LoadFromFile.md) and [`LoadFromStream`](TJSONText/Methods/LoadFromStream.md);
- output: [`SaveToFile`](TJSONText/Methods/SaveToFile.md), [`SaveToStream`](TJSONText/Methods/SaveToStream.md) and [`AsDisplayText`](TJSONText/Properties/AsDisplayText.md).

The importer also registers `AddEnum`, `AddDate` and `AddTime`, but the generated tree and `_Index.json` contain no paths for them. Native `CreateFromFile` is not registered at all. Treat those four entries as unresolved registration/generator surface, not as implied public contracts.

#### Ownership, dispatch and typed access

A concrete parent owns every child added through this class and recursively frees it on deletion, erase/replacement or parent destruction. Returned children are mutable borrowed references. `AddText` is the exception to transfer semantics: it deep-clones the supplied tree and the parent owns that clone, while the source remains caller-owned.

Several names also exist on descendants. PascalScript selects from the variable's compile-time class, so the static type matters. A `TJSONObject`/`TJSONArray` expression can select its more specific constructor or loader, while a `TJSONText` expression selects the ancestor implementation documented here. This is particularly important for `LoadFromStream`, whose ancestor version erases first, and for the two native class factories that Velox incorrectly exposes as ordinary instance methods.

The Double and Int64 adders return hidden `TJSONNumber`. Its compiler ancestor is incorrectly `TObject`, so that returned expression has no `TJSONValue` surface. `TJSONInteger` similarly exposes its own `Value` but loses generic base members. Ignore those return values or reacquire the inserted node through the parent as `TJSONValue`.

Native objects and arrays override `IsNull`/`NotNull` to return false/true unconditionally. They cannot represent a semantic null container. The inherited `IsNull` setter can still store a private base flag, but the fixed getter means that assignment does not change container reads, conversion or serialization.

Velox's PascalScript runtime additionally registers `NotNull` with the `IsNull` read helper. A script therefore reads both `Container.IsNull` and `Container.NotNull` as `False`, despite native `NotNull=True`. Use `not Container.IsNull` when a positive predicate is needed; do not use the exposed `NotNull` property. Scalar children retain their normal null state, and compact array output versus display output handles a null-marked String differently.

#### Parsing and output boundaries

The reader accepts a first object or array, ignores trailing content and retains the Deltics parser's permissive array, literalized `\uXXXX`, exponent-only number and locale-sensitive decimal defects. Its Unicode decoder does not validate UTF-8 continuation bytes, calculates four-byte UTF-8 incorrectly and reduces decoded UTF-16/UTF-32 code points to one 16-bit `Char`; supplementary-plane characters are corrupted. The generic factories use a checked `TJSONText` cast; scalar input raises and leaks the parsed scalar. `CreateFromString` additionally has a default-code-page-to-UTF-8 mismatch for non-ASCII input.

Generic loading is destructive before validation. Saving buffers the complete document, adds no UTF-8 BOM and offers compact or formatted output. Neither form escapes object field names; String encoding leaves some JSON control characters raw. Compact empty objects emit invalid `}`, whereas formatted empty objects are structurally complete. The class is mutable, recursively allocated and not thread-safe.

**External references**

- [RFC 8259: The JavaScript Object Notation data interchange format](https://www.rfc-editor.org/rfc/rfc8259)
- [Embarcadero class methods](https://docwiki.embarcadero.com/RADStudio/Florence/en/Methods_(Delphi)#Class_Static_Methods)
- [Free Pascal classes](https://www.freepascal.org/docs-html/ref/refch6.html) - compatible Object Pascal context; Velox executes the traced Delphi/Deltics implementation.

<small>Created 2026-07-15</small>
