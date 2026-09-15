---
title: AsFloat0
description: Returns zero for a trimmed-empty string view and otherwise delegates to AsFloat; writes delegate directly to AsFloat.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, double, empty-value]
---

```Delphi
property AsFloat0: Double read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Locals['OptionalAmount'].AsString := '';
  Value := Locals['OptionalAmount'].AsFloat0;
end;
```

### Usage

`AsFloat0` returns zero when the variable is blank; otherwise it returns the same value as `AsFloat`. Assigning it sets `AsFloat`.

### Additional Technical Info
On read, `AsFloat0` first obtains [`AsStringTrim`](AsStringTrim.md). If that is empty it returns zero; otherwise it reads [`AsFloat`](AsFloat.md). Those are two separately locked snapshots, so another thread can change Value between them.

Nonempty invalid text still becomes zero because AsFloat catches failed coercion. Thus empty, whitespace, invalid content and numeric zero are indistinguishable in the result.

The setter simply delegates to AsFloat and therefore writes the raw Variant directly, bypassing Value validation and encryption. For encrypted variables, the initial string test decrypts but AsFloat then reads ciphertext, another reason not to use this alias there.

<small>Created 2026-07-15</small>
