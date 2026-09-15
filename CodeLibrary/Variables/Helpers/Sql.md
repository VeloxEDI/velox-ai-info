---
title: "Sql"
description: "Returns the action-owned shared TStringList used to assemble SQL text without executing it."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - sql
---

```Delphi
function Sql: TStringList;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Sql.Clear;
  Sql.Add('select Code from Example where Num = :Num');
  Value := Sql.Text;
end;
```

### Usage

`Sql` provides a reusable `TStringList` for assembling SQL text. Clear it before building a new statement, add the required lines, then pass `Sql.Text` to the database operation that should execute it.

Adding text does not create parameters, select a connection, start a transaction, execute SQL or return rows. Those behaviours are controlled by the database function or action that consumes the text. Treat all inserted identifiers and values according to that operation's SQL-safety rules.

### Additional Technical Info
`Sql` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TStringList` |
| Ownership | Action-owned and shared across the action's scripts |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Failures, safety and implementation cautions**

Clear stale text before building a statement. Prefer parameters for data values, whitelist identifiers that cannot be parameterised and apply least-privilege connections. Never concatenate untrusted values, log secrets or mistake successful string construction for successful execution/commit.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TStringList`](../../Classes/Lists/TStringList.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- [Embarcadero DocWiki: `TStringList`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStringList) documents the Delphi buffer class.
- [Free Pascal: `TStringList`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.html) provides compatibility context; Velox uses Delphi.

<small>Created 2026-07-15</small>
