// Pre-Graduate Volume Hunter - Scanner Logic

class VolumeHunterScanner {
  constructor() {
    this.isScanning = true;
    this.stats = {
      scanned: 0,
      alerts: 0,
      filtered: 0
    };
    this.alerts = [];
    this.init();
  }

  init() {
    this.updateUI();
    this.startScanning();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('toggle-scanner').addEventListener('click', () => {
      this.isScanning = !this.isScanning;
      const btn = document.getElementById('toggle-scanner');
      const indicator = document.getElementById('status-indicator');
      const statusText = document.getElementById('status-text');
      
      if (this.isScanning) {
        btn.textContent = 'Pause';
        btn.classList.remove('bg-gray-600', 'hover:bg-gray-700');
        btn.classList.add('bg-green-600', 'hover:bg-green-700');
        indicator.classList.remove('bg-gray-400');
        indicator.classList.add('bg-green-500');
        statusText.textContent = 'Scanning...';
        this.startScanning();
      } else {
        btn.textContent = 'Resume';
        btn.classList.remove('bg-green-600', 'hover:bg-green-700');
        btn.classList.add('bg-gray-600', 'hover:bg-gray-700');
        indicator.classList.remove('bg-green-500');
        indicator.classList.add('bg-gray-400');
        statusText.textContent = 'Paused';
      }
    });

    document.getElementById('clear-alerts').addEventListener('click', () => {
      this.alerts = [];
      this.renderAlerts();
    });
  }

  startScanning() {
    if (!this.isScanning) return;

    // Simulate scanning for new pairs every 3-8 seconds
    const scanInterval = 3000 + Math.random() * 5000;
    
    setTimeout(() => {
      if (this.isScanning) {
        this.scanNewPair();
        this.startScanning();
      }
    }, scanInterval);
  }

  scanNewPair() {
    this.stats.scanned++;

    // Generate mock token data
    const pair = this.generateMockPair();

    // Apply filters
    const filterResult = this.applyFilters(pair);

    if (!filterResult.passed) {
      this.stats.filtered++;
      this.updateUI();
      return;
    }

    // Check alert conditions
    const alertTriggered = this.checkAlertConditions(pair);

    if (alertTriggered) {
      this.stats.alerts++;
      this.addAlert(pair);
      this.playAlertSound();
    } else {
      this.stats.filtered++;
    }

    this.updateUI();
  }

  generateMockPair() {
    const names = [
      'MOON', 'ROCKET', 'PEPE', 'DOGE', 'SHIB', 'FLOKI', 
      'WOJAK', 'BONK', 'SAMO', 'COPE', 'ORCA', 'RAY',
      'FROG', 'MEME', 'CHAD', 'BASED', 'PUMP', 'GEM'
    ];
    const name = names[Math.floor(Math.random() * names.length)];
    const symbol = Math.random() > 0.7 ? name : name + Math.floor(Math.random() * 1000);

    // Market cap between $3K and $25K (some will be filtered)
    const marketCap = 3000 + Math.random() * 22000;
    
    // Liquidity between $8K and $50K (some will be filtered)
    const liquidity = 8000 + Math.random() * 42000;

    // Pair age in minutes (0-45 minutes, some will be filtered)
    const ageMinutes = Math.random() * 45;

    // Volume trending (last 5 min vs previous 10 min)
    const volumePrev = 1000 + Math.random() * 5000;
    const volumeRecent = volumePrev * (0.5 + Math.random() * 2); // Can be higher or lower

    // Safety metrics
    const devWallet = Math.random() * 15; // 0-15%
    const bundledSupply = Math.random() * 30; // 0-30%
    const snipers = Math.random() * 30; // 0-30%
    const mintRevoked = Math.random() > 0.3; // 70% revoked
    const freezeDisabled = Math.random() > 0.3; // 70% disabled

    // Price action
    const buyPressure = 40 + Math.random() * 60; // 40-100%
    const sellPressure = 100 - buyPressure;
    const higherLows = Math.random() > 0.4; // 60% chance

    const address = this.generateSolanaAddress();

    return {
      name,
      symbol,
      address,
      marketCap,
      liquidity,
      ageMinutes,
      volumePrev,
      volumeRecent,
      devWallet,
      bundledSupply,
      snipers,
      mintRevoked,
      freezeDisabled,
      buyPressure,
      sellPressure,
      higherLows,
      graduated: Math.random() > 0.8 // 20% graduated (will be filtered)
    };
  }

