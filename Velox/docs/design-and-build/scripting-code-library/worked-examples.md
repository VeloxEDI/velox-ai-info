---
title: "Velox Scripting worked examples"
description: "Build and test a small reusable scripting rule with fictional data"
sidebar_position: 40
slug: /scripting/worked-examples
classification: public
status: approved
owner: Cam Hart
keywords:
  - "script"
  - "examples"
  - "integration"
---

This tutorial creates a small Scriptlet and uses it in a Map field event. The fictional rule prefixes an incoming reference so that `1042` becomes `TEST-1042`.

## What you will build

You will create a reusable PascalScript function, include it in a test Map and verify its result with sanitised data. The example deliberately has no database, filesystem or network side effect.

## Prerequisites

- Permission to create a Scriptlet and edit a test Map.
- A non-production Map with a text destination field and sanitised source value `1042`.
- The installed Code Library available in Designer.

Function availability and event declarations can vary by installed Velox version. Compile this example in the target installation rather than treating the text as a version guarantee.

## Task 1: Create the Scriptlet

1. Create a Scriptlet named `ExamplePrefix`.
2. Enter this code:

   ```pascal
   function AddExamplePrefix(const AValue: string): string;
   begin
     Result := 'TEST-' + AValue;
   end;
   ```

3. Select **Test Compile**.
4. Resolve any declaration or syntax error reported by the installed version, then save.

Checkpoint: the Scriptlet compiles and reopens with the saved function.

## Task 2: Use it in a Map

1. Open the test Map and select the destination text field.
2. Open the field's mapping script or **On Map** event.
3. Drag `ExamplePrefix` from the Scriptlet tree into the editor. Designer inserts the include directive at the top.
4. In the event body, assign the function result to the event value:

   ```pascal
   Value := AddExamplePrefix(Value);
   ```

5. Select **Test Compile**, then save the Map.

Checkpoint: the Map's script compiles with the generated Scriptlet include in place.

## Task 3: Test the result

1. Run the Map's test action with the sanitised source value `1042`.
2. Inspect the mapped destination value.
3. Confirm it is `TEST-1042`.
4. Also test an empty value and decide whether the integration should produce `TEST-`, preserve an empty value or apply a separate validation rule.

That empty-value decision is business-specific. Do not add an assumed rule to production code.

## Clean up

Remove the example call and Scriptlet include from the test Map when the exercise is complete. Delete the example Scriptlet only after confirming no other test module includes it.

## What this demonstrates

- A Scriptlet provides one reusable implementation.
- Dragging the Scriptlet lets Designer generate and position its include directive.
- Compile success must be followed by a test in the owning context.
- Boundary behaviour, such as empty input, must be specified rather than guessed.

## Next steps

- [Configure variables and Scriptlets](variables-and-scriptlets.md)
- [Write and test Velox scripts](editor-and-testing.md)
- [Use the Velox Code Library](code-library.md)
