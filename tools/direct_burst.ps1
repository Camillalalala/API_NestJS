#GPT-5 wrote this script.
# Runs parallel web requests against a target URL and saves results to direct_burst.json
param(
    [int]$Threads = 20,
    [int]$PerThread = 50,
    [string]$Url = "http://localhost:3001/clubs",
    [string]$Output = "direct_burst.json"
)

$jobs = 1..$Threads | ForEach-Object {
  Start-Job -ScriptBlock {
    param($u, $n)
    $results = @()
    1..$n | ForEach-Object {
      $start = Get-Date
      try {
        $r = Invoke-WebRequest -Uri $u -UseBasicParsing
        $lat = ((Get-Date) - $start).TotalMilliseconds
        $results += [pscustomobject]@{
          status = $r.StatusCode
          latency = $lat
          ts = (Get-Date).ToString("o")
        }
      } catch {
        $lat = ((Get-Date) - $start).TotalMilliseconds
        $code = $null
        if ($_.Exception -and $_.Exception.Response) {
          try { $code = $_.Exception.Response.StatusCode.value__ } catch { $code = $null }
        }
        $statusOut = if ($code) { $code } else { "ERROR" }
        $results += [pscustomobject]@{
          status = $statusOut
          latency = $lat
          ts = (Get-Date).ToString("o")
        }
      }
    }
    return $results
  } -ArgumentList $Url, $PerThread
}

$all = $jobs | Receive-Job -Wait
$all | ConvertTo-Json | Set-Content -Path $Output
Write-Host "Saved $Output"

# Auto-calculate stats from output
function Stats($arr) {
  $lat = $arr | ForEach-Object { $_.latency }
  $avg = [Math]::Round(($lat | Measure-Object -Average).Average, 2)
  $max = [Math]::Round(($lat | Measure-Object -Maximum).Maximum, 2)
  $mean = ($lat | Measure-Object -Average).Average
  $var = [Math]::Round((($lat | ForEach-Object { ($_ - $mean) * ($_ - $mean) }) | Measure-Object -Average).Average, 2)
  $fail = ($arr | Where-Object { $_.status -eq 429 -or $_.status -eq "ERROR" }).Count
  return [pscustomobject]@{ avg = $avg; max = $max; variance = $var; failed = $fail; total = $arr.Count }
}

$data = Get-Content $Output | ConvertFrom-Json
Write-Host "Stats (URL=$Url, Threads=$Threads, PerThread=$PerThread):"
Stats $data | Format-List