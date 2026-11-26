---
title: Shared configuration authoring rules
description: Common requirements for agents creating, editing and reviewing Velox configuration.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-11-19T21:20:24Z"
---

# Shared configuration authoring rules

Apply these requirements alongside every relevant type entry point in [the catalogue](README.md).

## Before authoring

1. Identify the requested behaviour, objects, dependencies and whether each object is new or being edited.
2. Read each applicable type's `AGENTS.md` and every detailed standard it requires. A Flow can require several types' instructions.
3. Inspect existing configuration and linked product documentation. Use `CodeLibrary/` for scripting APIs and signatures. Do not invent classes, properties, enum values, functions, defaults or runtime semantics.
4. State unresolved decisions and evidence gaps. If instructions cannot be retrieved, report the gap rather than inventing a replacement standard.
5. Whenever script code is involved, read [the scripts entry point](scripts/AGENTS.md), including managed helper usage and event-specific `Value` rules. This applies even when scripts are embedded in another configuration type.
6. Before creating an importable CFG, follow [CFG import packaging](cfg-packaging.md): wrapper identity/state, primary-module order, per-module activation and importer review are part of authoring.
7. For Flow data/action bindings, follow [child-data binding guidance](flows/child-data-bindings.md). Inspect native ownership, real component identifiers and expected classes separately from module identities and display labels.

## Preserve the configuration contract

- When editing, retain identities, references, type metadata and meaningful scripts unless the requested change requires altering them.
- For new objects, verify identity/reference conventions against documented behaviour or applicable existing exports. Do not blindly copy unrelated customer identities.
- Preserve supported CFG syntax and unrelated configuration. Review the diff for unintended changes.
- Record unresolved decisions in accompanying documentation instead of dummy event handlers.
- Use generic examples in this shared repository. Do not copy customer data, configuration identifiers or credentials into shared guidance.

## Evidence and conflicts

Authoring conventions define how to construct a configuration; they do not prove runtime behaviour. Keep user-confirmed observations distinct from source-verified facts. Report conflicts between conventions, product documentation and existing configuration; resolve them using the user's requirements and available evidence. Do not silently remove meaningful overrides or declare unverified behaviour guaranteed.

## Validation and reporting

Run `node tools/check-script-failures.mjs` for repository examples and the same checker with `--root` pointing at generated script/CFG output before delivery. Run `node --test tools/tests/check-script-failures.test.mjs` when maintaining the checker. See [failure handling](scripts/failure-handling.md) for scope, explicit exemptions and control-flow review.


Check syntax, identities, references and applicable type rules. Run actual Velox compilation and isolated execution/persistence checks when a target environment is available. Report file inspection, compilation and runtime testing separately, including checks not performed. State changed objects, decisions, exceptions and remaining evidence gaps.

## AI-generation checklist

- [ ] For field checks, apply [native field-helper usage](scripts/field-helpers.md) only where semantics match. Preserve exact-NULL/zero requirements and nonblank output, avoid redundant checks and claim readability/maintenance benefits without unmeasured speed claims.

- [ ] For meaningful Map events, apply [destination-context procedure-header comments](maps/field-authoring.md#procedure-header-context-comments), preserve/update existing notes and retain native signatures/bindings. Do not create empty events solely for comments or populate intentionally unmapped event editors.

- [ ] Prefer unique native-style Flow data component names in the verified native owner/container layout; do not interpret the combined correction as a universal ban on other names.
- [ ] Resolve Map Source/Dest, outbound Transport Source and Custom Script Source to declared data items in the correct Flow and verify their expected classes/Definition contracts. Keep these unquoted component references separate from SourceFIDS/DestFIDS and human-facing name properties.
- [ ] Run `node tools/check-cfg-bindings.mjs` and its tests, including `--root` against generated output. Review every error and unverified-contract note; the checker does not prove native import binding.
- [ ] After native import, reopen the Flow and confirm the selected data links persist. Report static validation, import/binding, native compilation and execution separately, with not-performed results where appropriate.

- [ ] Every script failure calls `LogError` and stops the procedure; each validation helper returns/propagates failure and its calling event checks it and exits.
- [ ] Do not emit raise/rethrow statements, `Exception.Create` or exception API substitutes. Retain supported unexpected-failure try..except handling, use LogError there, and stop.
- [ ] Audit transaction/dataset/file cleanup explicitly. Logging does not enter except or roll anything back; an early Exit must still run required cleanup and must not reach a later commit/success branch.
- [ ] Do not substitute warnings, issues, duplicates or cancellation when a Process must fail. Preserve appropriate SQL/native implementation code and clearly mark non-recommended reference/invalid examples.
- [ ] Run the script-failure regression check on repository and generated output. Report extraction/static checks separately from actual Velox build/context compilation and execution results.


- [ ] Identify the primary requested module and every required dependency in a package manifest; record expected module count and intended activation state per module.
- [ ] Compare CFG syntax, wrapper structure and module order with a verified native export for the relevant version/type; preserve mandatory native class/property names even when prose says Process.
- [ ] For `TvxConfigTemplate`, use wrapper FIDS `{11111111-1111-1111-1111-111111111111}` and `Active = True`. Give genuinely new real modules distinct identities and retain existing identities/references when editing.
- [ ] Put the primary requested module first; a Process-led package starts with its primary `TvxActionMan`, then the folder and dependencies in the verified native layout.
- [ ] When Processes must remain disabled, check every included Process is `Active = False`; keep the wrapper and required supporting modules active, with explicitly reviewed exceptions. Do not indiscriminately disable the whole package.
- [ ] Preserve unrelated scripts, mappings, SQL and reference graphs during a packaging-only correction. Apply each relevant type's authoring rules without treating saved `CompiledStatus` as compilation proof.
- [ ] Review the importer's root, expected module count and every Add/Update/Add Duplicate/Ignore/Same decision. Do not Ignore the primary/root module.
- [ ] Report static checks, actual successful import, native Test Compile and controlled runtime tests separately, with evidence or an explicit not-performed result for each.
- [ ] For combined fixes, state which changes were tested together; do not claim isolated causality without isolated evidence. See [packaging evidence and limitations](cfg-packaging.md#sources-and-verification-scope).

