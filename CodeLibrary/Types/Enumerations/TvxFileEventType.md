---
title: TvxFileEventType
description: Names script-visible Velox file lifecycle events while exposing a critical shifted-ordinal importer defect after Write.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, file, event, audit, logging, importer]
---

```Delphi
TvxFileEventType = (fetNone, fetRead, fetWrite, fetAudit, fetError, fetIssue, fetTemp, fetTransport, fetDelete)
```

### Example

```Delphi
procedure MarkRead(FileCon: TvxFileCon);
begin
  // fetRead is safe because its script and host ordinals are both 1.
  FileCon.FileEvent := fetRead;
end;
```

### Usage

`TvxFileEventType` names Velox file lifecycle events, but values after `fetWrite` are shifted in the current scripting interface and can record the wrong event.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| `fetNone` | 0 | No event; maps correctly to Velox `fetNone`. |
| `fetRead` | 1 | File read; maps correctly to Velox `fetRead`. |
| `fetWrite` | 2 | File written; maps correctly to Velox `fetWrite`. |
| `fetAudit` | 3 | Intended audited/moved-to-audit; currently reaches Velox `fetDownload`. |
| `fetError` | 4 | Intended error event; currently reaches Velox `fetAudit`. |
| `fetIssue` | 5 | Intended issue event; currently reaches Velox `fetError`. |
| `fetTemp` | 6 | Intended moved-to-temporary state; currently reaches Velox `fetIssue`. |
| `fetTransport` | 7 | Intended transporting state; currently reaches Velox `fetTemp`. |
| `fetDelete` | 8 | Intended deletion; currently reaches Velox `fetTransport`. |

#### Behavior and boundaries

- Do not assign `fetAudit` through `fetDelete` to a Velox file-event property or method in the current version.
- The Velox `fetDownload` (ordinal 3) is not nameable by scripts, yet receives script `fetAudit`. Velox `fetDelete` (ordinal 9) is not representable by the current script enum.
- Reading a Velox value after the gap is also unsafe: the ordinal can be mislabeled, and Velox ordinal 9 lies beyond the script declaration's highest value.
- This is not merely a display difference. File-event values feed audit/log state and can misrepresent what happened to a file.
- Persist named business events outside this enum boundary and translate with a tested mapping at the Velox edge.

### Additional Technical Info
`TvxFileEventType` records the current/lifecycle action for a file connection and file log. The product host enum has ten members, but the script importer omits `fetDownload` between `fetWrite` and `fetAudit`.

**Current defect:** the `TvxFileCon.FileEvent` runtime helper assigns the script enum directly to the native enum without an ordinal adapter. Only `fetNone`, `fetRead` and `fetWrite` are safely aligned. Every later script member is interpreted as the preceding native member.

**External references**

- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - why declaration order controls ordinals.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible ordinal model.

<small>Created 2026-07-15</small>
