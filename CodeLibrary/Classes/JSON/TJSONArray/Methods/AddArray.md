---
title: AddArray
description: Creates and appends an owned nested array and returns a borrowed reference for immediate population.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, nested, ownership]
---

```Delphi
function AddArray: TJSONArray;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Root, Child: TJSONArray;
begin
  Root := TJSONArray.Create;
  try
    Child := Root.AddArray;
    Child.AddString('A');
    Child.AddString('B');
    Value := Root.AsString;  // [["A","B"]]
  finally
    Root.Free;
  end;
end;
```

### Usage

`AddArray` creates and appends an owned nested array and returns a borrowed reference for immediate population.

### Additional Technical Info
`AddArray` creates a new empty `TJSONArray`, sets its unused child `Name` to `''`, appends it to the current array and returns it. The parent owns the new node. Use the returned reference to add descendants, but do not free it.

Deleting this entry, erasing/freeing the parent or replacing the parent's parsed content frees the nested array recursively. Any retained reference then becomes invalid. If the child needs an independent lifetime, clone/copy it into a separately owned root before the parent changes.

The method marks the receiving array non-null through the protected add terminal. A new empty child serializes as `[]`, giving `[[]]` when it is the only entry. Array depth and total node count are not limited by this class; bound externally supplied structures before recursive processing.

**External references**

- [RFC 8259 section 5: Arrays](https://www.rfc-editor.org/rfc/rfc8259#section-5)
- [Embarcadero `TObjectList.OwnsObjects`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Contnrs.TObjectList.OwnsObjects)
- [Free Pascal `TObjectList.OwnsObjects`](https://www.freepascal.org/docs-html/fcl/contnrs/tobjectlist.ownsobjects.html) - compatible ownership context; Velox executes Delphi/Deltics code.

<small>Created 2026-07-20</small>
