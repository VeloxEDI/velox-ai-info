---
title: Velox documentation
description: Customer guidance for installing, configuring, operating and using the Velox integration platform.
sidebar_position: 1
classification: public
status: approved
owner: Cam Hart
keywords:
  - Velox
  - integration
  - documentation
---

Welcome to the Velox reference documentation. Velox is a Windows-based integration platform for connecting systems, transforming structured data and operating repeatable integration Flows.

This site is primarily a technical reference. For the best experience while designing or editing an integration, open the documentation from **Velox Designer > Help > Code Library**: the Velox application gives you the reference in the context where you are working.

The public site and the Code Library installed with Velox are built from the same governed documentation source. To update your local copy, run `C:\ProgramData\Velox\_Update Velox Data from GIT.bat` using your organisation's approved update process, then reopen the affected Help/Code Library view.

## Choose your path

- [Getting started](getting-started/index.md): understand Velox, navigate Designer and build a first test Flow.
- [Install and upgrade](install-and-upgrade/index.md): plan, deploy, verify, upgrade and recover an environment.
- [Administer Velox](administer-velox/index.md): manage contexts, global settings, modules, services and recovery controls.
- [Design and build integrations](design-and-build/index.md): configure Connections, Definitions, Flows, transformations, Transports, APIs and scripts.
- [Operate and troubleshoot Velox](operate-and-troubleshoot/index.md): monitor work, interpret logs and recover failures.
- [Promote and govern configuration](promote-and-govern/index.md): export, compare and move reviewed configuration.
- [Use the VxData portal](vxdata-portal/index.md): work with deployed transaction and master-data workflows.
- [Technical reference](technical-reference/index.md): look up module types, field ownership, runtime, format, status, security and maintenance behaviour.

## Before changing configuration

Confirm the selected system connection and test/production context. Use fictional or sanitised test data, record the starting state and understand the effect on shared modules, service identities and external systems.

Available fields and integrations depend on the installed release and deployment. A selectable option does not by itself certify compatibility or security. Use approved release information and verify behaviour in the target environment.

Never put passwords, tokens, private keys, customer data or production identifiers into documentation or support examples.

## Product and documentation boundaries

Detailed implementation information belongs in the internal Product Knowledge Base, and generated scripting signatures belong in the installed Code Library. This public site explains supported user workflows without exposing internal source details.

API and portal deployments require their own approved authentication, authorisation, TLS and network boundaries. Do not expose a service merely because it responds on a configured endpoint.
