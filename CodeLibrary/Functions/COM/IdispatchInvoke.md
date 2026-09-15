---
title: "IdispatchInvoke"
description: "Resolves and invokes an IDispatch member for dynamic method, property-read or property-write access."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - com
  - idispatch
  - automation
  - variants
---

```Delphi
function IdispatchInvoke(Self: IDispatch; PropertySet: Boolean; const Name: AnsiString; Par: array of Variant): Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Dictionary: IDispatch;
begin
  Dictionary := CreateOleObject('Scripting.Dictionary');
  try
    IdispatchInvoke(Dictionary, False, 'Add', ['Region', 'NZ']);
    Value := IdispatchInvoke(Dictionary, False, 'Item', ['Region']);
  finally
    Dictionary := nil;
  end;
end;
```

### Usage

`IdispatchInvoke` resolves and invokes an IDispatch member for dynamic method, property-read or property-write access.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Self` | `IDispatch` | Automation interface whose member will be resolved and called. A `nil` interface is rejected before any COM call. |
| `PropertySet` | `Boolean` | `True` invokes a value property write using `DISPATCH_PROPERTYPUT`; `False` uses the combined `DISPATCH_METHOD or DISPATCH_PROPERTYGET` flags. |
| `Name` | `AnsiString`, `const` | Member name to resolve. An empty name bypasses name lookup and invokes dispatch identifier 0, normally the default member. |
| `Par` | open array of `Variant` | Positional arguments in script-call order. The helper reverses them into the order required by `DISPPARAMS`. For a property write, put the value required by the server in this array. |

**Returns**

The `Variant` populated by `IDispatch.Invoke`. Its type and meaning are controlled by the server. A procedure or value-less call can yield `Empty`; property writes do not provide a meaningful result under the COM contract.

**Usage notes**

Prefer ordinary late-bound script syntax when the member name is fixed and readable. Direct use is valuable for a computed member name, explicit default-member call or deliberate distinction between property write and method/property read, but it exposes more of COM's marshalling and error semantics.

### Additional Technical Info
`IdispatchInvoke` is Velox's low-level PascalScript bridge to Windows Automation. It resolves a named `IDispatch` member and invokes it as either a method/property read or a property write. The compiler also uses this helper behind normal late-bound member syntax on `Variant` values; direct calls are intended for advanced cases.

The example is source-reviewed and is not executed by the documentation workflow. It uses a local in-memory Windows Scripting Runtime object and performs the method/property-get path explicitly.

**Implementation**

For normal dynamic `Variant.Member(...)` syntax, the modified PascalScript compiler emits a call to this registered runtime helper. The function is also publicly declared and can be called directly. Its current processing is:

1. reject a `nil` `Self` with a PascalScript exception;
2. use DISPID 0 when `Name` is empty, otherwise convert the member name to an OLE string and call `GetIDsOfNames` using `GUID_NULL` and `LOCALE_SYSTEM_DEFAULT`;
3. allocate a COM argument array and place script arguments into it from right to left;
4. convert string Variants to temporary BSTRs; place other arguments in temporary by-reference Variant containers;
5. for a property write, provide the named argument `DISPID_PROPERTYPUT` and `DISPATCH_PROPERTYPUT`; otherwise request both method and property-get dispatch;
6. call `IDispatch.Invoke`, passing a result Variant, `EXCEPINFO` and an argument-error index; and
7. free the temporary argument storage and BSTRs in a `finally` block.

**Behaviour**

COM defines `GetIDsOfNames` name mapping as case-insensitive. The server still determines which members and aliases exist and which DISPID each name receives. The helper does not cache DISPIDs, so every non-empty-name call performs `GetIDsOfNames` before invocation. Both lookup and invocation use the system-default locale, which can affect server-side name, text, date or number interpretation.

The combined method/property-get flags allow a server to decide whether a member is callable or readable when the same name is exposed in both forms. The property-set branch performs value assignment only; it does not request `DISPATCH_PROPERTYPUTREF` for reference assignment.

**Edge cases and quirks**

- A `nil` interface raises `Variant is null, cannot invoke` before member resolution.
- An empty `Name` calls DISPID 0 directly. It does not prove that the object has a default member.
- The exposed name type is `AnsiString` in the current Delphi/PascalScript build. Although it is converted to an OLE string, characters that are not representable in the active ANSI code page can be lost before conversion. String values inside `Variant` arguments use the BSTR path and do not have the same name-conversion route.
- Non-string arguments are copied with a raw memory move into temporary `VT_VARIANT or VT_BYREF` containers. There is no copy-back to the caller's open-array element, so do not use this helper as a general `var`/`out` argument mechanism. The raw copy does not perform normal managed-value reference-count acquisition, while disposal of the temporary can release a copied managed payload. Avoid array-, interface- and other managed-valued Variants; prefer simple scalar/string arguments unless the server contract and deployed runtime have been verified.
- Argument errors returned in the COM `ArgErr` value are not included in the raised message. The error index follows COM's reversed argument order.
- A property write always uses `DISPID_PROPERTYPUT`; reference-only properties requiring `DISPATCH_PROPERTYPUTREF` are unsupported by this helper.
- Current source comments and project defines conflict about the classic native invocation bridge on Win64. That switch does not change this function's dispatch algorithm, but the surrounding runtime path must still be validated on the actual architecture.

**Side effects**

The invoked COM member can perform arbitrary external work. The bridge does not inspect, constrain, transact or undo the operation. Temporary BSTR and Variant argument storage is released after the call; the server can still retain copied values or interface references according to its contract.

**Errors**

- A failed or non-`S_OK` name lookup raises PascalScript's generic unknown-method error.
- When `Invoke` returns `DISP_E_EXCEPTION`, the helper raises a normal script exception containing the server's `Source` and `Description` joined by `: `. It does not call an `EXCEPINFO` deferred-fill callback before reading those fields.
- Other failed `HRESULT` values are converted with `SysErrorMessage` and raised as a normal exception.
- `EXCEPINFO` help context/file and status code are not surfaced, and `ArgErr` is ignored in the message.

The function does not retry or log. Catch exceptions only where the owning flow has an explicit recovery or classification rule.

**Performance and concurrency**

Invocation is synchronous and may cross a process boundary. There is no timeout, cancellation or DISPID cache. Repeated named calls therefore include name-resolution and argument-marshalling overhead. The interface must be used from a compatible apartment; server concurrency and re-entrancy rules remain authoritative.

**Related entries**

- [`COM`](../COM.md) describes shared COM hosting and lifetime constraints.
- [`CreateOleObject`](CreateOleObject.md) obtains an `IDispatch` by ProgID.
- [`GetActiveOleObject`](GetActiveOleObject.md) obtains an `IDispatch` from an active object.

**External references**

- [Embarcadero `IDispatch.GetIDsOfNames`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.IDispatch.GetIDsOfNames)
- [Embarcadero `IDispatch.Invoke`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.IDispatch.Invoke)
- [Free Pascal: Variants and interfaces](https://www.freepascal.org/docs-html/ref/refsu20.html)
- [Microsoft: `IDispatch::GetIDsOfNames`](https://learn.microsoft.com/en-us/windows/win32/api/oaidl/nf-oaidl-idispatch-getidsofnames)
- [Microsoft: `IDispatch::Invoke`](https://learn.microsoft.com/en-us/windows/win32/api/oaidl/nf-oaidl-idispatch-invoke)

<small>Created 2026-07-15</small>
