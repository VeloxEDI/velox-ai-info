---
title: "Access and navigate the VxData portal"
description: "Sign in and use navigation available to your assigned role"
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [portal, sign-in, navigation]
---

## Sign in

1. Open the HTTPS portal URL supplied by your administrator.
2. Enter your assigned credentials and complete any organisation-specific authentication step.
3. Confirm the displayed account and available navigation before viewing or changing data.

Authenticated users can use configured Transaction and Flow areas. The **Administration** and **Dashboard** controller areas require the `Administrator` role in the current application. Data repositories also apply user-party checks to supported records; role and party assignment therefore solve different access questions.

## Access model

| Symptom | Likely boundary |
| --- | --- |
| Sign-in page/account rejected | Portal identity, account state, authentication configuration or session/cookie |
| Administration/Dashboard absent or forbidden | `Administrator` role not assigned or session role claim stale |
| Transaction page opens but records are absent | User-party assignment, date/status filters, application/owner relationships or no matching data |
| Record opens read-only | Business ownership check can prevent a non-administrator editing an existing shipment |
| Flow list/action missing | Portal Flow mapping, system/user setting or linked Velox Flow availability |

Search/date/status choices may be retained in browser cookies for supported shipment workflows. Clear or update filters deliberately; do not infer that an empty list means the data was deleted.

Use search, filters and page controls to narrow lists before opening a record. Browser refresh does not guarantee that a previous edit or Flow action was cancelled; verify the resulting record or action status.

If sign-in or access fails, check the exact URL, environment, account status, assigned role/party and session expiry with your portal administrator. Do not share passwords, session cookies or reset links. Sign out and close shared-browser sessions when finished.

- [Transaction workflows](transaction-workflows.md)
- [Portal administration](administration.md)
- [Flow actions](flow-actions.md)
- [Portal troubleshooting](troubleshooting.md)
