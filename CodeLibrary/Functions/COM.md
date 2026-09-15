---
title: "COM"
description: "Functions for creating, finding, invoking and validating Windows COM automation objects."
sidebar_position: 4
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - com
  - automation
  - windows
---

The COM group exposes low-level Windows Component Object Model and Automation operations to Velox scripts. These functions can create a registered component, attach to an object that is already running, invoke an `IDispatch` member or turn a failed `HRESULT` into an exception.

COM calls cross a significant trust and execution boundary. A call can load third-party code into the Velox process, start a local executable server, connect to an interactive application or block while another process handles the request. Whether an object is available also depends on the deployed component, Windows account, session, bitness, registry view and COM apartment of the calling thread.

## Common tasks

- Use `CreateOleObject` when the server publishes a ProgID and supports Automation through `IDispatch`.
- Use `CreateComObject` when the caller has a CLSID and needs the base `IUnknown` interface.
- Use `GetActiveOleObject` only when the integration contract requires an object that has already registered itself in the Running Object Table.
- Let normal late-bound calls on an Automation object use the script engine's dispatch support. Call `IdispatchInvoke` directly only when the member name or property-operation mode must be supplied explicitly.
- Use `OleCheck` when custom COM interop code returns an `HRESULT` that must raise on failure.

## Important behaviour

These helpers do not initialise COM. The calling thread must already have a compatible COM apartment, and every successful `CoInitializeEx` call in custom hosting code must be balanced according to the Windows COM rules. Several Velox worker paths initialise COM as multithreaded, but scripts must not assume that every product component, service account or execution context has identical COM setup.

Returned interfaces are reference-counted. Keep them only for the required scope and release references by overwriting them, assigning `nil` or `Unassigned` as appropriate, or allowing the variable to leave scope. Do not call `Free` on a COM interface.

All calls are synchronous. The group adds no timeout, cancellation, retry, circuit breaker or COM message-pumping policy. Server behaviour determines whether calls display user interface, access files or networks, prompt for credentials, hold locks or wait indefinitely.

## Edge cases and quirks

- COM registration is architecture-sensitive. A 32-bit Velox process normally sees 32-bit registration and a 64-bit process sees 64-bit registration; a ProgID or CLSID that works in one process may be absent or backed by a different server in another.
- Interactive applications are commonly unsuitable for unattended services. A service and a signed-in desktop user can have different identities, sessions, profiles, desktops and Running Object Tables.
- COM interfaces have apartment affinity. Do not move an interface between threads without COM marshalling, and do not assume that a server is thread-safe merely because a Velox worker uses a multithreaded apartment.
- Current source comments say the classic native invocation bridge must be disabled for Win64 and historically affects `CreateOleObject`, while current project definitions enable it in both Win32 and Win64 configurations. This is an unresolved source/configuration conflict, not proof of failure or compatibility. Validate Automation in the same deployed Velox component, platform, account and COM server used in production.
- Free Pascal documentation is included as a Pascal and COM compatibility reference. It does not define the behaviour of Velox's Delphi runtime, and Free Pascal's own Automation limitations do not imply the same limitation in Velox.

## Related groups

- [`Functions`](../Functions.md) explains how exposed functions are registered and why the documented overload matters.
- [`Scripting Guide - Functions`](../ScriptingGuide/Functions.md) covers parameter modes, return values and runtime failures in Velox scripts.

## External references

- [Embarcadero `System.Win.ComObj`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Win.ComObj)
- [Free Pascal: Interfaces and COM](https://www.freepascal.org/docs-html/ref/refse49.html)
- [Microsoft: The Component Object Model](https://learn.microsoft.com/en-us/windows/win32/com/the-component-object-model)
- [Microsoft: `CoInitializeEx`](https://learn.microsoft.com/en-us/windows/win32/api/combaseapi/nf-combaseapi-coinitializeex)
