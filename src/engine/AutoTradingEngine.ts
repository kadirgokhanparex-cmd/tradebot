import { binanceAPI } from '../api/binanceService';
import { analyzeMarket, CandleData, FullAnalysis } from '../utils/indicators';
import { Bot, Trade, OpenPosition, LiveActivity } from '../types';

export class AutoTradingEngine {
  private bots: Bot[] = [];
  private trades: Trade[] = [];
  private openPositions: OpenPosition[] = [];
  private activities: LiveActivity[] = [];
  private isRunning: boolean = false;
  private scanInterval: ReturnType<typeof setInterval> | null = null;
  private onStateChange: (() => void) | null = null;

  constructor() {
    this.bots = [];
    this.trades = [];
    this.openPositions = [];
    this.activities = [];
  }

  setOnStateChange(callback: () => void) {
    this.onStateChange = callback;
  }

  getState() {
    return {
      bots: this.bots,
      trades: this.trades,
      openPositions: this.openPositions,
      activities: this.activities,
      isRunning: this.isRunning,
    };
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.addActivity('Sistem', 'TÜM', 'OTOMATİK TRADING BAŞLATILDI', 'info', 
      'Piyasa tarama ve otomatik işlem motoru aktif. 16 coin taranıyor...');
    
    // Start scanning every 30 seconds
    this.scanInterval = setInterval(() => {
      this.scanAndTrade();
    }, 30000);

    // Initial scan
    await this.scanAndTrade();
    
    if (this.onStateChange) this.onStateChange();
  }

  async stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    
    this.addActivity('Sistem', 'TÜM', 'OTOMATİK TRADING DURDURULDU', 'info', 
      'Otomatik işlem motoru durduruldu');
    
