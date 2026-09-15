---
title: "NewGuid"
description: "Requests a new Windows UUID as a TGuid but discards the operating-system status."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - guid
  - uuid
  - create
  - windows
  - status
---

```Delphi
Function NewGuid: TGuid
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Identifier: TGuid;
begin
  Identifier := NewGuid;
  Value := GUIDToStringNoBraces(Identifier);
end;
```

### Usage

`NewGuid` requests a new Windows UUID as a TGuid but discards the operating-system status.

**Returns**

The `TGuid` record left in the output supplied to Velox `CreateGUID`.

**Errors**

The function has no explicit exception path for nonzero `CreateGUID` status because it ignores the result. Delayed DLL/runtime faults can still propagate. More importantly, a normal return is not a checked-success signal.

**Usage notes**

For ordinary identifiers, this is the standard Velox helper. If a flow needs auditable generation failure handling or a security-grade random value, use an API that returns/checks status and matches that requirement.

### Additional Technical Info
`NewGuid` asks the installed Windows Delphi runtime to create a UUID and returns the resulting 16-byte `TGuid`. The Velox wrapper ignores the status returned by Delphi `CreateGUID`, so scripts cannot distinguish full success, the Windows “local only” outcome or an actual generation problem.

The example is illustrative and source-reviewed only. The documentation workflow did not generate a GUID or execute the product runtime.

**Implementation**

The registered function is exactly:

```Delphi
function NewGuid: TGuid;
begin
  CreateGUID(Result);
end;
```

Installed Studio 37.0 implements Windows `System.SysUtils.CreateGUID` as `HResultFromWin32(UuidCreate(Guid))`, using delayed `rpcrt4.dll` function `UuidCreate`. Velox discards that HRESULT and performs no `Succeeded` check, retry, all-zero check or fallback.

The Embarcadero DocWiki page currently says Windows calls `CoCreateGuid`; that does not match the installed source governing this Velox build. Microsoft `UuidCreate` and installed Delphi source are authoritative here.

**Windows status behavior**

Microsoft documents these notable RPC statuses:

- `RPC_S_OK`: the call succeeded.
- `RPC_S_UUID_LOCAL_ONLY`: a UUID was produced but is guaranteed unique only on this computer.
- `RPC_S_UUID_NO_ADDRESS`: Windows could not obtain an Ethernet or token-ring address.

Because Velox discards the mapped status, every case has the same script signature and apparent normal return. If an OS outcome does not leave a valid generated UUID, Velox neither detects nor replaces the output; callers should not infer checked success from the absence of an exception.

**Edge cases and quirks**

- The function is nondeterministic and invokes operating-system UUID services.
- A normal-looking GUID is an identifier, not a proof of authenticity, authorization or secrecy.
- The wrapper does not guarantee a specific RFC version/variant in its own contract; it returns the Windows-generated value.
- It does not enforce nonzero output or compare against [`EmptyGuid`](EmptyGuid.md).
- Collision risk follows the operating-system generator and reported status, but the status is unavailable to the script.
- Generated values are not sequential and must not be assumed to sort by creation time.
- Do not use the output as a password, API key, cryptographic nonce or unpredictable security boundary merely because it is unique-looking.

**Side effects**

Calls Windows UUID-generation services and writes the function result record. No Velox configuration or persistent data is changed by the helper itself.

**Performance and concurrency**

One operating-system call plus a fixed-size record return. Windows supplies concurrency behavior; Velox keeps no counter or shared state.

**Related entries**

- [`NewGuidString`](NewGuidString.md) formats the result with braces.
- [`NewGuidStringNoBraces`](NewGuidStringNoBraces.md) formats it without braces.
- [`IsEmptyGuid`](IsEmptyGuid.md) can detect the zero value but cannot recover discarded generation status.

**External references**

- [Embarcadero `System.SysUtils.CreateGUID`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.CreateGUID) - signature/general intent; its old Windows-terminal note differs from installed source.
- [Microsoft `UuidCreate`](https://learn.microsoft.com/en-us/windows/win32/api/rpcdce/nf-rpcdce-uuidcreate) - exact installed Windows terminal and status meanings.
- [Free Pascal `CreateGUID`](https://www.freepascal.org/docs-html/rtl/sysutils/createguid.html) - compatibility reference with a different platform/callback implementation model.

<small>Created 2026-07-15</small>
