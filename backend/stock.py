import mongodb, yfinance


def getData(symbol, period='1y', interval="1d"):
    client = mongodb.connect()
    if client == 'Unable to connect':
        return client
    if mongodb.hasCollection(client, symbol):
        return mongodb.getCollection(client, symbol)
    # else:
    ticker = yfinance.Ticker(symbol)
    data = ticker.history(period=period, interval=interval)
    if len(data) == 0:
        return 'No data'
    dataDict = {}
    for key, value in data.to_dict('index').items():
        for figure in value.keys():
            value[figure] = round(value[figure], 2)
        dataDict[key] = value
        dataDict[key]['_id'] = key
    if mongodb.createCollection(client, symbol, dataDict):
        return mongodb.getCollection(client, symbol)
    return 'No data'


def getInfo(symbol):
    client = mongodb.connect()
    if client == 'Unable to connect':
        return client
    if mongodb.hasDocument(client, 'info', symbol):
        return mongodb.getDocument(client, 'info', symbol)
    # else:
    ticker = yfinance.Ticker(symbol)
    if len(ticker.history()) == 0:
        return 'No data'
    info = ticker.get_info()
    info['_id'] = symbol
    if mongodb.createDocument(client, 'info', info):
        return mongodb.getDocument(client, 'info', symbol)
    return 'No data'


def getHolder(symbol):
    client = mongodb.connect()
    if client == 'Unable to connect':
        return client
    if mongodb.hasDocument(client, 'holder', symbol):
        return mongodb.getDocument(client, 'holder', symbol)
    # else:
    ticker = yfinance.Ticker(symbol)
    if len(ticker.history()) == 0:
        return 'No data'
    
    major = []
    for key, value in ticker.get_major_holders().to_dict('index').items():
        temp = {}
        for k, v in value.items():
            temp[str(k)] = v
        major.append(temp)

    institutional = []
    for key, value in ticker.get_institutional_holders().to_dict('index').items():
        for figure in value.keys():
            if figure == '% Out':
                value[figure] = round(value[figure], 4)
        temp = {}
        for k, v in value.items():
            temp[str(k)] = v
        institutional.append(temp)
    
    mutualfund = []
    for key, value in ticker.get_mutualfund_holders().to_dict('index').items():
        for figure in value.keys():
            if figure == '% Out':
                value[figure] = round(value[figure], 4)
        temp = {}
        for k, v in value.items():
            temp[str(k)] = v
        mutualfund.append(temp)
    
    dataDict = {
        '_id': symbol,
        'major': major,
        'institutional': institutional,
        'mutualfund': mutualfund
    }

    if mongodb.createDocument(client, 'holder', dataDict):
        return mongodb.getDocument(client, 'holder', symbol)
    return 'No data'


if __name__ == '__main__':
    pass