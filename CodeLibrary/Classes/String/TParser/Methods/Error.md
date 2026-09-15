---
title: Error
description: Exposes a legacy Integer declaration whose direct runtime binding is incompatible with the current Delphi TParser Error overloads.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, error, incompatibility, unsafe, resource-string]
---

```Delphi
procedure Error(Ident: Integer);
```

### Example

```Delphi
procedure RejectCurrentToken(Parser: TParser);
begin
  if Parser = nil then Exit;

  // Do not call Parser.Error(Integer) in current Velox builds.
  Parser.ErrorStr('The current token is not permitted here');
end;
```

### Usage

Do not call `Error(Integer)` from a current Velox script because its exposed parameter is incompatible with the executable method. Use [`ErrorStr`](ErrorStr.md) with an explicit message when the script needs to reject parser input.

### Additional Technical Info
**Do not call this method from a Velox script.** The declaration retained by the PascalScript compiler importer does not match the current native API bound by the runtime importer.

The script surface declares an `Integer`. The installed RAD Studio 37 `TParser` instead has overloaded `Error(const Ident: string)` and `Error(const IdentRes: PResStringRec)` methods. Velox's runtime importer directly registers `@TParser.Error`; it does not provide an adapter that translates a stable numeric identifier into either modern parameter type.

Consequently, the Integer cannot be documented as a supported error number or resource identifier. Passing it across a mismatched String/pointer ABI can produce an invalid message, access invalid memory or otherwise depend on compiler/platform overload resolution. The risk also changes between 32-bit and 64-bit pointer sizes.

Use [`ErrorStr`](ErrorStr.md) with an explicit message instead. That route has a source-compatible String declaration and raises the same parser exception format with [`SourceLine`](../Properties/SourceLine.md). Built-in validation methods such as [`CheckToken`](CheckToken.md) are also safe because their internal native calls select their own correct resource-string overload.

This page records a current product-source compatibility defect rather than promising legacy behavior. A future importer can replace Error(Integer) with a correctly typed wrapper; until then it remains visible but unsupported.

The example is source-reviewed only; the incompatible method was not executed.

**External references**

- [Embarcadero: `TParser.Error`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.Error) - current native overloads.
- [Free Pascal: `TParser`](https://www.freepascal.org/docs-html/rtl/classes/tparser.html) - compatible parser error concept; signatures differ by RTL.

<small>Created 2026-07-15</small>
