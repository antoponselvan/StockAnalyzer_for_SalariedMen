const yahooStockAPI  = require('yahoo-stock-api');
async function main()  {
	const startDate = new Date('08/22/2012');
	const endDate = new Date('08/28/2013');
	console.log(await yahooStockAPI.getHistoricalPrices(startDate, endDate, 'TPR', '1mo'));
}
main();