  generateSolanaAddress() {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = '';
    for (let i = 0; i < 44; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }

  applyFilters(pair) {
    const filters = [];

    // Pair age: ≤ 30 minutes
    if (pair.ageMinutes > 30) {
      filters.push('Pair too old');
    }

    // Market cap: $5K - $20K
    if (pair.marketCap < 5000 || pair.marketCap > 20000) {
      filters.push('Market cap out of range');
    }

    // Bonding curve status: NOT graduated
    if (pair.graduated) {
      filters.push('Already graduated');
    }

    // Liquidity: ≥ $10K
    if (pair.liquidity < 10000) {
      filters.push('Insufficient liquidity');
    }

    // Volume: Increasing (last 5 min vs previous 10 min)
    if (pair.volumeRecent <= pair.volumePrev) {
      filters.push('Volume not increasing');
    }

    // Dev wallet: ≤ 8%
    if (pair.devWallet > 8) {
      filters.push('Dev wallet too high');
    }

    // Bundled supply: ≤ 20%
    if (pair.bundledSupply > 20) {
      filters.push('Bundled supply too high');
    }

    // Snipers: ≤ 20%
    if (pair.snipers > 20) {
      filters.push('Too many snipers');
    }

    // Mint authority: Revoked
    if (!pair.mintRevoked) {
      filters.push('Mint authority not revoked');
    }

    // Freeze authority: Disabled
    if (!pair.freezeDisabled) {
      filters.push('Freeze authority not disabled');
    }

    return {
      passed: filters.length === 0,
      reasons: filters
    };
  }

  checkAlertConditions(pair) {
    // Buy pressure > Sell pressure
    const buyPressureCheck = pair.buyPressure > pair.sellPressure;

    // Higher lows on 1-min candles
    const higherLowsCheck = pair.higherLows;

    return buyPressureCheck && higherLowsCheck;
  }

  addAlert(pair) {
    const alert = {
      id: Date.now(),
      timestamp: new Date(),
      pair,
      volumeChange: ((pair.volumeRecent / pair.volumePrev - 1) * 100).toFixed(1)
    };

    this.alerts.unshift(alert);

    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(0, 50);
    }

    this.renderAlerts();
  }

  renderAlerts() {
    const container = document.getElementById('alerts-container');

    if (this.alerts.length === 0) {
      container.innerHTML = `
        <div class="p-12 text-center">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <p class="text-gray-500 font-medium">No alerts yet</p>
          <p class="text-sm text-gray-400 mt-1">Scanning for opportunities...</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.alerts.map(alert => this.renderAlertCard(alert)).join('');
  }

  renderAlertCard(alert) {
    const { pair, timestamp, volumeChange } = alert;
    const timeAgo = this.getTimeAgo(timestamp);

    return `
      <div class="alert-item p-6 hover:bg-gray-50 transition-colors">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-lg font-bold text-gray-900">${pair.symbol}</h3>
              <span class="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                ALERT
              </span>
              <span class="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                Pre-Grad
              </span>
            </div>
            <p class="text-sm text-gray-500 font-mono mb-3">${pair.address}</p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p class="text-xs text-gray-500 mb-1">Market Cap</p>
                <p class="text-sm font-bold text-gray-900">$${this.formatNumber(pair.marketCap)}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p class="text-xs text-gray-500 mb-1">Liquidity</p>
                <p class="text-sm font-bold text-gray-900">$${this.formatNumber(pair.liquidity)}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p class="text-xs text-gray-500 mb-1">Age</p>
                <p class="text-sm font-bold text-gray-900">${Math.floor(pair.ageMinutes)}m</p>
              </div>
              <div class="bg-green-50 rounded-lg p-3 border border-green-200">
                <p class="text-xs text-green-600 mb-1">Volume ↑</p>
                <p class="text-sm font-bold text-green-700">+${volumeChange}%</p>
              </div>
            </div>
          </div>
          <div class="text-right ml-6">
            <p class="text-xs text-gray-400 mb-2">${timeAgo}</p>
            <a href="https://dexscreener.com/solana/${pair.address}" target="_blank" 
               class="inline-block px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              View Chart
            </a>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 ${pair.buyPressure > pair.sellPressure ? 'text-green-500' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-xs text-gray-600">Buy Pressure: <span class="font-semibold text-gray-900">${pair.buyPressure.toFixed(1)}%</span></span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 ${pair.higherLows ? 'text-green-500' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-xs text-gray-600">Higher Lows</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 ${pair.devWallet <= 8 ? 'text-green-500' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-xs text-gray-600">Dev: <span class="font-semibold text-gray-900">${pair.devWallet.toFixed(1)}%</span></span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 ${pair.mintRevoked ? 'text-green-500' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-xs text-gray-600">Mint Revoked</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 ${pair.freezeDisabled ? 'text-green-500' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-xs text-gray-600">Freeze Off</span>
          </div>
        </div>

        <div class="flex items-center space-x-2 pt-3 border-t border-gray-100">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          <p class="text-xs text-gray-600">
            <span class="font-semibold text-gray-900">Volume increasing:</span> 
            ${this.formatNumber(pair.volumePrev)} → ${this.formatNumber(pair.volumeRecent)}
          </p>
        </div>
      </div>
    `;
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  }

  getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  playAlertSound() {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  updateUI() {
    document.getElementById('stat-scanned').textContent = this.stats.scanned.toLocaleString();
    document.getElementById('stat-alerts').textContent = this.stats.alerts.toLocaleString();
    document.getElementById('stat-filtered').textContent = this.stats.filtered.toLocaleString();
    
    const successRate = this.stats.scanned > 0 
      ? ((this.stats.alerts / this.stats.scanned) * 100).toFixed(1) 
      : 0;
    document.getElementById('stat-rate').textContent = successRate + '%';
  }
}

// Initialize scanner when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new VolumeHunterScanner();
});