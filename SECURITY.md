# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Architecture & Guarantees

`@nymrel/headless-quote` is designed for zero-trust client environments:

1. **Zero `eval()` Policy**: The calculation engine uses strictly typed mathematical evaluators and AST-free pure operators. No arbitrary code execution is permitted in configuration objects.
2. **Strict HTML Sanitization**: All user-supplied inputs (names, emails, notes, custom field values) are stripped of script tags, dangerous HTML elements, and control characters before rendering or webhook dispatch.
3. **Shadow DOM Isolation**: Scoped encapsulation prevents host page JavaScript or malicious style injection from tampering with quote figures or lead input values.
4. **Zero Runtime Dependencies**: The client embed bundle contains zero external npm packages, preventing supply chain attacks.

## Reporting a Vulnerability

If you discover a security vulnerability within this repository, please report it privately:

- **Email**: `contact@jalenbuilds.com` (Subject: `[SECURITY] headless-quote-layer`)
- **Parent Entity**: Nymrel / JalenBuilds LLC

Please do not disclose security issues publicly until a patch has been released. We aim to acknowledge reports within 24 hours and issue fixes within 72 hours.
