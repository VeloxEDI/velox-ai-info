---
title: "Troubleshoot the Code Library"
description: "Diagnose missing, stale or inaccessible in-product scripting help"
sidebar_position: 120
slug: /operations/code-library-troubleshooting
classification: public
status: approved
owner: Cam Hart
keywords:
  - "code-library"
  - "help"
  - "troubleshooting"
---

Use this workflow when Designer **Help > Code Library** is empty/stale, search cannot find an expected entry, an inserted declaration does not compile or the reference website differs from the installed product.

## Establish the version authority

The local library installed with the relevant Velox executables is authoritative for version-specific availability and declarations. This website is generated from the same source but may reflect a newer repository copy.

1. Record the exact executable/release, host and scripting context (Flow script, Map, Scriptlet or Transport event).
2. Confirm `C:\ProgramData\Velox\Help\CodeLibrary\_Index.json` and its generated Markdown tree exist and are readable.
3. Compare Help asset update time/version with the installed executables; do not copy a random library from another environment.
4. Run `C:\ProgramData\Velox\_Update Velox Data from GIT.bat` using the organisation's approved update procedure to refresh the local governed data, then reopen/refresh the library.
5. Search for the class/function and inspect its ancestor path where inherited members are now documented. Hidden ancestor members can appear under generated common source data even though a **common** folder is intentionally not shown in the library/site navigation.

## Declaration compiles but fails

Confirm the owning object/event supplies the documented variables and types, required module/Connection/Definition is assigned, parameters use PascalScript-compatible types and the function exists in that exact release. Compile in the real owning script context, then run with controlled data. A declaration/example is not proof that every external dependency is available.

Do not edit generated Code Library pages or `_Index.json` manually; the generator/source will overwrite them. Correct governed source or update assets through the documented generation/update workflow.

## Escalation evidence

Provide release/build, Help asset timestamps, affected symbol/page path, owning script context, compiler/runtime error and a minimal sanitised reproduction. Do not include production script secrets or payloads.

## Recovery boundary

See [use the Code Library](../design-and-build/scripting-code-library/code-library.md), [editor and testing](../design-and-build/scripting-code-library/editor-and-testing.md) and [update local documentation](../technical-reference/update-local-documentation.md).
