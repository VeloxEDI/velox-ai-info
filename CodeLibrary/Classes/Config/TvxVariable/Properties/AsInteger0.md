---
title: AsInteger0
description: Returns zero for a trimmed-empty string view and otherwise delegates to AsInteger; writes delegate directly to AsInteger.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, integer, empty-value]
---

```Delphi
property AsInteger0: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Locals['OptionalCount'].AsString := ' ';
  Value := Locals['OptionalCount'].AsInteger0;
end;
```

### Usage

`AsInteger0` returns zero when the variable is blank; otherwise it returns the same value as `AsInteger`. Assigning it sets `AsInteger`.

### Additional Technical Info
The getter reads [`AsStringTrim`](AsStringTrim.md); empty returns `0`, otherwise it reads [`AsInteger`](AsInteger.md). The two accesses lock separately, so the decision and conversion need not observe the same Value under concurrent writes.

Nonempty invalid/overflowing content also returns zero because AsInteger catches conversion errors. Empty, invalid and real zero are therefore indistinguishable.

The setter delegates to AsInteger, storing a raw Integer while bypassing Value validation and encryption. On encrypted variables the precheck can decrypt while the following raw conversion sees ciphertext.

<small>Created 2026-07-15</small>
