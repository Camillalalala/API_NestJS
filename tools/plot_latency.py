import json
import pandas as pd
import matplotlib.pyplot as plt

def load(path):
    with open(path) as f:
        data = json.load(f)
    df = pd.DataFrame(data)
    df['ts'] = pd.to_datetime(df['ts'])
    df['latency'] = pd.to_numeric(df['latency'])
    return df.sort_values('ts')

direct = load('direct_burst.json')
gateway = load('gateway_burst.json')

# Plot Direct burst
plt.figure(figsize=(10,5))
plt.plot(direct['ts'], direct['latency'], label='direct', color='tab:blue', alpha=0.9)
plt.title('Direct Burst: Latency vs Time')
plt.xlabel('Time')
plt.ylabel('Latency (ms)')
plt.legend()
plt.tight_layout()
plt.savefig('direct_burst_latency.png')

# Plot Gateway burst
plt.figure(figsize=(10,5))
plt.plot(gateway['ts'], gateway['latency'], label='gateway', color='tab:orange', alpha=0.9)
plt.title('Gateway Burst: Latency vs Time')
plt.xlabel('Time')
plt.ylabel('Latency (ms)')
plt.legend()
plt.tight_layout()
plt.savefig('gateway_burst_latency.png')

# Show both figures interactively
plt.show()