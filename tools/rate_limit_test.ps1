# Rate limit validation script
# Usage examples:
#   .\tools\rate_limit_test.ps1
#   .\tools\rate_limit_test.ps1 -Url "http://localhost:3003/clubs" -TotalRequests 10 -DelayMs 0 -Output "rate_limit_test.json"
#   .\tools\rate_limit_test.ps1 -Url "http://localhost:3003/clubs" -Headers @{ Authorization = "Bearer <token>" }

param(
  [string]$Url = "http://localhost:3003/clubs",  # Default to gateway which enforces the limiter
  [int]$TotalRequests = 10,
  [int]$DelayMs = 0,
  [hashtable]$Headers = @{},
  [string]$Output = "rate_limit_test.json",
  [int]$TimeoutSec = 15
)

Write-Host "Testing URL: $Url" -ForegroundColor Cyan
Write-Host "Total Requests: $TotalRequests, DelayMs: $DelayMs" -ForegroundColor Cyan

# Use one session for consistent cookies if the limiter keys by session
$Session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

$results = @()
for ($i = 1; $i -le $TotalRequests; $i++) {
  $start = Get-Date
  $status = $null
  try {
    $r = Invoke-WebRequest -Uri $Url -Method GET -Headers $Headers -WebSession $Session -UseBasicParsing -TimeoutSec $TimeoutSec
    $status = [int]$r.StatusCode
  } catch {
    if ($_.Exception -and $_.Exception.Response) {
      try { $status = $_.Exception.Response.StatusCode.value__ } catch { $status = $null }
    }
    if (-not $status) { $status = "ERROR" }
  }

  $latency = ((Get-Date) - $start).TotalMilliseconds
  $rec = [pscustomobject]@{
    i = $i
    status = $status
    latency_ms = [math]::Round($latency, 2)
    ts = (Get-Date).ToString("o")
  }
  $results += $rec
  Write-Host ("Request {0}: {1} ({2} ms)" -f $i, $status, [math]::Round($latency, 0))

  if ($DelayMs -gt 0) { Start-Sleep -Milliseconds $DelayMs }
}

# Summary
$results | Group-Object status | Sort-Object Name | ForEach-Object {
  Write-Host ("Status {0}: {1}" -f $_.Name, $_.Count)
}

# Check expected rate-limit behavior: no 429 in first 5, at least one 429 after
$firstFive429 = ($results | Where-Object { $_.i -le 5 -and $_.status -eq 429 }).Count
$afterFive429 = ($results | Where-Object { $_.i -gt 5 -and $_.status -eq 429 }).Count

if ($firstFive429 -eq 0 -and $afterFive429 -gt 0) {
  Write-Host "PASS: No 429 in first five; saw $afterFive429 429s after." -ForegroundColor Green
} else {
  Write-Host "FAIL: Expected 0x429 in first five and some 429 after. FirstFive429=$firstFive429 AfterFive429=$afterFive429" -ForegroundColor Red
}

# Save raw results for inspection
$results | ConvertTo-Json | Set-Content -Path $Output
Write-Host "Saved results to $Output"