---
title: CFG import packaging
description: Package native Velox modules with the correct template wrapper, primary module order, identities and activation states.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-11-17T23:28:09Z"
---

# CFG import packaging

Read this standard before generating or materially changing an importable CFG package, regardless of module type. Follow [shared authoring rules](common.md), the [AI-generation checklist](common.md#ai-generation-checklist) and the [native import procedure](../Velox/docs/promote-and-govern/import-and-validate.md).

## Observed failure and combined correction

The user reported that an AI-generated EMD CFG failed to import its modules correctly. Its `TvxConfigTemplate` wrapper had a newly generated `FIDS` and `Active = False`. Its first child was a disabled folder, and all supporting modules were disabled.

The corrected package imported successfully after all of the following changes were applied together:

1. Use wrapper `FIDS = '{11111111-1111-1111-1111-111111111111}'`.
2. Set the wrapper's `Active = True`.
3. Put the primary requested module first inside the wrapper. This was a `TvxActionMan` for the Process-led package; place the folder and dependencies after it.
4. Set supporting modules active while keeping all three Processes `Active = False`.

Scripts, mappings, SQL, real module GUIDs and references were unchanged. This is evidence for the combined correction in that package. No single change was independently isolated or proven to cause or fix the failure. Do not describe wrapper activation, identity, order or dependency activation as a separately established root cause.

## Authoring requirements

### Distinguish wrapper identity from real module identities

- For the `TvxConfigTemplate` format, use the canonical wrapper sentinel above and `Active = True`. Do not give this packaging wrapper a newly generated module identity or disable it as though it were a Process.
- Reserve the sentinel as the authored wrapper's identity; do not assign it as a real module's `FIDS`. Genuinely new modules need their own distinct identities. Preserve existing module identities when editing and preserve every reference to the intended module.
- Reference properties and module identities are different roles. Do not search-and-replace every GUID or reference field. Preserve verified native system references and real dependency references; the sentinel rule is not permission to change them.

### Put the primary requested module first

Follow a verified native export from the applicable Velox version and module type for wrapper structure, nested objects, property syntax and module order. For a Process-led package, put its primary `TvxActionMan` first, before the folder and dependencies. Do not put an organisational folder first merely because other objects reference that folder. Preserve the native dependency layout; do not infer a universal order for every other dependency family.

The file's primary-module order and the importer's internal dependency/type save order are distinct. Existing documentation describes internal save ordering; that does not justify rearranging the package root or making the first/root module **Ignore**.

### Separate Process activation from supporting-module activation

For a package requested with Processes disabled, set the included Process modules' `Active = False`. In the reported correction, this applied to all three Processes. The wrapper remains active, and the supporting modules required by that package are active. Do not interpret “keep Processes disabled” as a blanket instruction to set every included object's `Active = False`.

Review each actual module's role and its native properties. Preserve explicitly required exceptions and record them in the manifest instead of blindly changing every property named `Active`. A module's `Active`, a Process action item's `ItemActive`, and runtime dataset state are not interchangeable instructions. Do not enable a Process, its triggers or linked Processes as an incidental packaging change.

### Keep native class and property names

Human-facing instructions may call the primary executable module a **Process**; existing product pages also use **Flow**. Keep the native `TvxActionMan` class and properties such as `FIDS`, `FolderFIDS`, `Active` and applicable native action-reference properties exactly as exported. Do not invent `TvxProcess` or rename streamed properties to match display terminology.

## Small annotated example

### Flow child-data binding companion standard

For packages containing Flow actions/data, also follow [CFG Flow child-data bindings](flows/child-data-bindings.md). Use the verified native naming/ownership pattern, keep action Source/Dest component references distinct from Definition SourceFIDS/DestFIDS, and check the intended Map/Transport/Custom Script data classes. The user-verified correction involved naming and reference changes together; do not attribute the outcome to any single change or declare arbitrary names universally unsupported. Reopen the imported Flow and confirm selections persist. Static reference validation does not establish successful native binding.

### Wrapper illustration

This is a structural illustration, not a complete importable or tested CFG. All non-sentinel identities are fictional examples, not reusable identities for new generated modules. It omits action steps, Definitions, connections and version-specific metadata; construct complete packages from verified native exports.

```text
object TvxConfigTemplate
  FIDS = '{11111111-1111-1111-1111-111111111111}'
  FolderFIDS = '{00000000-0000-0000-0000-000000000000}'
  ModuleName = 'Example Process package'
  Active = True
  object ExampleProcess: TvxActionMan
    FIDS = '{B7A40C31-5D82-4A69-905C-2D7EB310AC41}'
    FolderFIDS = '{F069D284-C83B-41CE-B0E2-74A51E652D90}'
    ModuleName = 'Example Process'
    Active = False
  end
  object ExampleFolder: TvxFolder
    FIDS = '{F069D284-C83B-41CE-B0E2-74A51E652D90}'
    FolderFIDS = '{00000000-0000-0000-0000-000000000000}'
    ModuleName = 'Example folder'
    Active = True
  end
  object ExampleMap: TvxMap
    FIDS = '{C290E174-8E65-4F39-A037-6B412958DF20}'
    FolderFIDS = '{F069D284-C83B-41CE-B0E2-74A51E652D90}'
    ModuleName = 'Example Map'
    Active = True
  end
end
```

Annotations:

1. The wrapper has the fixed sentinel and is active; it is not the requested Process module.
2. The first child is the requested Process, with its own identity and `Active = False`.
3. The folder follows the Process. Its identity matches both `FolderFIDS` references; forward references must be retained, not replaced with the wrapper sentinel.
4. The supporting Map has another distinct identity and is active. A complete Process would need its real action/reference graph; the snippet does not claim that this Map is wired to an omitted action.

## Import review and separate validation gates

1. **Static authoring checks:** compare the wrapper, first module, real identities/references and per-module activation manifest with the verified native pattern. Confirm all requested modules and dependencies are included. Do not assume the count of all streamed objects equals the importer's module count: wrappers, child script items and data-manager objects have different roles.
2. **Importer review:** inspect the expected root module and expected module count against the package manifest. Review every **Add**, **Update**, **Add Duplicate**, **Ignore** and **Same** decision, including folders and supporting modules. Do not mark the primary/root module **Ignore**. Reconcile unexpected counts, roots or decisions before proceeding.
3. **Successful import:** inspect the resulting target modules, identities, references, locations and activation states. A static parser pass or completed dialog alone is not evidence that the intended graph was imported correctly. Import is not an all-or-nothing transaction; use the documented recovery procedure when the result is uncertain.
4. **Native Test Compile:** run the installed Velox native Test Compile for the applicable imported modules and record its actual result and product version. Authored `CompiledStatus` values, an extraction test or successful import are not proof of compilation.
5. **Controlled execution:** report functional/runtime checks separately. Do not automatically activate the Processes to demonstrate import or compilation success.

If any gate cannot be run, say so explicitly. Never report static validation, successful import, native Test Compile and execution as interchangeable outcomes.

## Sources and verification scope

- **User-observed EMD case:** supplied failure/correction description and successful import. The original and corrected package files, import logs and build number were not supplied for direct comparison here. The combined outcome is user-reported; no independent native import or Test Compile was performed for this documentation update.
- **Bundled native export:** `plugins/velox-config/skills/velox-config/references/example-order-import.cfg` in the local `velox-ai-plugins` repository. Inspected its wrapper header and top-level module layout: canonical sentinel, active wrapper, `TvxActionMan` first, folder/dependencies later, distinct real module identities and active supporting modules. Its Process is active, so it does not independently prove the disabled-Process policy from the reported correction. No customer names, real module identities, scripts or connection settings were copied into the example above.
- **Older export samples:** locally inspected archives use legacy `TFloArchive`/`TFloActionManager` classes. They are not evidence that this sentinel/format rule applies to all historical archive formats. Their version-specific structure was not copied into the new example.
- **Existing authorities:** [import and validate](../Velox/docs/promote-and-govern/import-and-validate.md), [configuration templates](../Velox/docs/promote-and-govern/configuration-templates.md), [export and package](../Velox/docs/promote-and-govern/export-and-package.md) and [Process/Flow activation](../Velox/docs/design-and-build/flows/flow-properties-and-execution-policy.md). These corroborate root/action review, dependency-aware import and activation cautions. Ordinary promotion guidance prefers correcting source modules and re-exporting; AI authoring must follow verified native structures rather than treating the illustration as a replacement export.

The importer implementation was not reverified. The necessity of each correction in isolation, behaviour across all module types/builds and successful import/compilation of the illustrative snippet remain unverified. Maintain a native-export evidence trail for the actual target package and report these limits rather than claiming universal importer semantics.
