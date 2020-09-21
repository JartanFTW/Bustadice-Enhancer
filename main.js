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
	}
	
	#roundBet (wager) {
		return Math.max( 100, Math.round ( wager / 100 ) * 100 )
	}
	
	bet (wager, target) {
		// Insert checkLoss/checkProfit here.
		var roll = await this.#app.bet(#roundBet(wager), target)
		this.rolls++
		this.seedRolls++
		if (roll.multiplier < target) { profit -= roundBet(bet) } else { profit += roundBet(bet) * target - roundBet(bet) }
		return roll
	}
	
	skip () {
		var roll = await this.#app.skip()
		this.rolls++
		this.seedRolls++
		return roll
	}
}