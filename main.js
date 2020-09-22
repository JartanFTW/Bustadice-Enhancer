class enhancer {
	static #instances = 0;

	constructor (app) {
		enhancer.#instances++;
		if (enhancer.#instances > 1) {
			throw new Error("Unable to create more than one enhancer instance");
		}
		
		this.#app = app
		this.profit = 0;
		this.rolls = 0;
		this.seedRolls = 0;
		this.stopLoss = 0;
		this.stopProfit = 0;
	}
	
	set stopLoss(loss) {
		if (isNaN(loss)) { throw new Error("Stop Loss must be a number or float.") }
		loss = parseFloat(loss)
		if (Math.sign(loss) == 1) { loss *= -1 }
		this.stopLoss = loss
	}
	
	#roundBet (wager) {
		return Math.max( 100, Math.round ( wager / 100 ) * 100 )
	}
	
	balance () {
		return this.#app.balance
	}
	
	bankroll () {
		return this.#app.bankroll
	}
	
	maxProfit () {
		return this.#app.maxProfit
	}
	
	username () {
		return this.#app.username
	}
	
	async #checkStopLoss (bet) {
		if (this.stopLoss != 0 && this.profit - bet <= this.stopLoss) {
			this.log("Stopping due to hitting Stop Loss"); await this.stop()
		}
	}
	
	async #checkStopProfit () {
		if (this.stopProfit != 0 && this.profit >= this.stopProfit) {
			this.log("Stopped due to hitting Stop Profit"); await this.stop()
		}
	}
	
	async stop () {
		await this.#app.stop()
	}
	
	log (message) {
		if (typeof message !== "string") {
			throw new Error("Logged messages must be strings.")
		}
		this.#app.log(message)
	}
	
	clearLog () {
		this.#app.clearLog()
	}
	
	
	async bet (wager, target) {
		await this.#checkStopLoss(this.#roundBet(wager))
		var roll = await this.#app.bet(this.#roundBet(wager), target)
		// Insert check for roll error.
		this.rolls++
		this.seedRolls++
		if (roll.multiplier < target) { profit -= this.#roundBet(wager) } else { profit += this.#roundBet(wager) * target - this.#roundBet(wager) }
		await this.#checkStopProfit()
		return roll
	}
	
	async skip () {
		await this.#checkStopLoss(0)
		await this.#checkStopProfit()
		var roll = await this.#app.skip()
		this.rolls++
		this.seedRolls++
		return roll
	}
}