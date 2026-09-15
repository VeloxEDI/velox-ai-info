---
title: TokenInt
description: Parses current token text with Delphi's Int64 converter but exposes only a signed 32-bit LongInt result to Velox scripts.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, integer, int64, longint, narrowing, hexadecimal]
---

```Delphi
function TokenInt: LongInt;
```

### Example

```Delphi
procedure ReadBoundedInteger(Parser: TParser);
var
  Number: LongInt;
begin
  if Parser = nil then Exit;

  Parser.CheckToken(toInteger);
  Number := Parser.TokenInt;
  Parser.NextToken;
end;
```

### Usage

`TokenInt` parses current token text with Velox's Int64 converter but exposes only a signed 32-bit LongInt result to Velox scripts.

### Additional Technical Info
`TokenInt` obtains [`TokenString`](TokenString.md) and passes it to native `StrToInt64`. Decimal text, an optional leading minus recognized by the scanner, and Delphi dollar-prefixed hexadecimal text can be converted. Invalid or out-of-Int64 text raises `EConvertError`.

The method does not verify [`Token`](../Properties/Token.md). Call [`CheckToken(toInteger)`](CheckToken.md) before conversion unless another current token is intentionally known to contain valid integer text. [`NextToken`](NextToken.md) can classify incomplete `$` or `-` text as toInteger; TokenInt is where those malformed tokens fail.

#### 32-bit script boundary

The installed Delphi return type is Int64, but the PascalScript compiler declaration is LongInt. The runtime importer binds the native method directly without a range-checking adapter. Only values from -2,147,483,648 through 2,147,483,647 are portable at the documented script boundary. A larger valid Int64 can be truncated, wrapped or raise depending on platform and runtime checks.

This includes large hexadecimal bit patterns. Do not use TokenInt to parse identifiers, counters or amounts that require 64-bit fidelity even though native TParser accepts them. Read the token text and apply a separately documented 64-bit conversion route if the flow needs that range.

TokenInt does not advance or otherwise intentionally mutate parser state. After a successful read, call NextToken explicitly. On conversion failure, the current token remains selected.

The example is source-reviewed only; no integer conversion was executed.

**External references**

- [Embarcadero: `TParser.TokenInt`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.TokenInt) - native Int64 token conversion.
- [Free Pascal: `TParser.TokenInt`](https://www.freepascal.org/docs-html/rtl/classes/tparser.tokenint.html) - compatible integer-token getter.

<small>Created 2026-07-15</small>
