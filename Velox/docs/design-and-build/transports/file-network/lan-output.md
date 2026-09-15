---
title: "Configure LAN output"
description: "Configure outbound local or UNC folder delivery and verify naming, permissions, collision and receiver visibility."
sidebar_position: 70
classification: public
status: approved
owner: Cam Hart
keywords: [LAN output, UNC path, network share, file delivery]
---

LAN output adds no published settings beyond the shared Transport base and the LAN **UNC path**. The path defaults empty, supports `<DEFAULTDIR>` and runtime tags, and is normalised before save.

1. Enter an approved local/UNC destination accessible to the Velox service account; do not use a user-mapped drive.
2. Configure the Flow/File Connection so final names are unique and contract-compliant.
3. Test directory creation/write/move/delete rights actually required by the implementation.
4. Test same-name collision, share outage, slow copy, partial-file visibility and concurrent sends.
5. Confirm the Transport result and receiver processing separately.

The absence of LAN-specific extra options does not make delivery atomic or idempotent. A receiver that watches the target directory can observe partial content depending on copy/publication behaviour. Use a staging/final-name or receiver handshake design where required and reconcile the destination before retry. See [shared Transport settings](../authentication-tls-proxy-timeout-and-retry.md).
