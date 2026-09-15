---
title: "ProcessPath"
description: "Parses an existing Windows file or directory path into drive, directory and file components using the legacy VCL routine."
sidebar_position: 39
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - paths
  - parsing
  - current-directory
---

```Delphi
Procedure ProcessPath( const EditText : string; var Drive : Char; var DirPart : string; var FilePart : string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Drive: Char;
  DirectoryPart: string;
  FilePart: string;
begin
  ProcessPath('C:\Fictional\Inbound\order.csv',
    Drive, DirectoryPart, FilePart);
  Value := Drive + '|' + DirectoryPart + '|' + FilePart;
end;
```

### Usage

`ProcessPath` parses an existing Windows file or directory path into drive, directory and file components using the legacy VCL routine.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `EditText` | `string`, `const` | Existing Windows file/directory text to parse. Wildcards in the final component are retained as a file part. |
| `Drive` | `Char`, `var` | Receives a drive letter for drive-based paths, the current drive for bracketed legacy input, or `#0` for a UNC root. |
| `DirPart` | `string`, `var` | Receives the parsed directory portion. Its exact rooted/relative form depends on drive, UNC and input layout. |
| `FilePart` | `string`, `var` | Receives the final file/wildcard component, or an empty string when the final component is treated as a directory. |

**Returns**

No return value. Results are written to the three `var` arguments. If an exception occurs, one or more outputs may already have been changed.

**Behaviour**

- A final component containing `*` or `?` remains `FilePart` without an existence test.
- An existing file remains `FilePart`.
- A final component that is not an existing file is treated as a directory candidate and passed to `ChDir`; if that succeeds, it is appended to `DirPart` and `FilePart` becomes empty.
- For UNC input, `Drive` is `#0` and the parsed root is prefixed back onto `DirPart`.
- The procedure's outputs depend on the actual current file system, not only on the input characters.

**Usage notes**

Prefer [`ExtractFileDrive`](ExtractFileDrive.md), [`ExtractFileDir`](ExtractFileDir.md), [`ExtractFilePath`](ExtractFilePath.md) and [`ExtractFileName`](ExtractFileName.md) for deterministic lexical parsing. Use `ProcessPath` only for compatibility with its legacy existing-path interpretation and only when shared across the Velox process current-directory mutation is acceptable and controlled.

### Additional Technical Info
`ProcessPath` invokes the legacy Windows VCL path parser to split `EditText` into drive, directory and file components. Unlike the pure `ExtractFile*` helpers, it queries existing paths and temporarily changes the process current directory while interpreting the input.

The example is source-reviewed and was not executed by the documentation workflow. The fictional path is illustrative only; the terminal routine expects the supplied file or directory structure to exist.

**Implementation**

Velox's wrapper directly calls installed `Vcl.FileCtrl.ProcessPath`. The routine saves `GetDir(0)`, seeds `Drive` from that current directory, and initially copies `EditText` into `DirPart`. A value enclosed in `[...]` has the brackets removed as a legacy form. Otherwise it extracts a drive/UNC root, removes that root from `DirPart`, and sets `Drive` to the letter or `#0` for non-drive roots.

It then changes current directory to the root when it exists, derives `FilePart` with `ExtractFileName`, derives/changes into the directory portion, and—when the final component has no wildcard and does not name an existing file—attempts to change into it as a directory and clears `FilePart`. In a `finally` block it attempts to restore the saved current directory, but only when that saved directory still exists.

**Edge cases and quirks**

- The routine temporarily mutates the process-global current directory. Other threads, concurrently executing Flows and relative-path operations can observe or interfere with that state.
- `EditText` is documented by Embarcadero as an existing file or directory name. Missing intermediate/final directories can make `ChDir` raise rather than produce a clean parse.
- Restoration is attempted in `finally`, but only if `DirectoryExists(SaveDir)` remains true. If the saved directory disappears or restoration itself fails, the process can remain in a different current directory.
- `Drive`, `DirPart` and `FilePart` are assigned incrementally. Never consume their values after catching a failure unless the script explicitly resets them.
- Empty input reaches legacy indexing/current-directory logic whose behaviour depends on compiler/runtime checks; it is outside the safe input contract.
- Bracketed input (`'[path]'`) follows a special legacy branch and retains the initially captured current-drive value. Do not assume it behaves like a normal absolute path.
- This is Windows VCL behaviour, not a portable path parser. It uses backslashes, drive letters, `ChDir` and process current-directory state.

**Side effects**

Temporarily changes the process current directory and writes all three `var` outputs. It does not create files or directories, but a failed restoration can leave a persistent process-global directory change.

**Errors**

`ChDir`, current-directory access, malformed/empty legacy input and inaccessible/missing paths can raise. The wrapper does not catch or translate these errors. Outputs can be partial and current-directory restoration is best-effort under the terminal source's condition.

**Performance and concurrency**

The procedure performs multiple directory/file existence queries and current-directory changes, so remote paths can block. It is not thread-safe because the current directory is process-global. Avoid it in concurrent service/Flow execution where pure lexical parsing is sufficient.

**Related entries**

- [`ExtractFileDrive`](ExtractFileDrive.md) performs pure drive/UNC parsing.
- [`ExtractFileDir`](ExtractFileDir.md) and [`ExtractFilePath`](ExtractFilePath.md) split directory text without changing current directory.
- [`ExtractFileName`](ExtractFileName.md) returns the lexical final component.
- [`FileExists`](FileExists.md) and [`DirectoryExists`](DirectoryExists.md) expose the underlying kind checks separately.

**External references**

- [Embarcadero `Vcl.FileCtrl.ProcessPath`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.FileCtrl.ProcessPath)

No applicable same-symbol Free Pascal reference was found. This entry terminates in a Windows VCL routine rather than a Delphi RTL function with a Free Pascal-compatible API.

<small>Created 2026-07-15</small>
