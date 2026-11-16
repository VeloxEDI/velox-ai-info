---
title: Script failure handling change audit
description: Changed files, corrected failure paths and validation results for the mandatory LogError authoring rule.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
---

# Script failure handling change audit

This records the mandatory [LogError authoring standard](failure-handling.md) update in `velox-ai-info`. Existing scripting-compatibility and CFG-packaging working changes were preserved. No commit, push, native import or deployment was performed.

## Conflicts corrected

| Conflict | Correction |
| --- | --- |
| Validation helpers threw exceptions and callers could implicitly rely on unwinding | Rewrote affected helpers as Boolean functions, initialised failure results, logged errors and returned early. Required callers to check results and exit; the canonical guide includes a complete helper-to-event propagation example. Added nil/bounds guards where required. |
| Data-definition StartTransaction and CommitTran failure did not explicitly perform cleanup in their examples | Log the primary failure, attempt best-effort RollbackTran, check/report its result and return failure. Document transaction ownership, partial commit and incomplete cleanup. |
| Connection StartTransaction used a rethrow-dependent except block | Retained unexpected-failure handling, added explicit finally rollback for an uncommitted owned transaction, logged rollback failures and removed the rethrow/success footer. Explain that LogError plus Exit reaches cleanup without throwing. |
| Append/Edit/Insert rethrew after Cancel | Preserve owned-edit tracking, log the original failure, attempt Cancel explicitly with separate cleanup-error logging, return failure and require the caller to stop. Do not claim cancellation reverses an already posted/committed change. |
| Missing DBCon, DBCons, FileCon or unloaded modules threw and could allow unsafe continuation after a naive replacement | Use checked Boolean helpers, guard missing objects/links, stop before dereference and require event-level propagation. |
| Process execution / Windows launch examples threw | Log launch/completion errors and exit before success output or subsequent work. |
| Divide-by-zero advice generated RaiseException | Replace the predictable-failure guard with LogError and Exit before division. |
| COM and invalid-date API examples caught errors but returned False/a message | Log caught failures and exit; do not silently report completion through Value. Preserve the API calls and accurate API descriptions. |
| Exception API examples and prose encouraged exception-based validation/rethrow | Preserve supported declarations and semantics, label eight demonstrations reference-only with reasons, remove recommendations to generate those patterns, and link the required LogError pattern. |
| Generic scripting/error guidance allowed an ambiguous logged or returned result | Require LogError, explicit stop/checked propagation, meaningful cleanup, and no warning/issue/duplicate/cancellation substitute. |

Twenty-seven recommended example blocks were corrected. Eight intentionally exception-focused API demonstrations remain explicitly labelled reference-only. One deliberately invalid generated-script pattern is labelled with a reason; it is not a recommendation.

## Regression guard

The checker reports explicit raise/rethrow statements, Exception.Create and exception API substitutes in recommended script contexts. It checks Pascal/Delphi fences, recognisable unlabelled event scripts, standalone script sources and decoded CFG formulas, including split/escaped strings and character-code continuations. It ignores Pascal comments/messages, preserves SQL THROW/native database handling, and requires explicit reasoned labels for native Delphi, API-reference and deliberately invalid samples.

The GitHub Actions workflow runs the unit tests and repository audit. No hosted workflow execution was performed as part of this local update.

## Validation results

- Repository failure-policy scan: **passed**, 5,592 script/declaration blocks, zero violations, nine explicitly labelled exceptions to the recommended-example scan.
- Regression tests: **12 passed**, including rejection/acceptance of a synthetic generated CFG before/after correction, escaped/split formulas, comments/strings, plain-text fence bypass detection, reference declarations, SQL and native-code preservation.
- Markdown/MDX parsing, front matter and local links: **passed** for all 48 edited Markdown files. All 35 existing item API declarations were retained exactly; the workflow YAML and Code Library index also parse successfully. These are separate static checks, not script compilation.
- Code Library inventory/index: no generated paths, identifiers or index entries were added, removed or renamed. Only existing reference pages were edited.
- `npm.cmd run validate:codelibrary`: **unavailable**; the command fails because `velox-ai-info/package.json` is absent. No pass is claimed for that command.
- **Native Velox compilation remains unverified.** No configured compiler on the command path was found and no target build/context was used to compile the corrected examples. No runtime or transaction rollback test was executed.
- The control-flow review is manual; the token checker does not prove correct helper propagation, cleanup, transaction ownership or every LogError/Exit pairing.

