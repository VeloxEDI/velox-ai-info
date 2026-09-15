---
title: Push
description: Inserts a boundary and native parent-part index at the top of two parallel index-zero stacks used for nested MIME parsing.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, boundary, push, stack]
---

```Delphi
procedure Push(ABoundary: string; AParentPart: Integer);
```

### Example

```Delphi
procedure EnterMultipart(const BoundaryStack: TIdMIMEBoundary);
begin
  BoundaryStack.Push('=_Velox_MIME_1', 0);
end;
```

### Usage

`Push` inserts a boundary and Velox parent-part index at the top of two parallel index-zero stacks used for nested MIME parsing.

### Additional Technical Info
`Push` inserts `ABoundary` at index zero of the boundary list, converts `AParentPart` to decimal text, and inserts that text at index zero of the parallel parent-part list. Index zero is the top, so the newly pushed boundary is immediately returned by [`Boundary`](../Properties/Boundary.md), and [`Count`](Count.md) increases by one.

`ABoundary` is stored exactly as supplied; the method does not add/remove MIME delimiter hyphens, validate RFC syntax, trim whitespace or require a nonempty value. `AParentPart` accepts any `Integer`. Native parsing uses it to associate the nesting level with a message-part index, but that parent value is not exposed to scripts.

The two inserts are separate and have no rollback. If allocation/conversion or the second insertion fails after the first succeeds, the two lists can have different lengths. Avoid catching such an exception and continuing to use the same stack without resetting it.

Insertion at index zero shifts existing entries, making the operation O(depth). It mutates message parser state and is not thread-safe. The source-reviewed example supplies the raw boundary token (without leading `--`) and was not runtime-tested.

**External references**

- [RFC 2046 section 5.1.1](https://www.rfc-editor.org/rfc/rfc2046.html#section-5.1.1) - multipart boundary parameter and delimiter rules.
- [Embarcadero DocWiki: `System.Classes.TStringList.Insert`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList.Insert) - underlying index-zero insertion.
- [Embarcadero DocWiki: `System.SysUtils.IntToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.IntToStr) - parent-index conversion.
- [Free Pascal: `IntToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/inttostr.html) - compatible core conversion reference; Velox uses Delphi.

<small>Created 2026-07-15</small>
