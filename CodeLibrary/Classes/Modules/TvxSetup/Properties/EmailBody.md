---
title: EmailBody
description: Exposes the setup-owned live string list copied into the default body of newly created email helpers.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, email-body, tstringlist]
---

```Delphi
property EmailBody: TStringList read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    if Setup.EmailBody <> nil then
      Value := Setup.EmailBody.Text
    else
      Value := ''
  else
    Value := '';
end;
```

### Usage

`EmailBody` exposes the setup-owned live string list copied into the default body of newly created email helpers.

**Email lifecycle**

A new Velox email helper copies `Setup.EmailBody.Text` into its own default-body string during construction. If message-specific code has not supplied a body, the helper uses that snapshot. Existing helpers/messages do not refresh when EmailBody later changes.

The stored text is not automatically tag-processed, HTML-sanitised or classified by this property. Later email code can encode/use it as message content. Avoid credentials, personal data and untrusted markup, and consider message size and disclosure to every recipient that uses the default.

An edit changes in-memory global state but does not itself save setup or send email.

### Additional Technical Info
`EmailBody` is the `TvxSetup`-owned `TStringList` containing the process-wide default email body.

Setup creates and owns one list and frees it with the setup object. The property setter locks Setup and calls `Assign`, copying the supplied strings into the owned list; it does not replace list ownership. Passing nil is not guarded and can raise when Assign tries to read it.

**Live getter and locking quirk**

The getter locks only long enough to return the list reference, then releases the lock. Calls such as `Setup.EmailBody.Add`, `Clear` or `Text := ...` mutate the shared list after that lock has ended. Those changes bypass the property's locked setter and are not safe against concurrent readers/writers.

Do not free the returned list or retain it after Setup is reloaded/destroyed. For governed changes, construct/prepare a complete list and use a controlled setup update rather than incrementally mutating the global list during parallel processing.

**Delphi/Free Pascal references**

- [Embarcadero `System.Classes.TStrings.Assign`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStrings.Assign) — copy operation used by the setter.
- [Free Pascal `TStrings.Assign`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.assign.html) — compatible list-assignment semantics.

<small>Created 2026-07-15</small>
