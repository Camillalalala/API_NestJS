# Measures latency of one direct microservice call vs one gateway call
# Usage examples:
#   .\tools\latency_single.ps1
#   .\tools\latency_single.ps1 -DirectUrl "http://localhost:3001/clubs" -GatewayUrl "http://localhost:3003/clubs" -Output "latency_single.json"
#   .\tools\latency_single.ps1 -Headers @{ Authorization = "Bearer <token>" }

param(
  [string]$DirectUrl = "http://localhost:3001/clubs",
  [string]$GatewayUrl = "http://localhost:3003/clubs/clubs",
  [hashtable]$Headers = @{},
  [int]$TimeoutSec = 15,
  [string]$Output = "latency_single.json"
)

function Measure-Call {
  param(
    [string]$Url,
    [hashtable]$Headers,
    [int]$TimeoutSec
  )
  $start = Get-Date
  $status = $null
  try {
    $r = Invoke-WebRequest -Uri $Url -Method GET -Headers $Headers -UseBasicParsing -TimeoutSec $TimeoutSec
    $status = [int]$r.StatusCode
  } catch {
    if ($_.Exception -and $_.Exception.Response) {
      try { $status = $_.Exception.Response.StatusCode.value__ } catch { $status = $null }
    }
    if (-not $status) { $status = "ERROR" }
  }
  $latency = ((Get-Date) - $start).TotalMilliseconds
  return [pscustomobject]@{
    url = $Url
    status = $status
    latency_ms = [math]::Round($latency, 2)
    ts = (Get-Date).ToString("o")
  }
}

Write-Host "Measuring one direct call and one gateway call..." -ForegroundColor Cyan
$directResult = Measure-Call -Url $DirectUrl -Headers $Headers -TimeoutSec $TimeoutSec
$gatewayResult = Measure-Call -Url $GatewayUrl -Headers $Headers -TimeoutSec $TimeoutSec

$results = @($directResult, $gatewayResult)

$results | ForEach-Object {
  Write-Host ("{0}: status={1}, latency={2} ms" -f $_.url, $_.status, $_.latency_ms)
}

$results | ConvertTo-Json | Set-Content -Path $Output
Write-Host "Saved results to $Output"