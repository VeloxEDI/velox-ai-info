---
title: "Export and import configuration templates"
description: "Move selected modules and dependencies with .CFG files"
sidebar_position: 30
slug: /promotion/configuration-templates
classification: public
status: approved
owner: Cam Hart
keywords: [.CFG, cfg, import, export]
---

Velox configuration templates use `.CFG` files to carry selected modules and recursively discovered dependencies. They can contain credentials, server names, paths, endpoints, scripts and business rules, so store and transfer them as controlled deployment artefacts.

## Export

1. Confirm the source context and use **Check Usage** plus the module-specific design pages to understand dependencies.
2. Use the module **Export** action. Normal export discovers related folders, Connections, Definitions, Maps, Reports, Transports, Scriptlets, Variable Groups and other objects according to the selected module type.
3. Save to a protected location, then record source environment, release, scope and checksum.
4. Inspect the manifest/content without editing the serialised structure manually.

## Import

1. Back up the target configuration and use the test context first. Record the current module FIDs/names and runtime state.
2. Open **File > Import** and select the trusted `.CFG` file.
3. Review every proposed action: **Add**, **Update**, **Add Duplicate**, **Ignore** or **Same**. The importer can default existing folders, Transports and DB Connections to **Ignore**; that is a prompt to review environment ownership, not proof that the existing object is compatible.
4. Compare material rows where available. Do not change the first/root module to **Ignore**.
5. Save the selected actions, inspect every expected object and relation, refresh configuration and test affected callers.

Installed template folders can contain development, backup or scenario-specific files. Their presence does not make them universal supported templates. Never import a file whose origin, version or purpose is unknown.

The importer saves objects in dependency/type order but is not a database-and-runtime transaction. A completed dialog is not sufficient proof that every dependency is correct. If import is wrong, stop affected processing and restore the target backup or previous module set; do not attempt blind reverse imports.

- [Manage modules](../administer-velox/modules-and-folders/lifecycle-actions.md)
- [Package an export](export-and-package.md)
- [Import and validate](import-and-validate.md)
- [Promote configuration](promote-configuration.md)
