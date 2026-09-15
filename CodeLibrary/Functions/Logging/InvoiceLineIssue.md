---
title: "InvoiceLineIssue"
description: "Intended to queue a line-level invoice issue, but its current PascalScript registration targets the incompatible InvoiceIssue method."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - invoice
  - invoice-line
  - issue
  - defect
---

```Delphi
procedure InvoiceLineIssue(
  aInvoiceNum, aInvoiceLineNum, aIssueNum: integer;
  aDescription: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Do not call InvoiceLineIssue in current builds.
  // Its four-argument script declaration is linked to a three-argument method.
end;
```

### Usage

Do not call `InvoiceLineIssue` in current Velox scripts. Its four-argument scripting entry is connected to an incompatible three-argument operation and can corrupt arguments or destabilise execution.

Use [`InvoiceIssue`](InvoiceIssue.md) only when a header-level issue is semantically correct. There is currently no supported scripting substitute for recording the intended invoice-line relationship; request the product correction when line-level issue persistence is required.

### Additional Technical Info
`InvoiceLineIssue` is intended to queue an issue against a specific `Invoice_Line` and defer its persistence until successful flow finalization. **The current scripting registration is defective and the function must not be called.**

The compiler exposes the four-argument declaration below, but the runtime registration supplies the address of `TvxScripter.InvoiceIssue`, a different native method with only three arguments. The correct `TvxScripter.InvoiceLineIssue` implementation exists in source but is not the pointer registered under this name.

**Declaration (currently unsafe at runtime)**

**Parameters intended by the implementation**

| Name | Type | Intended meaning |
|---|---|---|
| `aInvoiceNum` | `integer` | Parent `Invoice_Hdr.Num`. |
| `aInvoiceLineNum` | `integer` | `Invoice_Line.Num` to store in `Invoice_Issue.InvoiceLineNum`. A value of `0` would take the header-level insert branch. |
| `aIssueNum` | `integer` | `Issue.Num` whose current `Status` supplies the invoice header status level. |
| `aDescription` | `string` | Detail intended for `Invoice_Issue.Description`. |

These meanings describe the unreachable intended body; they are not a claim that the current script call is safe.

**Registration defect**

Current `TvxScripter.RegisterMethods` performs the equivalent of:

```Delphi
AddMethod(
  Self,
  @TvxScripter.InvoiceIssue, // Incorrect target: three explicit arguments
  'procedure InvoiceLineIssue(aInvoiceNum, aInvoiceLineNum, aIssueNum: integer; aDescription: string);');
```

PascalScript compiles a call frame for four explicit arguments and dispatches it to a native method compiled for three. This is an ABI/signature mismatch. The extra and shifted native arguments can be interpreted incorrectly and managed-string lifetime handling can be unsafe. Exact symptoms depend on target architecture and calling machinery; do not rely on a repeatable exception or partial result.

The source declaration, `_Index.json` declaration and generated help page agree with one another. The defect is specifically the runtime method pointer, so documentation or declaration changes cannot repair it.

**Required current practice**

- Do not call `InvoiceLineIssue` in production or test scripts.
- Do not use a test call merely to detect whether a deployment is fixed; inspect the product registration/version instead.
- [`InvoiceIssue`](InvoiceIssue.md) is safe only when a header-level issue is semantically correct. It is not a substitute for a required line-level relationship.
- There is no supported scripting workaround in this entry for creating the intended `InvoiceLineNum` link. Escalate the product registration fix when line-level issue persistence is required.

**Intended behavior after a product fix**

If registration is changed to `@TvxScripter.InvoiceLineIssue`, the native body would queue an in-memory invoice issue with the supplied line number and call [`GetIssueLevel`](GetIssueLevel.md). During successful, non-cancelled flow finalization it would insert either:

```text
Invoice_Issue (InvoiceHdrNum, InvoiceLineNum, IssueNum, Description)
```

or, for line number zero, the header-only column set. It would also participate in the same header-status update, transaction, Test rollback and notification-event logic described by [`InvoiceIssue`](InvoiceIssue.md).

That intended path inherits three further quirks: the header status is replaced without comparison to its existing database value; a multi-invoice pending list currently produces only one notification event for the last visited issue; and saved, Test-rolled-back or failed pending lists are not cleared. If the same native action instance runs again, earlier issues are replayed until that instance is destroyed or the product lifecycle is fixed.

**Errors and side effects**

Because the current public call is ABI-incompatible, its behavior is undefined at the Velox/PascalScript boundary. It may pass corrupt arguments, raise, queue incorrect data or destabilize script execution. A `try..except` block does not make intentional use safe because incorrect managed-argument handling can occur before or outside the intended body.

The documentation example deliberately does not execute the entry. No runtime or database test was performed.

**Related entries**

- [`InvoiceIssue`](InvoiceIssue.md) documents the working header-level path and deferred persistence lifecycle.
- [`GetIssueLevel`](GetIssueLevel.md) documents the status lookup the intended implementation uses.
- [`LogIssue`](LogIssue.md) adds a current-flow business issue message but does not create an invoice-line issue record.

<small>Created 2026-07-15</small>
