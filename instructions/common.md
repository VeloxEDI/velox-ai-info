---
title: Shared configuration authoring rules
description: Common requirements for agents creating, editing and reviewing Velox configuration.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-10-15T01:47:56Z"
---

# Shared configuration authoring rules

Apply these requirements alongside every relevant type entry point in [the catalogue](README.md).

## Before authoring

1. Identify the requested behaviour, objects, dependencies and whether each object is new or being edited.
2. Read each applicable type's `AGENTS.md` and every detailed standard it requires. A Flow can require several types' instructions.
3. Inspect existing configuration and linked product documentation. Use `CodeLibrary/` for scripting APIs and signatures. Do not invent classes, properties, enum values, functions, defaults or runtime semantics.
4. State unresolved decisions and evidence gaps. If instructions cannot be retrieved, report the gap rather than inventing a replacement standard.
5. Whenever script code is involved, read [the scripts entry point](scripts/AGENTS.md), including managed helper usage and event-specific `Value` rules. This applies even when scripts are embedded in another configuration type.

## Preserve the configuration contract

- When editing, retain identities, references, type metadata and meaningful scripts unless the requested change requires altering them.
- For new objects, verify identity/reference conventions against documented behaviour or applicable existing exports. Do not blindly copy unrelated customer identities.
- Preserve supported CFG syntax and unrelated configuration. Review the diff for unintended changes.
- Record unresolved decisions in accompanying documentation instead of dummy event handlers.
- Use generic examples in this shared repository. Do not copy customer data, configuration identifiers or credentials into shared guidance.

## Evidence and conflicts

Authoring conventions define how to construct a configuration; they do not prove runtime behaviour. Keep user-confirmed observations distinct from source-verified facts. Report conflicts between conventions, product documentation and existing configuration; resolve them using the user's requirements and available evidence. Do not silently remove meaningful overrides or declare unverified behaviour guaranteed.

## Validation and reporting

Check syntax, identities, references and applicable type rules. Run actual Velox compilation and isolated execution/persistence checks when a target environment is available. Report file inspection, compilation and runtime testing separately, including checks not performed. State changed objects, decisions, exceptions and remaining evidence gaps.

