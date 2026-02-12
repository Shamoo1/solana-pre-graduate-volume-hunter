# Pre-Graduate Volume Hunter

Real-time Solana token scanner that monitors new pairs and triggers alerts based on CreateOS-style logic.

## Framework

Vanilla JavaScript / Static HTML

## Features

**Trigger:** New pair created on Solana

**Filters Applied:**
- Chain: Solana
- Pair Age: ≤ 30 minutes
- Market Cap: $5,000 – $20,000
- Bonding Curve Status: NOT Graduated
- Liquidity: ≥ $10,000
- Volume: Increasing (last 5 min vs previous 10 min)

**Safety Filters:**
- Dev Wallet Holding: ≤ 8%
- Bundled Supply: ≤ 20%
- Snipers: ≤ 20%
- Mint Authority: Revoked
- Freeze Authority: Disabled

**Alert Conditions:**
- Buy pressure > Sell pressure
- Higher lows on 1-min candles

**Output:**
- Token name, symbol, address
- Market cap, liquidity, age
- Volume change percentage
- Safety checks visualization
- Direct link to DEX chart

## Theme

Clean Light theme with soft shadows, professional typography, and green accent colors for alerts.