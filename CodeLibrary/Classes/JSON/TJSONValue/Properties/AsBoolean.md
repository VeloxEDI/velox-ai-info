---
title: AsBoolean
description: Reads an actual Boolean or exact true text and writes lowercase Boolean text through the concrete value setter.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, boolean, conversion, 'null']
---

```Delphi
property AsBoolean: Boolean read write;
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
    Item.AsString := 'TRUE';
    Value := Item.AsBoolean;  // True; comparison is case-insensitive.
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsBoolean` reads an actual Boolean or exact true text and writes lowercase Boolean text through the value setter.

### Additional Technical Info
For an actual non-null `TJSONBoolean`, the reader returns its stored native value. For every other non-null class it compares [`AsString`](AsString.md) with the exact word `true` using case-insensitive `SameText`. There is no trimming or alternative truth syntax: `' TRUE '`, `'1'`, `'yes'`, arrays and objects all read `False`. A null value reads `False`, so check [`IsNull`](IsNull.md) when false and null must differ.

Writing maps `True` to lowercase `true` and `False` to lowercase `false`, then assigns that text through the receiver's virtual String setter. This stores a Boolean payload on `TJSONBoolean` and literal text on `TJSONString`. Other actual classes follow their own parsers: numeric conversion raises, an object/array parser rejects the scalar root before erasing existing children, and `TJSONNull` remains observably null. Use the property for Boolean/String nodes whose contract is known, not as a generic type conversion target.

`TJSONBoolean.DoSetAsString` marks the node non-null before validating the text. Although this property's own generated text is always valid, related direct String assignments can raise after clearing null state and retain the old Boolean field. Reads/writes are synchronous and locale-independent.

**External references**

- [Embarcadero `SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html) - compatible case-insensitive comparison context.
- [RFC 8259 section 3: JSON values](https://www.rfc-editor.org/rfc/rfc8259#section-3)

<small>Created 2026-07-15</small>
