import { Builder, By, WebDriver } from 'selenium-webdriver'
import { symbol } from './reducers/symbol'
import { SPREADS } from './spreads'

let driver = undefined as WebDriver

export const configure = async () => {
	try {
		const replayButton = (await driver.findElements(By.className('tv-replay-toolbar__button')))[2]

		if (replayButton) {
			const symbolName = (await (await driver.findElements(By.className('chart-data-window-header')))[1].getText()).split(',')[0]
		
			symbol.setName(symbolName)
			symbol.setSpread(SPREADS[symbolName] || 10)
			return symbolName
		}
	}
	catch (error) {}
}

export const nextTicker = async () => {
	const button = (await driver.findElements(By.className('tv-replay-toolbar__button')))[2]

	if (button) {
		await button.click()
		await driver.sleep(1100)
		await setPrice()
	}
}

export const setPrice = async () => {
	try {
		const nextPrice = await getCurrentPrice()
		symbol.setPrice(nextPrice)
	}
	catch (error) {}
}

const getCurrentPrice = async () => {
	const price = await (await driver.findElements(By.className('chart-data-window-item-value')))[5].getText()
	const decimalLength = !price.includes('.') ? 1 : price.split('.')[1].length
	return parseFloat(price).toFixed(decimalLength)
}

(async () => {
	driver = await new Builder().forBrowser("chrome").build();

	try {
		await driver
			.manage()
			.window()
			.maximize();

		await driver.get('https://www.tradingview.com/#signin')
	} catch (error) {
		console.error('Error while running.\n', error);
	}
})()
