# Security Policy

This document describes how to report security vulnerabilities in cross-sns-audience-flow-analyzer
and the response commitments of the maintainers.

## Scope

In scope:

- Source code under this repository's default branch.
- Released artifacts (binaries, packages, container images) published from this repository.
- CI/CD configuration that could affect supply-chain integrity (workflows, actions).

Out of scope:

- Vulnerabilities in third-party dependencies (report upstream; we will track via Dependabot).
- Social engineering of maintainers or contributors.
- Denial of service requiring privileged network position against test environments.

## Reporting a Vulnerability

Please report vulnerabilities **privately** via GitHub Security Advisories:

1. Go to the repository's **Security** tab.
2. Click **Report a vulnerability** (Private vulnerability reporting).
3. Provide a description, reproduction steps, and the impact you observed.

Do **not** file public GitHub Issues, pull requests, or discussions for suspected
vulnerabilities. Doing so can put users at risk before a fix is available.

If GitHub Security Advisories are unavailable, contact the codeowner listed in
`.github/CODEOWNERS` via a private channel.

## Response SLA

| Stage | Target time |
| ----- | ----------- |
| Acknowledgement of report | within 3 business days |
| Initial triage (severity, scope) | within 7 business days |
| Fix or mitigation plan communicated | within 30 business days |
| Public disclosure (coordinated) | after fix is released, or 90 days from report (whichever comes first) |

We follow coordinated disclosure. Researchers will be credited in the advisory
unless they request otherwise.

## Supported Versions

Security fixes are provided for the versions listed below. Older versions receive
fixes only at the maintainers' discretion.

| Version | Supported |
| ------- | --------- |
| latest (default branch) | yes |
| 0.1.x | yes |
| < 0.1.0 | no |

## Safe Harbor

Good-faith security research conducted in accordance with this policy will not
result in legal action from the maintainers. Please avoid privacy violations,
destruction of data, and degradation of service during testing.
