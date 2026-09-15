---
title: AsStringTrim
description: Trims non-null virtual text on read and trims input before the concrete value class processes it.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, string, trim, conversion]
---

```Delphi
property AsStringTrim: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: TJSONString;
  Item: TJSONValue;
begin
  Text := TJSONString.Create;
  try
    Item := Text;
    Item.AsStringTrim := '  ready  ';
    Value := Item.AsString;  // ready
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsStringTrim` trims non-null text on read and trims input before the value class processes it.

### Additional Technical Info
The reader returns `''` when [`IsNull`](IsNull.md) is true. Otherwise it calls the concrete raw getter and applies Delphi `Trim`. On a String this removes boundary spaces/control characters from the payload view. On a number or Boolean it normally changes nothing. On an object/array it first serializes the complete compact document, then trims only its outer boundaries; it does not normalize internal JSON whitespace.

The writer trims the supplied String first, then calls the concrete virtual raw setter. A String permanently stores the trimmed value. Boolean/numeric conversion therefore accepts surrounding characters that direct [`AsString`](AsString.md) would reject after they have been trimmed. An object/array parses the trimmed complete document; empty/whitespace-only input becomes empty and retains existing container content because the parser yields no source.

Trimming is destructive when leading/trailing whitespace is data. Null, empty and all-trimmable text all read as blank, so inspect `IsNull` separately. Scalar parse failures and container replacement behavior remain type-specific; no rollback is added. The operation allocates trimmed text and, for containers, can also serialize or parse the complete tree.

**External references**

- [Embarcadero `Trim`](https://docwiki.embarcadero.com/Libraries/Florence/en/API%3ASystem.SysUtils.Trim)
- [Free Pascal `Trim`](https://www.freepascal.org/docs-html/rtl/sysutils/trim.html) - compatible leading/trailing space/control context.

<small>Created 2026-07-15</small>
