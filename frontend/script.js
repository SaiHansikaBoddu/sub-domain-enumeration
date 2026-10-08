// DOM Elements
const scanForm = document.getElementById("scanForm");
const domainInput = document.getElementById("domain");
const scanButton = document.getElementById("scanButton");
const resultsDiv = document.getElementById("results");

// Form submission handler
scanForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const domain = domainInput.value.trim();

  // 1. Check for empty input
  if (!domain) {
    resultsDiv.innerHTML = `<div class="message error">Please enter a domain.</div>`;
    return;
  }

  // 2. Reject URLs (http/https), protocols, or spaces
  if (
    domain.includes("://") ||
    domain.startsWith("http:") ||
    domain.startsWith("https:") ||
    domain.includes("/") ||
    domain.includes(" ")
  ) {
    resultsDiv.innerHTML = `<div class="message error">Error: Invalid domain. Please enter a clean domain (e.g. example.com).</div>`;
    return;
  }

  // 3. Show "Enumerating..." and loading state
  scanButton.disabled = true;
  scanButton.textContent = "Enumerating...";
  resultsDiv.innerHTML = `<div class="message loading">Enumerating subdomains for <strong>${domain}</strong>...</div>`;

  try {
    // 4. Send POST request to Express backend
    const response = await fetch("https://sub-domain-enumeration-91ty.onrender.com/api/enumerate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        domain: domain
      })
    });

    const data = await response.json();

    // 5. Check if backend returned validation error
    if (!response.ok || !data.success) {
      const errorMsg = data.message || "Invalid domain";
      resultsDiv.innerHTML = `<div class="message error">Error: ${errorMsg}</div>`;
      return;
    }

    const results = data.results || [];

    // 6. Check if no subdomains resolved
    if (results.length === 0) {
      resultsDiv.innerHTML = `<div class="message empty">No subdomains found.</div>`;
      return;
    }

    // 7. Render formatted results table
    let tableHtml = `
      <div class="card results-card">
        <div class="results-header">
          <h2>Results</h2>
          <span class="count-badge">Subdomains Found: ${results.length}</span>
        </div>
        <div class="table-responsive">
          <table class="results-table">
            <thead>
              <tr>
                <th>Subdomain</th>
                <th>Status</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
    `;

    results.forEach((item) => {
      tableHtml += `
        <tr>
          <td class="subdomain-cell">${item.subdomain}</td>
          <td><span class="status-badge">${item.status || "Found"}</span></td>
          <td class="ip-cell">${item.ip || "N/A"}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
          </table>
        </div>
      </div>
    `;

    resultsDiv.innerHTML = tableHtml;

  } catch (error) {
    // 8. Handle connection failure (e.g., backend stopped or wrong port)
    resultsDiv.innerHTML = `
      <div class="message error">
        Unable to connect to backend server.<br>
        Make sure the backend server is running
      </div>
    `;
  } finally {
    // Restore button state
    scanButton.disabled = false;
    scanButton.textContent = "Enumerate Subdomains";
  }
});
