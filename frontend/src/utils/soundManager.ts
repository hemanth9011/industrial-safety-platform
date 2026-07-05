// Utility to generate and play sounds for IoT sensor alerts
export class SensorAlertSoundManager {
  private audioContext: AudioContext | null = null
  private isPlaying: boolean = false
  private lastAlertTime: { [key: string]: number } = {}
  private ALERT_COOLDOWN = 5000 // 5 seconds between alerts for same sensor

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  // Check if we should play alert (cooldown mechanism)
  private shouldPlayAlert(sensorId: string): boolean {
    const now = Date.now()
    const lastTime = this.lastAlertTime[sensorId] || 0
    
    if (now - lastTime >= this.ALERT_COOLDOWN) {
      this.lastAlertTime[sensorId] = now
      return true
    }
    return false
  }

  // Warning sound - single beep at 800Hz
  playWarningSound(sensorId?: string): void {
    if (sensorId && !this.shouldPlayAlert(sensorId)) {
      return
    }

    if (this.isPlaying) return
    this.isPlaying = true

    const ctx = this.getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = 800 // Hz
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.5, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.8)

    setTimeout(() => {
      this.isPlaying = false
    }, 800)
  }

  // Critical/Alert sound - rapid double beeps at 1000Hz
  playCriticalSound(sensorId?: string): void {
    if (sensorId && !this.shouldPlayAlert(sensorId)) {
      return
    }

    if (this.isPlaying) return
    this.isPlaying = true

    const ctx = this.getAudioContext()

    const playBeep = (freq: number, duration: number, delay: number) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = freq
      oscillator.type = 'square'

      gainNode.gain.setValueAtTime(0.6, ctx.currentTime + delay)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration)

      oscillator.start(ctx.currentTime + delay)
      oscillator.stop(ctx.currentTime + delay + duration)
    }

    // Triple beeps for critical alert
    playBeep(1200, 0.2, 0)
    playBeep(1200, 0.2, 0.3)
    playBeep(1200, 0.2, 0.6)

    setTimeout(() => {
      this.isPlaying = false
    }, 1000)
  }

  // Offline/Error sound - low frequency alert
  playOfflineSound(sensorId?: string): void {
    if (sensorId && !this.shouldPlayAlert(sensorId)) {
      return
    }

    if (this.isPlaying) return
    this.isPlaying = true

    const ctx = this.getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = 400 // Hz
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 1)

    setTimeout(() => {
      this.isPlaying = false
    }, 1000)
  }

  // Reset alert cooldown for a sensor (for manual testing)
  resetAlertCooldown(sensorId: string): void {
    delete this.lastAlertTime[sensorId]
  }

  // Reset all cooldowns
  resetAllCooldowns(): void {
    this.lastAlertTime = {}
  }
}

export const sensorAlertSoundManager = new SensorAlertSoundManager()
