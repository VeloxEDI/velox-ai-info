---
title: "Operate Velox API Service"
description: "Start, stop, refresh and verify Velox API Service and its REST Flow endpoints."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [Velox API Service, REST Flow, restart, listener]
---

Velox API Service loads the selected connection and REST-enabled Flow definitions, then listens on the General Setup API port. It is separate from Velox Service and from any external gateway or VxData web application.

## Configuration contract

- The service command line selects a `Connections.json` key and unique name; the test flag selects test roles.
- The listener uses `VeloxAPIPort`, falling back to `8359` when the stored value is `0`.
- The reviewed listener startup does not bind General Setup certificate/SSL settings. Deploy TLS/authentication through an approved architecture.
- Current API Service IPC branches for live Flow enable/disable/change are incomplete or do not visibly resynchronise the REST manager.

:::caution Restart after endpoint changes
Restart Velox API Service as the safe verified refresh method after adding, removing or materially changing REST Flow endpoints.
:::

## Verify operation

1. Confirm the process uses the intended connection key/environment and listener port.
2. Confirm the port is owned by the expected process and reachable only through the approved network path.
3. Invoke a controlled GET or POST REST Flow through the deployed gateway.
4. Verify HTTP result, Flow Log, response definition and side effects.
5. Confirm OpenAPI metadata matches actual runtime support; generated schema can describe methods the reviewed core dispatcher does not execute.

See [API troubleshooting](../../operate-and-troubleshoot/api-troubleshooting.md).
