---
status: active
updated: 2026-08-29
---

# Failure policy

Project-wide defaults for what happens when something goes wrong, keyed to v1.0 §14.4 and §18. A
feature may override a default only by saying so in its own spec. The shared posture: keep the last
good state, mark it stale, name the reason — never substitute a value that cannot be told apart from
a real one.

### XC-030 - Default failure semantics
- statement: on failure the system keeps the last good state, marks it stale, and names the reason; a value that cannot be computed is shown as missing, never silently substituted
- never: swallow the error, blank the @Canvas, or render a fabricated number where a real one is expected
- user_visible: a stale marker plus a message naming the cause, carrying a message ID per XC-037
- decidedness: Bounded

### XC-031 - Partial results
- statement: partial data is displayed, and every gap is named with its cause (not connected, not yet fetched, out of range) in the pane that would show the value
- never: fill a gap by interpolation, or hide the affected pane so the gap is invisible
- user_visible: a missing-value marker in the value's slot and the named cause (detail-panel/AC-002)
- decidedness: Bounded

### XC-032 - External API failure
- statement: when a @Platform API call fails, the last computed graph stays rendered with a stale marker and the stated reason, per INV-005; no new @Recalculation is attempted until the next trigger or manual refresh
- never: empty the @Canvas or drop nodes because their source is unreachable
- user_visible: a stale badge on the affected nodes and the reason in the detail panel
- decidedness: Bounded

### XC-033 - Metadata failure
- statement: when a @Metadata fetch fails or exceeds LIM-006, the system creates a provisional @Node marked title-pending and offers manual retry (url-nodes/REQ-002)
- never: discard the submitted URL or block node creation on the fetch
- user_visible: a provisional node showing its kind icon and domain label until a retry succeeds
- decidedness: Bounded

### XC-034 - Recalculation failure
- statement: when a @Recalculation job fails, the last computed edges stay rendered, the results are marked stale, and the failure reason is surfaced (flow-analysis/AC-009)
- never: remove edges, reset thresholds, or discard manual edits because a job failed
- user_visible: a stale marker on the edge layer and the reason in the recalculation status
- decidedness: Bounded

### XC-035 - Authorization expiry
- statement: when a @Platform responds with an authorization failure, the @Connection is marked expired, its nodes are badged on the @Canvas, and re-authentication is prompted (sns-connection/AC-005)
- never: retry with the expired token in a loop, or delete the connection's already ingested @Metric series
- user_visible: an expired badge on the connection and on its nodes, with a re-authenticate action
- decidedness: Bounded

### XC-036 - Retry and timeout
- statement: transient failures (network, 5xx, rate limiting) are retried with exponential backoff inside the platform's rate limits; after the last try the matching default above applies, and user-initiated actions always offer manual retry
- never: retry an authorization failure (XC-035 applies) or retry past an exhausted quota window (the LIM-011 deferral applies)
- user_visible: nothing while retries run inside the original operation's timeout; the matching failure default after the last try
- decidedness: Bounded

### XC-037 - Message identifiers
- statement: every user-visible failure message carries a message ID of the form `domain.reason` (examples: `metadata.timeout`, `auth.expired`, `recalc.failed`, `sync.deferred`, `edge.duplicate`, `url.invalid`), and the message text names the limit or cause that refused the action
- never: show a raw exception string, stack trace, or platform error body verbatim to the user
- user_visible: the message text; the ID itself travels in logs and support output
- decidedness: Bounded
