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
		await (await driver.findElement(By.className('tv-signin-dialog__toggle-email'))).click()
		const inputs = await driver.findElements(By.className('tv-signin-dialog__input'))
		inputs[0].sendKeys(process.env.TV_USER)
		await driver.sleep(1000)
		inputs[1].sendKeys(process.env.TV_PASS)
		await driver.sleep(1000)
		await (await driver.findElement(By.className('tv-button--size_large'))).click()
		await driver.sleep(1000)
		await driver.get(process.env.TV_CHART_URL)
	} catch (error) {}
})()
