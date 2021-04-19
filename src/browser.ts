import { Builder, By, WebDriver } from 'selenium-webdriver'
import { symbol } from './reducers/symbol'

let driver = undefined as WebDriver

export const configure = async (spread: number) => {
	const symbolName = (await (await driver.findElements(By.className('chart-data-window-header')))[1].getText()).split(',')[0]
	const symbolPrice = await getCurrentPrice()

	symbol.setName(symbolName)
	symbol.setSpread(spread)
	symbol.setPrice(symbolPrice)
}

export const nextTicker = async () => {
	const button = (await driver.findElements(By.className('tv-replay-toolbar__button')))[2]

	if (button) {
		await button.click()
		await driver.sleep(1100)

		const nextPrice = await getCurrentPrice()
		symbol.setPrice(nextPrice)
	}
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
