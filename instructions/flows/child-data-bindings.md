---
title: CFG Flow child-data bindings
description: Preserve native child-component ownership and action Source/Dest references when authoring CFG packages.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-11-17T23:28:09Z"
---

# CFG Flow child-data bindings

Read this standard before generating, editing or reviewing Flow data items or Map, Transport and Custom Script action bindings in CFG output. Follow [CFG packaging](../cfg-packaging.md), [shared rules](../common.md) and the [generation checklist](../common.md#ai-generation-checklist). Keep the native `TvxActionMan` class even when prose calls the module a Process.

## User-verified combined correction

The user reported that an AI-authored CFG imported its Flow data items, but the Map action's Source Data and Destination Data selections appeared blank. The authored package reused generic component names such as `SSTInput` and `SSTOutput`. A repaired native export used `vxDefDB<number>` and `vxDefFile<number>` component names with matching unquoted `Source`/`Dest` references.

A revised package used unique native-style data-component names throughout its Flows, with matching references on Map, Transport and Custom Script actions. The user confirmed that the revised package imported with populated links.

These changes were tested together. This is evidence for the combined correction in that package; it does not establish that arbitrary component names are universally unsupported, that names alone caused the blank selections, or that any one individual change was independently necessary. The repaired package, original package and native import logs/build number were not supplied for direct comparison in this update.

## Authoring requirements

1. Follow a verified native export for the applicable version/type, including child-component naming, declaration placement and ownership. Prefer unique native-style names such as `vxDefDB1` and `vxDefFile2` throughout a generated package. Treat numeric suffixes as component identifiers, not Definition identities. Do not impose a universal name restriction beyond the evidence.
2. Declare Flow-local data items under that Flow's `TvxDefManager`, as shown by the inspected native pattern. Keep their actual native classes: `TvxDefDB` for database data and `TvxDefFile` for file data. Shared Definition modules use different classes (`TvxDBDef` and `TvxFileDef`); they are not the child objects an action selects.
3. An action's `Source` and `Dest` reference the actual declared Flow child component names, unquoted. Do not substitute a Definition module's human-readable name, its GUID or a role label. Resolve against the correct owning Flow, not a similarly named data item in another Flow.
4. Keep module references distinct. A Flow child's `SourceFIDS` references its underlying Definition module, including when that child is used as an action's destination. A Map module's `SourceFIDS`/`DestFIDS` describe its underlying Definition references. These properties do not replace the action's component-valued `Source`/`Dest`.
5. Put human-readable labels in the appropriate native properties: `SourceName` for a Flow data item's role, `ActionName` for an action's label and `ModuleName` for a real module's display name. Do not rename native properties to match display terminology.
6. Verify Map Source and Dest against the declared data items and the selected Map's expected types/Definitions. Outbound Transport Source requires a file data item in the documented profile. Custom Script Source requires a compatible Definition-backed item. Follow verified native patterns for any version-specific exception or additional action class; do not guess a class from a component name's prefix alone.

## Generic structural example

This fragment shows child ownership and three action bindings. It deliberately omits wrapper details, module identities/references, action module selection, scripts and other required native metadata. It is not a complete importable or compiled CFG. There are no customer identifiers, GUIDs or credentials in the example.

```text
object ExampleProcess: TvxActionMan
  Active = False
  object vxActionMap1: TvxActionMap
    ActionName = 'Example mapping'
    Source = vxDefDB1
    Dest = vxDefFile2
  end
  object vxActionTransport1: TvxActionTransport
    ActionName = 'Example outbound registration'
    Source = vxDefFile2
  end
  object vxActionCustomScript1: TvxActionCustomScript
    ActionName = 'Example script'
    Source = vxDefDB1
  end
  object TvxDefManager
    object vxDefDB1: TvxDefDB
      SourceName = 'Example input'
      SourceType = fstDatabase
    end
    object vxDefFile2: TvxDefFile
      SourceName = 'Example output'
      SourceType = fstFile
    end
  end
end
```

The references can precede the declared data items in the native layout. The Map points at the declared DB/file children, Transport points at the file child and Custom Script points at the DB child. The role labels do not replace these component references. Before producing a complete package, supply and verify the omitted real module references and selected Map's contract.

## Static regression checks

Run from this repository, and repeat the audit with `--root` pointing at generated CFG output:

```text
node --test tools/tests/check-cfg-bindings.test.mjs
node tools/check-cfg-bindings.mjs
```

The read-only checker examines CFG files and relevant CFG fragments in Markdown. It reports missing/nil/quoted or unresolved references, incorrect owning Flows/containers, ambiguous local children and incompatible known classes. Map Source/Dest accept the documented DB/file child classes; when the selected Map's metadata is included, the checker also compares its known SourceType/DestType. Outbound Transport Source must resolve to a file child; Custom Script Source must resolve to a DB/file child.

Non-native naming and name reuse across different Flow scopes produce preference notes, not a claim of universal native incompatibility. Duplicate children inside the same Flow are reported as structurally ambiguous. Missing selected-Map metadata is reported as an unverified contract, not silently treated as proof of exact compatibility.

The checker models the inspected text-stream structure and known classes; it is not a complete native importer/parser. It does not prove that module GUIDs exist, every Definition matches, inheritance/additional classes are supported, the package is complete, or native component binding succeeds. Verify unfamiliar structures/classes natively before extending the profile. Deliberately invalid Markdown CFG examples must carry `velox-cfg="invalid" reason="..."` fence metadata and a visible do-not-copy label.

## Native import and persistence verification

After import, reopen the Flow and inspect Map source/destination, Transport source and Custom Script source selections. Save and reopen as appropriate to confirm the intended selections persist; compare with the package manifest. An imported data-item list alone does not demonstrate that action selections were bound correctly.

Record these results separately:

- **Static validation:** reference resolution, ownership and class checks.
- **Native import/binding:** actual populated selections in the target Velox build, including reopening/persistence checks.
- **Native compilation:** Test Compile in each owning event/module context; authored CompiledStatus is not compilation evidence.
- **Execution:** controlled test results and permitted side effects.

Do not claim a static pass reproduces the user-observed successful native import. If any native gate is unavailable, say not performed/unverified.

## Sources and evidence limits

- **User report:** blank Map selections and the successful revised-package outcome above. The correction was combined, with no isolated causal proof.
- **Inspected native export pattern:** the bundled `example-order-import.cfg` in the local `velox-ai-plugins` skill references declares Map and Custom Script actions using unquoted component references to `TvxDefDB`/`TvxDefFile` children under the Flow's `TvxDefManager`. It corroborates the structure, not a universal naming ban or the exact repaired-package outcome. No customer content was copied from it.
- **Existing product documentation:** [common action properties](../../Velox/docs/design-and-build/flows/steps/step-concepts-and-common-properties.md), [database Flow data](../../Velox/docs/design-and-build/flows/data/database-data-items.md), [file Flow data](../../Velox/docs/design-and-build/flows/data/file-data-items.md), [Map actions](../../Velox/docs/design-and-build/flows/steps/map-step.md), [outbound Transport actions](../../Velox/docs/design-and-build/flows/steps/outbound-transport-step.md) and [Custom Script actions](../../Velox/docs/design-and-build/flows/steps/custom-script-step.md) support the distinction between Flow-local data, module references and action-specific type requirements.

The native importer implementation was not reverified. This documentation/check update did not import, compile or execute a CFG in Velox and did not change any customer configuration. Native binding and compilation of the illustrative fragment remain unverified.
