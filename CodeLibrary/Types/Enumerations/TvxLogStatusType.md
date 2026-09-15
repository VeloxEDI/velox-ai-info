---
title: TvxLogStatusType
description: Classifies Velox execution and log outcomes that drive success checks, persistence, file routing and notification behavior.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, log, status, warning, issue, error]
---

```Delphi
TvxLogStatusType = (flsNotSet, flsOK, flsWarning, flsIssue, flsDuplicate, flsCancelled, flsError, flsTest, flsHighlight)
```

### Example

```Delphi
procedure ClassifyStatus(Status: TvxLogStatusType; var Value: Variant);
begin
  case Status of
    flsOK: Value := 'success';
    flsWarning, flsIssue, flsDuplicate: Value := 'attention';
    flsCancelled: Value := 'cancelled';
    flsError: Value := 'error';
  else
    Value := 'non-terminal';
  end;
end;
```

### Usage

`TvxLogStatusType` classifies Velox execution and log outcomes that drive success checks, persistence, file routing and notification behaviour.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| `flsNotSet` | 0 | No status selected; display `Not Set`, admin-class mapping. |
| `flsOK` | 1 | Successful/informational outcome; display `Successful`. |
| `flsWarning` | 2 | Warning outcome; usually saved and notified. |
| `flsIssue` | 3 | Business/data issue; routes files to the issue area. |
| `flsDuplicate` | 4 | Duplicate outcome; routes files to the duplicate area. |
| `flsCancelled` | 5 | Execution cancelled or no work; excluded from the default saved-status set. |
| `flsError` | 6 | System/error outcome; admin-class mapping and error routing. |
| `flsTest` | 7 | Test-only status; display `Test`. |
| `flsHighlight` | 8 | Highlighted informational line; display string is `Note`. |

#### Behavior and boundaries

- `TvxLog.SetStatusType` copies a value to overall/header/row StatusType only when `Value > current`. It is therefore monotonic by declaration ordinal, not by business severity. Test(7) blocks later Error(6), and Highlight(8) blocks every later normal setter update.
- Independently of whether the enum update is accepted, passing Error sets the separate Boolean `Status=False`, and passing OK sets it `True`. StatusType and Boolean Status can therefore disagree. Other members do not change that Boolean.
- Normal assignment cannot lower/clear status. Reset paths directly restore OK; `IsCancelled=False` directly writes NotSet before sending OK through the setter as a special bypass.
- Default action settings save OK, Warning, Issue, Duplicate and Error; they send notifications for Warning, Issue, Duplicate and Error. Cancelled, Test and Highlight are excluded unless configuration changes.
- File audit routing treats OK, Warning, Cancelled and Error as audit-directory outcomes; Issue and Duplicate have separate directories.
- The static email-type table maps Test to Admin and Highlight to Notify, but several `GetEmailForType` case statements handle only NotSet through Error. Test/Highlight can therefore yield an empty/default result in those paths.
- REST execution paths differ: one treats only Error as client-error status, while another treats Issue and Error as client errors. Read the endpoint behavior rather than inferring from ordinal.
- `flsHighlight` is not semantically more severe than `flsError` despite its higher ordinal, but it mechanically dominates the current monotonic setter. Never use ordinal comparison in script to rank severity, and do not manually assign Test/Highlight as the overall outcome.
- Status changes can affect persistence, notifications, retries, file movement and API response codes. Set the most specific named outcome deliberately.

### Additional Technical Info
`TvxLogStatusType` is Velox's execution/log outcome classification. It is not a semantic increasing severity scale: several members control different business paths, and `flsHighlight` is displayed as a note. The current setter nevertheless uses ordinal comparison as a retention rule, which creates the important quirks below.

A fresh/reset log uses `flsOK`. `TvxLog.IsSuccess` returns true only for `flsOK`; warning, issue, duplicate, cancelled, error, test and highlight are not reported by that exact helper as success.

**External references**

- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
