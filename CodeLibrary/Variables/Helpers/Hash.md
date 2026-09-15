---
title: "Hash"
description: "Returns the action-owned hashing helper shared by all scripts in the action."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - hash
---

```Delphi
function Hash: TvxHash;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Hash.HashString('Example');
end;
```

### Usage

`Hash` provides the action's reusable hashing operations. Use `HashString` to calculate a digest, `HasChanged` to compare data with a supplied hash, and `RowHash` as documented for the helper.

The same helper is used by scripts throughout the action, so do not rely on mutable helper state remaining unchanged across other calls. Copy the string or Boolean result you need. Reading `Hash` does not hash, validate or persist data by itself.

### Additional Technical Info
`Hash` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TvxHash` |
| Ownership | Action-owned and shared across the action's scripts |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Failures, safety and implementation cautions**

A hash is not encryption, authentication, authorisation or a digital signature. Do not use an undocumented algorithm/output as password storage or a security protocol, and do not assume collision resistance or cross-version stability beyond the documented class contract.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TvxHash`](../../Classes/EncryptionHashEncode/TvxHash.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- No core Delphi/FPC function is wrapped directly by this accessor; use the Velox class link above as the behavioural contract.

<small>Created 2026-07-15</small>