## Changed files for this request

The inventory below is scoped to this request, not every pre-existing working-tree change.

### Existing files updated (46)

- [AGENTS.md](../../AGENTS.md)
- [CodeLibrary/Classes/Common/TDataSet/Methods/Append.md](../../CodeLibrary/Classes/Common/TDataSet/Methods/Append.md)
- [CodeLibrary/Classes/Common/TDataSet/Methods/Edit.md](../../CodeLibrary/Classes/Common/TDataSet/Methods/Edit.md)
- [CodeLibrary/Classes/Common/TDataSet/Methods/Insert.md](../../CodeLibrary/Classes/Common/TDataSet/Methods/Insert.md)
- [CodeLibrary/Classes/Common/TvxDataDef/Methods/CommitTran.md](../../CodeLibrary/Classes/Common/TvxDataDef/Methods/CommitTran.md)
- [CodeLibrary/Classes/Common/TvxDataDef/Methods/RollbackTran.md](../../CodeLibrary/Classes/Common/TvxDataDef/Methods/RollbackTran.md)
- [CodeLibrary/Classes/Common/TvxDataDef/Methods/StartTransaction.md](../../CodeLibrary/Classes/Common/TvxDataDef/Methods/StartTransaction.md)
- [CodeLibrary/Classes/Common/TvxDataDef/Properties/DBCon.md](../../CodeLibrary/Classes/Common/TvxDataDef/Properties/DBCon.md)
- [CodeLibrary/Classes/Common/TvxDataDef/Properties/DBCons.md](../../CodeLibrary/Classes/Common/TvxDataDef/Properties/DBCons.md)
- [CodeLibrary/Classes/Common/TvxDataDef/Properties/FileCon.md](../../CodeLibrary/Classes/Common/TvxDataDef/Properties/FileCon.md)
- [CodeLibrary/Classes/Common/TvxModule/Properties/ModuleLoaded.md](../../CodeLibrary/Classes/Common/TvxModule/Properties/ModuleLoaded.md)
- [CodeLibrary/Classes/Modules/TvxDBCon/Methods/CommitTran.md](../../CodeLibrary/Classes/Modules/TvxDBCon/Methods/CommitTran.md)
- [CodeLibrary/Classes/Modules/TvxDBCon/Methods/RollbackTran.md](../../CodeLibrary/Classes/Modules/TvxDBCon/Methods/RollbackTran.md)
- [CodeLibrary/Classes/Modules/TvxDBCon/Methods/StartTransaction.md](../../CodeLibrary/Classes/Modules/TvxDBCon/Methods/StartTransaction.md)
- [CodeLibrary/Constants/Enumeration/erCustomError.md](../../CodeLibrary/Constants/Enumeration/erCustomError.md)
- [CodeLibrary/Constants/Variant/Unassigned.md](../../CodeLibrary/Constants/Variant/Unassigned.md)
- [CodeLibrary/Functions/COM/GetActiveOleObject.md](../../CodeLibrary/Functions/COM/GetActiveOleObject.md)
- [CodeLibrary/Functions/COM/OleCheck.md](../../CodeLibrary/Functions/COM/OleCheck.md)
- [CodeLibrary/Functions/DateTime/InvalidDateDayError.md](../../CodeLibrary/Functions/DateTime/InvalidDateDayError.md)
- [CodeLibrary/Functions/DateTime/InvalidDateMonthWeekError.md](../../CodeLibrary/Functions/DateTime/InvalidDateMonthWeekError.md)
- [CodeLibrary/Functions/DateTime/InvalidDateTimeError.md](../../CodeLibrary/Functions/DateTime/InvalidDateTimeError.md)
- [CodeLibrary/Functions/DateTime/InvalidDateWeekError.md](../../CodeLibrary/Functions/DateTime/InvalidDateWeekError.md)
- [CodeLibrary/Functions/DateTime/InvalidDayOfWeekInMonthError.md](../../CodeLibrary/Functions/DateTime/InvalidDayOfWeekInMonthError.md)
- [CodeLibrary/Functions/Exceptions.md](../../CodeLibrary/Functions/Exceptions.md)
- [CodeLibrary/Functions/Exceptions/ExceptionParam.md](../../CodeLibrary/Functions/Exceptions/ExceptionParam.md)
- [CodeLibrary/Functions/Exceptions/ExceptionPos.md](../../CodeLibrary/Functions/Exceptions/ExceptionPos.md)
- [CodeLibrary/Functions/Exceptions/ExceptionProc.md](../../CodeLibrary/Functions/Exceptions/ExceptionProc.md)
- [CodeLibrary/Functions/Exceptions/ExceptionType.md](../../CodeLibrary/Functions/Exceptions/ExceptionType.md)
- [CodeLibrary/Functions/Exceptions/RaiseException.md](../../CodeLibrary/Functions/Exceptions/RaiseException.md)
- [CodeLibrary/Functions/Exceptions/RaiseLastException.md](../../CodeLibrary/Functions/Exceptions/RaiseLastException.md)
- [CodeLibrary/Functions/Logging/LogError.md](../../CodeLibrary/Functions/Logging/LogError.md)
- [CodeLibrary/Functions/ProgramControl/ExecCmdLine.md](../../CodeLibrary/Functions/ProgramControl/ExecCmdLine.md)
- [CodeLibrary/Functions/ProgramControl/ExecCmdLineAndWait.md](../../CodeLibrary/Functions/ProgramControl/ExecCmdLineAndWait.md)
- [CodeLibrary/Functions/ProgramControl/ExecShellCmd.md](../../CodeLibrary/Functions/ProgramControl/ExecShellCmd.md)
- [CodeLibrary/Functions/ProgramControl/ExecShellCmdAndWait.md](../../CodeLibrary/Functions/ProgramControl/ExecShellCmdAndWait.md)
- [CodeLibrary/Functions/ProgramControl/ExecuteFlow.md](../../CodeLibrary/Functions/ProgramControl/ExecuteFlow.md)
- [CodeLibrary/ScriptingGuide/CompilationErrors/DivideByZero.md](../../CodeLibrary/ScriptingGuide/CompilationErrors/DivideByZero.md)
- [CodeLibrary/ScriptingGuide/Statements.md](../../CodeLibrary/ScriptingGuide/Statements.md)
- [CodeLibrary/ScriptingGuide/Statements/tryexcept.md](../../CodeLibrary/ScriptingGuide/Statements/tryexcept.md)
- [CodeLibrary/ScriptingGuide/Statements/tryfinally.md](../../CodeLibrary/ScriptingGuide/Statements/tryfinally.md)
- [CodeLibrary/Types/Enumerations/TIFException.md](../../CodeLibrary/Types/Enumerations/TIFException.md)
- [Velox/docs/design-and-build/scripting-code-library/scripting-concepts.md](../../Velox/docs/design-and-build/scripting-code-library/scripting-concepts.md)
- [instructions/README.md](../../instructions/README.md)
- [instructions/common.md](../../instructions/common.md)
- [instructions/scripts/AGENTS.md](../../instructions/scripts/AGENTS.md)
- [instructions/scripts/event-value-context.md](../../instructions/scripts/event-value-context.md)

### New files (5)

- [instructions/scripts/failure-handling.md](../../instructions/scripts/failure-handling.md)
- [tools/check-script-failures.mjs](../../tools/check-script-failures.mjs)
- [tools/tests/check-script-failures.test.mjs](../../tools/tests/check-script-failures.test.mjs)
- [.github/workflows/check-script-failures.yml](../../.github/workflows/check-script-failures.yml)
- [instructions/scripts/failure-handling-audit.md](../../instructions/scripts/failure-handling-audit.md)
