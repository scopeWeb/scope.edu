# Site audit — 25 October 2026

19 HTML routes returned HTTP 200. Static local href/src checks found no missing files. JavaScript syntax checks passed. Desktop browser review covered the general interest form. Responsive CSS includes small-screen layouts, but physical mobile/browser emulation was not available in this review: mobile usability is not fully verified.

Fixed: reject unknown backend submission types before dispatch (prevents bypassing type-specific CAPTCHA checks); align calling-code validation with long country/territory options; remove English-only hero wording from general course interest.

Existing protections reviewed: Turnstile validation, server-side required fields/consents, spreadsheet formula escaping, locked international submissions and reference deduplication, no public applicant-data response in status endpoint. This is a limited review, not a penetration-test certification.

Remaining: redeploy Apps Script for backend fixes; verify a labelled test submission and its row in the actual Sheet; verify payment emails/trigger permissions; test physical mobile widths and keyboard use. Desktop orbital logo currently appears clipped and needs visual correction. Mail send and sent-marker update are not atomic; concurrent manual/trigger sends require additional locking to avoid duplicate email risk. No real applicant emails were sent during this audit.
