---
title: "Use Velox Scripting"
description: "Learn when to use Velox Scripting and how to write, test and reuse scripts safely"
sidebar_position: 10
slug: /scripting/
classification: public
status: approved
owner: Cam Hart
keywords:
  - "scripting"
  - "pascal-script"
  - "code-library"
---

Velox Scripting adds PascalScript expressions and event code to Maps, Flows, file routing, Transports and other supported configuration. Use it for rules that cannot be expressed clearly with ordinary configuration.

## Choose a starting point

- Start with [Velox Scripting concepts](scripting-concepts.md) to understand contexts, events, side effects and reuse.
- [Configure variables and Scriptlets](variables-and-scriptlets.md) when several scripts need shared values or code.
- [Write and test Velox scripts](editor-and-testing.md) for the editor, compilation and controlled runtime testing workflow.
- Follow the [worked examples](worked-examples.md) to practise a small, fictional Map rule.
- [Use the Velox Code Library](code-library.md) to find declarations and context-specific objects in your installed version.

## Work safely

Open a script from the module or field that owns it. The available objects and events vary by context, so code that works in one editor might not work in another.

Compile before saving, then test the owning Map, Flow or Transport with sanitised data in a controlled environment. Compilation checks declarations and syntax; it does not prove that files, databases, credentials, remote systems or side effects will behave as intended.

Treat shared variables and Scriptlets as dependencies. Review their callers and test affected integrations before changing them. Do not place secrets in examples or logs.

## Reference availability

Designer provides the Code Library from **Help > Code Library**, and scripting editors expose relevant reference entries. You can also [browse the published Code Library](/code-library/ScriptingGuide). The installed library remains the correct reference for the exact Velox version being configured.
