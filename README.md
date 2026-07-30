# url-shortener

A lightweight and self-hosted URL shortener

## Analytics

Authenticated URL owners can query analytics with:

```http
GET /urls/:id/analytics?page=1&limit=25
```

The response contains the total and paginated access history, plus
distributions by browser, operating system, device type and location. Totals
collected before the analytics migration are preserved as `legacyAccesses`;
because their original metadata did not exist, they are not included in the
history or distributions.

IP addresses are not stored. Approximate location can be read from Cloudflare
or Vercel location headers by setting `ANALYTICS_TRUST_GEO_HEADERS=true`. Only
enable this when the application is behind a trusted proxy that removes or
overwrites those headers from clients.
