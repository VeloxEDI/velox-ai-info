---
title: Mandatory script failure handling
description: Always report Velox script failure with LogError and explicitly stop or propagate failure.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
---

# Mandatory script failure handling

Applies to recommended and generated Velox scripts, including event code, Scriptlets, validation helpers and script formulas embedded in CFGs. Read [shared rules](../common.md), [compatibility](compatibility.md), [managed helpers](helpers.md) and the [owning event's Value contract](event-value-context.md).

## Mandatory pattern

Always use `LogError(...)` to report a script failure. Do not generate `raise`, Delphi-style `Exception.Create`, rethrows, `RaiseException` or `RaiseLastException` as a workaround.

Canonical guard fragment; `InvalidCondition` is the actual validation expression in the owning script:

```pascal
if InvalidCondition then
begin
  LogError('Clear explanation of the failure.');
  Exit;
end;
```

- LogError marks the Process (called Flow in some reference pages) failed. It does not throw an exception or exit the current script.
- Exit stops only the current procedure/function. A helper must propagate failure, normally through a Boolean result or explicit failure flag; every calling layer, including the event, must check it and stop.
- LogWarning, LogIssue, LogDuplicate, cancellation and a host-specific Value assignment are not substitutes when processing must fail.
- Retain supported try..except handling for unexpected failures. Report them with LogError, preserve needed cleanup and stop/propagate failure. Do not silently catch and continue.
- Keep messages clear and actionable without credentials or unnecessary sensitive data.

## Propagate helper failure to the event

```pascal
function ValidateCandidate(const Candidate: string): Boolean;
begin
  Result := False;
  if Candidate = '' then
  begin
    LogError('A required value is missing.');
    Exit;
  end;
  Result := True;
end;

procedure ScriptEvent(var Value: Variant);
begin
  try
    if not ValidateCandidate('Example') then
      Exit;
    { Perform the requested work only after validation succeeded. }
  except
    LogError('Unexpected script failure: ' +
      ExceptionToString(ExceptionType, ExceptionParam));
    Exit;
  end;
end;
```

Changing a validation helper from exception transfer to a Boolean result requires updating every caller. Do not ignore the result or continue with later writes, commits or success output. If a procedure must retain its signature, use a checked failure flag and propagate it through each caller instead.

## Preserve cleanup and transaction ownership

LogError does not roll back transactions, cancel edits or reverse file operations. Work already committed, posted or copied can remain. Replacing a raise with LogError will not activate an existing except block: moving cleanup into that block alone is insufficient.

Review every known-failure and unexpected-failure path. Use explicit cleanup on the failure path or a verified try..finally that runs on Exit. Report cleanup failures with LogError as well, without concealing the original failure. Do not commit after validation failed. Establish ownership of a transaction/edit before starting or ending it; StartTransaction can be a no-op for a pre-existing transaction and does not by itself prove ownership.

The revised [data-definition StartTransaction](../../CodeLibrary/Classes/Common/TvxDataDef/Methods/StartTransaction.md), [RollbackTran](../../CodeLibrary/Classes/Common/TvxDataDef/Methods/RollbackTran.md) and [connection transaction example](../../CodeLibrary/Classes/Modules/TvxDBCon/Methods/StartTransaction.md) demonstrate checked results and explicit best-effort cleanup. Partial commit/rollback can leave mixed state; logging does not supply distributed atomicity.

## Scope and reference examples

This is an authoring rule for Velox scripts, not a claim that existing exception APIs do not exist. Preserve accurate [exception API reference material](../../CodeLibrary/Functions/Exceptions.md), native Delphi implementation semantics and SQL THROW/native database error handling.

Exception API demonstrations are explicitly labelled **reference only — not a generated-script template**. Do not copy their intentional API calls into recommended/generated scripts. SQL blocks remain SQL; native Delphi blocks/files must be explicitly labelled as native implementation code when stored alongside script examples.

**Deliberately invalid for generated Velox scripts — do not copy:**

```pascal velox-role="invalid" reason="Forbidden failure pattern; not a generated-script recommendation"
if InvalidCondition then
  raise Exception.Create('Failure');
```

## Regression checks

Run from the repository root:

```text
node tools/check-script-failures.mjs
node --test tools/tests/check-script-failures.test.mjs
```

Also run the checker with `--root` pointing at the generated output directory. It checks recommended Pascal/Delphi script fences, standalone .pas/.inc script sources, and decoded Formula.Strings/GlobalScript.Strings CFG content (including formulas shown in Markdown). It ignores Pascal strings/comments and preserves exception API declarations.

The GitHub Actions workflow `.github/workflows/check-script-failures.yml` runs the checker tests and repository audit on pushes, pull requests and manual dispatch. Local passes do not claim that the hosted workflow has run, and a token check does not enforce transaction correctness or every LogError/Exit pairing.

Exemptions must be explicit, carry a nonempty reason, and be clear to readers:

- Fence metadata `velox-role="invalid" reason="..."`: deliberately invalid, non-recommended examples.
- `velox-role="api-reference" reason="..."`: exception API demonstrations, restricted to exception function reference pages, TIFException and erCustomError.
- `velox-role="native-delphi" reason="..."`: native implementation code. For standalone native .pas/.inc files, put the annotation in the first-line comment.
- SQL-language fences and standalone SQL files remain outside Velox-script checks.

The checker is a regression guard, not a Pascal compiler or a proof of control-flow correctness. Manually review helper callers, cleanup, transactions and post-failure statements; an absence of raise tokens alone is insufficient.

## Evidence and validation boundary

This mandatory authoring standard was supplied by the user. The existing [LogError reference](../../CodeLibrary/Functions/Logging/LogError.md) corroborates its status change and lack of automatic exception/exit/rollback. Existing transaction and try..finally references describe ownership, partial cleanup and Exit behaviour. Their underlying product implementation was not reverified in this update.

Report repository extraction/static checks, native compilation and runtime checks separately. Where native compilation is available, record the Velox build, owning event context, exact corrected example and result. No Velox compiler was found on the command path for this update; native compilation and runtime behaviour of the corrected examples remain unverified. A passing checker or Markdown build is not successful Velox compilation.

See the [change inventory and validation audit](failure-handling-audit.md) for the corrected conflicts and complete file list.
