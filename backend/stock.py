import mongodb, yfinance


def getData(symbol, period='1mo', interval="1d"):
    client = mongodb.connect()
    if client == 'Unable to connect.':
        return client
    if mongodb.isCollection(client, symbol):
        return mongodb.getCollection(client, symbol)
    # else:
    ticker = yfinance.Ticker(symbol)
    data = ticker.history(period=period, interval=interval)
    dataDict = {}
    for key, value in data.to_dict('index').items():
        for figure in value.keys():
            value[figure] = round(value[figure], 2)
        dataDict[key] = value
        dataDict[key]['_id'] = key
    if mongodb.createCollection(client, symbol, dataDict):
        return mongodb.getCollection(client, symbol)
    return 'No data.'