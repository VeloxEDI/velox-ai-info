---
title: Interpret Value in its event context
description: Distinguish ordinary Custom Script authoring from File Router predicates and other event return contracts.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-10-15T01:47:56Z"
---

# Interpret Value in its event context

Applies whenever generating, editing or reviewing an event with a `var Value: Variant` parameter. The procedure signature alone does not define the meaning of `Value`; identify the owning action, formula or event first.

## Required rules

- Do not append `Value := True` as a universal success footer or filler. A Custom Script containing only this assignment performs no useful business work and does not trigger a file route.
- User-confirmed ordinary Custom Script authoring practice treats the standalone assignment below as redundant. Generate the actual requested work instead; do not add an assignment solely to make the script appear complete.
- In a File Router route formula, `Value` is the route predicate: `True` matches that route and `False` does not. `Value := True` is meaningful here. An unconditional `True` is a catch-all; preserve specific rules and route order rather than making every route unconditional.
- File Router routes are evaluated in order and the first match is selected. A later route returning `True` does not make it execute after an earlier match. Test Run suppresses the normal file copy; a true predicate is not proof that a copy occurred.
- For Map fields, Map record events, Transports and other hosts, verify the particular event contract. Do not apply File Router semantics to those events or assume that `True` is inert everywhere else.
- Preserve intentional result handling, including explicit failure results, meaningful resets and overrides. The ordinary Custom Script convention is not permission to remove every assignment to `Value`, or to assert that a host never consumes it.

## Ordinary Custom Script: avoid filler

Do not generate this as an implementation of requested business logic:

```pascal
procedure ScriptEvent(var Value: Variant);
begin
  Value := True;
end;
```

The assignment alone does not implement processing. If no work is required, do not invent a placeholder event. If editing an existing script, first check whether an assignment intentionally changes a result set earlier in the script.

## File Router: an intentional catch-all

The same code can be a meaningful route formula when an unconditional route is explicitly required. It matches the current route when that route is reached. For conditional routing, assign the actual routing condition instead of unconditional `True` and select a configured destination File Connection.

## Validation

Identify the host for every changed `Value` assignment. For Custom Scripts, confirm that the script implements the requested work without redundant success/filler assignments. For File Router formulas, check match, no-match, overlapping routes and route order; distinguish predicate evaluation from the actual copy. Preserve meaningful error handling and verify other hosts against their own documentation.

## Evidence and verification scope

The ordinary Custom Script no-op example and the File Router distinction were supplied by the user. The local [ScriptEvent contract](../../CodeLibrary/ScriptingGuide/Events/ScriptEvent.md) corroborates that the host defines `Value` semantics. The [File Router step](../../Velox/docs/design-and-build/flows/steps/file-router-step.md) corroborates first-match routing and test-mode copy suppression. The [Custom Script step](../../Velox/docs/design-and-build/flows/steps/custom-script-step.md) describes failed results and exceptions; this standard preserves that meaningful failure handling rather than claiming `Value` is universally ignored. No direct product-source verification or Velox compilation/runtime test was performed for this change.
