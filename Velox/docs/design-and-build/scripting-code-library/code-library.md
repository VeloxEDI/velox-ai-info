---
title: "Use the Velox Code Library"
description: "Search the installed scripting reference and insert context-appropriate code"
sidebar_position: 50
slug: /scripting/code-library
classification: public
status: approved
owner: Cam Hart
keywords:
  - "code-library"
  - "reference"
  - "help"
---

The Code Library is the generated scripting reference for functions, classes, variables, events and other declarations available to Velox scripts. [Browse the published Code Library](/code-library/ScriptingGuide) for the latest generated repository reference, and use the copy installed with the Velox version you are configuring when working with a specific installation.

## Open and search the library

1. In Designer, select **Help > Code Library**.
2. Browse the grouped reference tree or search for the required operation or declaration.
3. Open an entry and read its signature, parameters, return value and notes.
4. Follow links in the page to open related Code Library entries. Use **Back** and **Forward** to move through the pages opened in the current window.
5. Use **Copy** to copy relevant code, or drag an entry from a scripting editor's Code Library panel where supported.
6. Adapt the inserted code to the owning event and compile it there.

Scripting editors can also show module variables, fields and reusable configuration relevant to their context. Prefer those context-aware entries over code copied from an unrelated module.

## Verify version and context

The installed index is normally read from:

```text
C:\ProgramData\Velox\Help\CodeLibrary\_Index.json
```

After installing or updating Velox, use **Refresh** in the Code Library and confirm that reference entries open. Verify important signatures in the actual target installation: a repository snapshot, another server or documentation generated for a different release can contain different entries.

The Code Library describes available declarations. It does not prove that the current event exposes a particular object or that the running account can access a file, database or network service.

## Work with images

Current Velox source defines an **Image** function group for compressing and resizing JPEG and PNG images. The functions cover file and stream inputs and outputs, and resize operations preserve the source aspect ratio within the width and height you supply. Exact availability and signatures are release-specific, so confirm the **Image** group in the installed Code Library before using it.

When using image functions:

- use `.jpg`, `.jpeg` or `.png` inputs and a matching supported output format; do not rely on these functions for format conversion;
- supply positive width and height bounds for resize operations;
- use a controlled output path and back up valuable files because a file-output operation can replace an existing target;
- provide an initialized destination stream when using a stream-output overload;
- choose and test the quality value with representative images; and
- check the Boolean result and the owning Flow log before using the output.

## Use reference code safely

- Insert the smallest relevant declaration or example.
- Replace sample values with governed configuration; never paste credentials into a script.
- Confirm parameter and return types.
- Review side effects before testing file, command, database or network functions.
- Compile in the owning context and perform a controlled runtime test.
- Do not copy the generated reference into user documentation; keep the generated library as the signature authority.

## Troubleshooting

| Symptom | Check | Action |
| --- | --- | --- |
| The Code Library is empty | Installed `_Index.json` and local Help files | Repair or restore the matching installation content, then select **Refresh** |
| An entry exists but code does not compile | Installed version, signature and script context | Open the entry in the target installation and insert it again from the owning editor |
| Search does not show a known item | Category spelling and refreshed index | Browse its group, refresh and verify that the Help content matches the executable version |
| A page link cannot be opened | Target page in the installed Code Library tree | Refresh the installed content and confirm it matches the executable version; the linked page may belong to a newer snapshot |
| A copied example fails at runtime | Permissions, input and external dependencies | Isolate the operation and test under the intended execution account |

The published reference is available under `/code-library/` on this site. Because an installed Velox release can contain a different generated snapshot, confirm release-specific signatures in Designer before changing a production script.

## Next steps

- [Review scripting concepts](scripting-concepts.md)
- [Write and test Velox scripts](editor-and-testing.md)
- [Troubleshoot the Code Library](../../operate-and-troubleshoot/code-library-troubleshooting.md)
