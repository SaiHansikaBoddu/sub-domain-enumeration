const express = require('express');
const cors = require('cors');
const dns = require('dns').promises;

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// List of common subdomains to check
const CANDIDATE_SUBDOMAINS = [
  'www',
  'mail',
  'api',
  'dev',
  'test',
  'staging',
  'admin',
  'portal',
  'blog'
];

/**
 * Validates whether the given input is a clean domain name.
 * Rejects URLs (http/https), protocols, paths, empty strings, and malformed names.
 */
function isValidDomain(domain) {
  if (!domain || typeof domain !== 'string') return false;

  const trimmed = domain.trim().toLowerCase();

  // Reject protocols, slashes, ports, or whitespaces
  if (
    trimmed.includes('://') ||
    trimmed.startsWith('http:') ||
    trimmed.startsWith('https:') ||
    trimmed.includes('/') ||
    trimmed.includes(':') ||
    trimmed.includes(' ')
  ) {
    return false;
  }

  // Regex for standard hostname/domain validation (e.g., example.com, sub.example.co.uk)
  const domainRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.[A-Za-z]{2,}$/;
  return domainRegex.test(trimmed);
}

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Subdomain Enumeration API is running' });
});

// Subdomain Enumeration Route
app.post('/api/enumerate', async (req, res) => {
  try {
    const { domain } = req.body || {};

    // Validate incoming domain
    if (!domain || !isValidDomain(domain)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid domain'
      });
    }

    const cleanDomain = domain.trim().toLowerCase();

    // Check each candidate subdomain concurrently
    const lookupPromises = CANDIDATE_SUBDOMAINS.map(async (sub) => {
      const targetHost = `${sub}.${cleanDomain}`;
      try {
        const lookupResult = await dns.lookup(targetHost);
        return {
          subdomain: targetHost,
          status: 'Found',
          ip: lookupResult.address
        };
      } catch (err) {
        // ENOTFOUND or resolution failure means subdomain does not resolve
        return null;
      }
    });

    const resultsWithNulls = await Promise.all(lookupPromises);
    const results = resultsWithNulls.filter((item) => item !== null);

    return res.json({
      success: true,
      domain: cleanDomain,
      results: results
    });
  } catch (error) {
    // Return sanitized error message without exposing backend stack traces
    return res.status(500).json({
      success: false,
      message: 'An error occurred during enumeration'
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Subdomain Enumeration Backend running on http://localhost:${PORT}`);
});