    if (this.onStateChange) this.onStateChange();
  }

  private async scanAndTrade() {
    if (!this.isRunning) return;

    const symbols = [
      'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT',
      'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT',
      'LINKUSDT', 'UNIUSDT', 'ATOMUSDT', 'FILUSDT', 'NEARUSDT', 'APTUSDT'
    ];

    this.addActivity('Tarama Motoru', 'TÜM', 'PİYASA TARANIYOR', 'analysis', 
      `${symbols.length} coin taranıyor...`);

    for (const symbol of symbols) {
      try {
        await this.analyzeAndExecute(symbol);
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error analyzing ${symbol}:`, error);
      }
    }

    if (this.onStateChange) this.onStateChange();
  }

  private async analyzeAndExecute(symbol: string) {
    try {
      // Get kline data
      const klines = await binanceAPI.getKlines(symbol, '1h', 100);
      
      // Convert to CandleData
      const candles: CandleData[] = klines.map(k => ({
        open: parseFloat(k.open),
        high: parseFloat(k.high),
        low: parseFloat(k.low),
        close: parseFloat(k.close),
        volume: parseFloat(k.volume),
        timestamp: k.openTime,
      }));

      // Analyze market
      const analysis = analyzeMarket(candles, symbol);
      
      // Check if we should trade
      if (analysis.overallSignal === 'STRONG_BUY' || analysis.overallSignal === 'STRONG_SELL') {
        await this.executeTrade(symbol, analysis);
      } else if (analysis.overallSignal === 'BUY' || analysis.overallSignal === 'SELL') {
        // Log the signal but don't trade (medium confidence)
        this.addActivity('Sinyal Motoru', symbol, 
          `${analysis.overallSignal === 'BUY' ? 'AL' : 'SAT'} SİNYALİ`, 
          analysis.overallSignal === 'BUY' ? 'buy' : 'sell',
          `Güven: %${analysis.confidence} - RSI: ${analysis.rsi.value.toFixed(1)}, ADX: ${analysis.adx.adx.toFixed(1)}`,
          analysis.price
        );
      }
    } catch (error) {
      console.error(`Error in analyzeAndExecute for ${symbol}:`, error);
    }
  }

  private async executeTrade(symbol: string, analysis: FullAnalysis) {
    const pair = symbol.replace('USDT', '/USDT');
    const isStrongBuy = analysis.overallSignal === 'STRONG_BUY';
    const isFutures = analysis.recommendedAction === 'FUTURES_LONG' || analysis.recommendedAction === 'FUTURES_SHORT';
    
    // Check if we already have a position
    const existingPosition = this.openPositions.find(p => p.pair === pair);
    if (existingPosition) {
      this.addActivity('İşlem Motoru', pair, 'POZİSYON ZATEN AÇIK', 'info',
        `Mevcut pozisyon var, yeni işlem açılmadı`);
      return;
    }

    // Check max positions limit (5)
    if (this.openPositions.length >= 5) {
      this.addActivity('İşlem Motoru', pair, 'MAKSİMUM POZİSYON', 'alert',
        `Maksimum 5 açık pozisyon limitine ulaşıldı`);
      return;
    }

    const action = isStrongBuy ? 'STRONG BUY' : 'STRONG SELL';
    const direction = isStrongBuy ? 'LONG' : 'SHORT';
    const leverage = isFutures ? analysis.recommendedLeverage : 1;
    
    this.addActivity('İşlem Motoru', pair, `${action} SİNYALİ - İŞLEM AÇILIYOR`, 
      isStrongBuy ? 'buy' : 'sell',
      `${isFutures ? `${leverage}x Futures ${direction}` : 'Spot'} - Güven: %${analysis.confidence}`,
      analysis.price
    );

    try {
      // Calculate position size (10% of capital per trade)
      const capital = 10000; // Initial capital
      const positionSize = capital * 0.1; // 10% per trade
      const quantity = positionSize / analysis.price;

      // Create position
      const position: OpenPosition = {
        id: Date.now().toString(),
        botId: 'auto',
        botName: 'Otomatik Trading',
        pair: pair,
        type: direction as 'LONG' | 'SHORT',
        entryPrice: analysis.price,
        currentPrice: analysis.price,
        amount: quantity,
        leverage: leverage,
        isSpot: !isFutures,
        pnl: 0,
        pnlPercent: 0,
        openedAt: new Date().toISOString(),
        stopLoss: this.calculateStopLoss(analysis.price, direction, analysis.atr),
        takeProfit: this.calculateTakeProfit(analysis.price, direction, analysis.atr),
        strategy: isStrongBuy ? 'Strong Signal' : 'Signal',
      };

      this.openPositions.push(position);

      // Create trade record
      const trade: Trade = {
        id: Date.now().toString(),
        botId: 'auto',
        botName: 'Otomatik Trading',
        pair: pair,
        type: isStrongBuy ? 'BUY' : 'SELL',
        price: analysis.price,
        amount: quantity,
        total: positionSize,
        profit: 0,
        timestamp: new Date().toISOString(),
        status: 'completed',
        leverage: leverage,
        isSpot: !isFutures,
      };

      this.trades.push(trade);

      this.addActivity('İşlem Motoru', pair, `${direction} POZİSYON AÇILDI`, 
        isStrongBuy ? 'buy' : 'sell',
        `${quantity.toFixed(6)} @ $${analysis.price.toLocaleString()} - SL: $${position.stopLoss.toFixed(2)} - TP: $${position.takeProfit.toFixed(2)}`,
        analysis.price
      );

    } catch (error) {
      this.addActivity('İşlem Motoru', pair, 'HATA', 'alert',
        `İşlem açılamadı: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  }

  private calculateStopLoss(price: number, direction: string, atr: number): number {
    const atrMultiplier = 2;
    if (direction === 'LONG') {
      return price - (atr * atrMultiplier);
    } else {
      return price + (atr * atrMultiplier);
    }
  }

  private calculateTakeProfit(price: number, direction: string, atr: number): number {
    const atrMultiplier = 3;
    if (direction === 'LONG') {
      return price + (atr * atrMultiplier);
    } else {
      return price - (atr * atrMultiplier);
    }
  }

  private addActivity(botName: string, pair: string, action: string, type: 'info' | 'buy' | 'sell' | 'analysis' | 'alert' | 'signal', details: string, price?: number) {
    const activity: LiveActivity = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toLocaleTimeString('tr-TR'),
      botName,
      pair,
      action,
      type,
      details,
      price,
    };

    this.activities.unshift(activity);
    
    // Keep only last 50 activities
    if (this.activities.length > 50) {
      this.activities = this.activities.slice(0, 50);
    }
  }

  // Update positions with current prices
  async updatePositions() {
    for (const position of this.openPositions) {
      try {
        const prices = await binanceAPI.getAllPrices();
        const priceData = prices.find(p => p.symbol === position.pair.replace('/', ''));
        
        if (priceData) {
          const currentPrice = parseFloat(priceData.price);
          position.currentPrice = currentPrice;
          
          // Calculate PnL
          if (position.type === 'LONG') {
            position.pnl = (currentPrice - position.entryPrice) * position.amount * position.leverage;
          } else {
            position.pnl = (position.entryPrice - currentPrice) * position.amount * position.leverage;
          }
          
          position.pnlPercent = (position.pnl / (position.entryPrice * position.amount)) * 100 * position.leverage;

          // Check stop loss
          if (position.type === 'LONG' && currentPrice <= position.stopLoss) {
            await this.closePosition(position.id, 'Stop Loss');
          } else if (position.type === 'SHORT' && currentPrice >= position.stopLoss) {
            await this.closePosition(position.id, 'Stop Loss');
          }
          
          // Check take profit
          if (position.type === 'LONG' && currentPrice >= position.takeProfit) {
            await this.closePosition(position.id, 'Take Profit');
          } else if (position.type === 'SHORT' && currentPrice <= position.takeProfit) {
            await this.closePosition(position.id, 'Take Profit');
          }
        }
      } catch (error) {
        console.error(`Error updating position ${position.pair}:`, error);
      }
    }

    if (this.onStateChange) this.onStateChange();
  }

  private async closePosition(positionId: string, reason: string) {
    const position = this.openPositions.find(p => p.id === positionId);
    if (!position) return;

    const pnl = position.pnl;
    
    // Update trade with profit
    const trade = this.trades.find(t => t.botId === position.botId && t.pair === position.pair && t.type === (position.type === 'LONG' ? 'BUY' : 'SELL'));
    if (trade) {
      trade.profit = pnl;
    }

    // Remove position
    this.openPositions = this.openPositions.filter(p => p.id !== positionId);

    this.addActivity('İşlem Motoru', position.pair, `POZİSYON KAPATILDI - ${reason}`, 
      pnl >= 0 ? 'buy' : 'sell',
      `PnL: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${position.pnlPercent >= 0 ? '+' : ''}${position.pnlPercent.toFixed(2)}%)`,
      position.currentPrice
    );

    if (this.onStateChange) this.onStateChange();
  }
}

// Singleton instance
export const autoTradingEngine = new AutoTradingEngine();
