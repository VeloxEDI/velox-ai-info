---
title: Boundary
description: Returns the exact boundary string at the top of the MIME stack, or an empty string when no boundary is stored.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, boundary, stack-top]
---

```Delphi
property Boundary: string read;
```

### Example

```Delphi
procedure ReadBoundary(const BoundaryStack: TIdMIMEBoundary;
  var Value: Variant);
begin
  if BoundaryStack.Count > 0 then
    Value := BoundaryStack.Boundary
  else
    Value := '';
end;
```

### Usage

Returns the exact boundary string at the top of the MIME stack, or an empty string when no boundary is stored.

### Additional Technical Info
`Boundary` returns the string at index zero of the internal boundary list. Because [`Push`](../Methods/Push.md) inserts at zero, this is the most recently pushed boundary and therefore the current MIME nesting level.

When the list is empty, the getter returns `''` rather than raising. `Push` also permits an actual empty string, so `Boundary = ''` does not prove the stack is empty. Check [`Count`](../Methods/Count.md) when that distinction matters.

The value is returned exactly as stored. It is the MIME boundary token, not a complete delimiter line: code constructing wire delimiters is responsible for the leading `--` and the closing suffix where applicable. This property performs no RFC validation, parsing or normalization.

The getter reads only the boundary list and does not verify the parallel native parent-part stack. Reading is constant-time and side-effect free, but concurrent mutation is unsupported. The source-reviewed example performs the unambiguous count check and was not runtime-tested.

**External references**

- [RFC 2046 section 5.1.1](https://www.rfc-editor.org/rfc/rfc2046.html#section-5.1.1) - boundary delimiter construction and matching.
- [Embarcadero DocWiki: `System.Classes.TStrings.Strings`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Strings) - indexed string read used by the getter.
- [Free Pascal: `TStrings.Strings`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.strings.html) - compatible core indexed property; Velox uses Delphi.

<small>Created 2026-07-15</small>
