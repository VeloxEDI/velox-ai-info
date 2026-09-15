---
title: String
description: Source-backed guidance for the stateful Delphi component-text tokenizer exposed to Velox scripts as TParser.
sidebar_position: 11
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, classes, string, parser, tokenizer, dfm]
---

The String class branch currently contains [`TParser`](String/TParser.md), Delphi's stateful component-text/DFM tokenizer. It recognizes identifiers, quoted/hash strings, decimal and hexadecimal numbers, punctuation and brace-delimited binary data. It is not a general-purpose parser for arbitrary text, JSON, XML, CSV or Velox expressions.

## State model

Constructing TParser borrows a seekable TStream, eagerly fills its internal buffer and selects the first token. The public `Token` and token-access methods describe that current token. [`NextToken`](String/TParser/Methods/NextToken.md) advances exactly once. Assertion methods such as [`CheckToken`](String/TParser/Methods/CheckToken.md) and [`CheckTokenSymbol`](String/TParser/Methods/CheckTokenSymbol.md) validate the current state but do not advance it.

A typical consumer therefore follows this pattern:

1. create the parser over a live seekable stream;
2. inspect `Token` or call the getter appropriate to that token kind;
3. consume/validate any additional source required by that getter;
4. call NextToken deliberately; and
5. free the parser before freeing or repurposing the borrowed stream.

Do not call a typed getter merely to ask whether conversion is possible. Several getters raise, and [`TokenFloat`](String/TParser/Methods/TokenFloat.md) can consume a numeric suffix before a locale-sensitive conversion fails, leaving the stream/parser cursor changed.

## Stream lifetime and positions

TParser does not own the input stream. It reads ahead, and its destructor rewinds unread buffered bytes so the source cursor corresponds to the current token boundary. Freeing or repositioning the source early invalidates the parser; sharing the stream with another consumer causes cursor races.

[`SourcePos`](String/TParser/Methods/SourcePos.md) is the current token's byte-oriented start position, not a Unicode character index. The native value is `NativeInt` but the importer declares a 32-bit `LongInt`. [`TokenInt`](String/TParser/Methods/TokenInt.md) has a similar native Int64-to-LongInt mismatch. Large positions/integers can narrow or fail.

## Text and error boundaries

The installed parser handles Delphi component-text string syntax, including quote doubling and `#` character codes, but the importer does not register `TokenWideString` or the `toWString` option. [`TokenString`](String/TParser/Methods/TokenString.md) therefore has an important raw-versus-decoded boundary and cannot expose the native wide-token path.

[`Error`](String/TParser/Methods/Error.md) is not reliable in the current product: the importer exposes the legacy Integer signature while current Delphi implements String/resource-pointer overloads. Use [`ErrorStr`](String/TParser/Methods/ErrorStr.md) for an explicit message. Exceptions include parser line information but do not roll back consumed source.

[`HexToBinary`](String/TParser/Methods/HexToBinary.md) writes decoded brace-body bytes into a borrowed destination stream in chunks. Invalid input or write failure can leave partial output. Apply input/output limits before decoding untrusted content.

The parser, its stream and its locale-dependent conversion paths are unsynchronized. Use one parser/stream per execution and do not assume server locale when interchange text requires invariant numeric syntax.

## External references

- [Embarcadero TParser](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser) - current Delphi class reference.
- [Free Pascal TParser](https://www.freepascal.org/docs-html/rtl/classes/tparser.html) - compatible API reference; member pages identify Velox/Delphi-specific differences.
- [Embarcadero component streaming](https://docwiki.embarcadero.com/RADStudio/en/Component_Writers_Guide) - context for the component-text grammar.

<small>Created 2026-07-15</small>
