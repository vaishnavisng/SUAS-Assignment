import urllib.request
import json
import datetime

def fetch_and_save():
    url = 'https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?range=10y&interval=1d'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    res = urllib.request.urlopen(req, timeout=20)
    raw = json.loads(res.read().decode('utf-8'))['chart']['result'][0]

    timestamps = raw['timestamp']
    quote = raw['indicators']['quote'][0]
    opens = quote['open']
    highs = quote['high']
    lows = quote['low']
    closes = quote['close']
    volumes = quote.get('volume', [0] * len(timestamps))

    records = []
    for i in range(len(timestamps)):
        if opens[i] is None or closes[i] is None or highs[i] is None or lows[i] is None:
            continue
        dt = datetime.datetime.fromtimestamp(timestamps[i], datetime.timezone.utc).strftime('%Y-%m-%d')
        records.append({
            'date': dt,
            'open': round(opens[i], 2),
            'high': round(highs[i], 2),
            'low': round(lows[i], 2),
            'close': round(closes[i], 2),
            'volume': volumes[i] or 0
        })

    for i in range(len(records)):
        if i == 0:
            records[i]['change_pct'] = 0.0
        else:
            prev_close = records[i-1]['close']
            records[i]['change_pct'] = round(((records[i]['close'] - prev_close) / prev_close) * 100, 3)

    with open('nifty50_daily.json', 'w') as f:
        json.dump(records, f)

    print(f"Successfully exported {len(records)} NIFTY 50 trading days: {records[0]['date']} to {records[-1]['date']}")

if __name__ == '__main__':
    fetch_and_save()
