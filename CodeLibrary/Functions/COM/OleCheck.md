---
title: "OleCheck"
description: "Raises an OLE system exception when an HRESULT indicates failure."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - com
  - hresult
  - error-handling
---

```Delphi
procedure OleCheck(Result: HResult);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  try
    OleCheck(-1); // A negative HRESULT represents failure.
    Value := True;
  except
    Value := False;
  end;
end;
```

### Usage

`OleCheck` raises an OLE system exception when an HRESULT indicates failure.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Result` | `HResult` | Signed 32-bit COM result code to test. Values with the high bit clear are success; values with the high bit set are negative and represent failure. |

**Returns**

This procedure has no return value. It returns normally for a successful `HRESULT` and raises for a failed one.

**Behaviour**

`S_OK` (`0`) returns normally. So do non-negative informational or partial-success codes such as `S_FALSE` (`1`), because COM defines success by the severity bit rather than by equality with zero. Callers that need to distinguish a specific success code must compare that value before or after using `OleCheck`.

**Errors**

A failed `HRESULT` raises `EOleSysError`. The exception carries the numeric error code and uses the system's OLE error-text resolution; the resulting message can vary with the code and Windows environment. The procedure does not attach the name of the preceding COM call, so the surrounding script should preserve useful operation context.

**Usage notes**

Use this procedure immediately after the operation that produced the `HRESULT` so a failure cannot be confused with a later call. If a function already raises on failure, applying `OleCheck` again is unnecessary.

### Additional Technical Info
`OleCheck` tests a Windows `HRESULT` and raises an OLE system exception when the value represents failure. It is useful when a directly exposed or custom COM call returns a result code rather than raising automatically.

The example is source-reviewed and is not executed by the documentation workflow. It uses a synthetic failure value and performs no COM activation or external I/O.

**Implementation**

Velox registers the PascalScript declaration directly to Delphi's `System.Win.ComObj.OleCheck`. The Delphi routine applies the Windows `Succeeded(Result)` test. When that test is false, it calls `OleError`, which raises `EOleSysError` with the original result code.

**Edge cases and quirks**

- Do not write `if Result <> 0 then OleCheck(Result)`: positive nonzero values are valid success results and should not automatically be treated as failures.
- The exposed `HResult` type is registered for the COM import but is hidden from the Code Library tree. Its observable representation is a signed 32-bit result code.
- `OleCheck` knows only the numeric result. Rich Automation details such as `IErrorInfo` or `EXCEPINFO` require the calling wrapper to collect and expose them.
- A server-specific success code can still carry information that the procedure deliberately ignores.

**Side effects**

For success there is no side effect. For failure the procedure constructs and raises an exception, transferring control to the nearest matching exception handler. It does not log, retry or alter the original external operation.

**Performance and concurrency**

The success path is a constant-time signed result check and uses no shared state. Exception creation on failure is more expensive but remains local to the calling thread. The procedure itself is re-entrant and does not make an external COM call.

**Related entries**

- [`COM`](../COM.md) describes the surrounding COM execution model.
- [`GetActiveOleObject`](GetActiveOleObject.md) uses this result check for lookup and `IDispatch` negotiation.

**External references**

- [Embarcadero `System.Win.ComObj.OleCheck`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Win.ComObj.OleCheck)
- [Free Pascal `HRESULT`](https://www.freepascal.org/docs-html/rtl/system/hresult.html)
- [Microsoft: `SUCCEEDED` macro](https://learn.microsoft.com/en-us/windows/win32/api/winerror/nf-winerror-succeeded)

<small>Created 2026-07-15</small>
