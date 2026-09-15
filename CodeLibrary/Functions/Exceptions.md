---
title: "Exceptions"
description: "Functions for raising, re-raising, inspecting and formatting the active PascalScript runtime exception."
sidebar_position: 12
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - exceptions
  - error-handling
  - pascalscript
---

The Exceptions group exposes the modified PascalScript runtime's current exception record. It supports deliberate exception creation, re-raising the saved exception from a handler, and reading low-level type, parameter, procedure and position values while an exception handler is active.

## Common tasks

- Use [`RaiseException`](Exceptions/RaiseException.md) to stop normal script execution with an explicit PascalScript exception type and parameter.
- Use [`RaiseLastException`](Exceptions/RaiseLastException.md) when a handler must propagate the saved exception rather than replacing it.
- Use [`ExceptionType`](Exceptions/ExceptionType.md) and [`ExceptionParam`](Exceptions/ExceptionParam.md) to inspect the active runtime exception.
- Use [`ExceptionToString`](Exceptions/ExceptionToString.md) to apply the runtime's display formatting to a type/parameter pair.

## Handler context

The inspection functions describe runtime exception state, not an independent historical error service. Their meaningful values depend on an active PascalScript exception-handler frame. `ExceptionProc` is an internal procedure index, and `ExceptionPos` is a low-level runtime position value that can be a sentinel rather than a user-facing source line or column. Do not persist either as a stable cross-build identifier.

`RaiseLastException` also depends on saved handler state. Read its page before calling it outside a handler or after nested exception processing has changed which frame is current.

## Control flow and logging

Raising or re-raising transfers control through PascalScript exception handling. It does not automatically:

- add a Velox flow-log item;
- choose a business issue/status;
- roll back database or file side effects;
- cancel every map/view; or
- make an internal exception safe to disclose publicly.

Use the appropriate [Logging](Logging.md), [Data](Data.md) and [Program control](ProgramControl.md) contracts when those effects are also required. Avoid exposing raw exception parameters to users or external systems without reviewing them for file paths, SQL, customer values or other sensitive implementation detail.

Catch only exceptions that the script can handle meaningfully. A catch-and-ignore block can leave partially mutated data or external side effects while hiding the actual failure.
