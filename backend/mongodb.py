import pymongo
from pymongo.errors import BulkWriteError, ServerSelectionTimeoutError, WriteError
from bson import json_util


def connect():
    try:
        return pymongo.MongoClient('mongodb://mongodb:27017', ServerSelectionTimeoutMS=1000)
    except ServerSelectionTimeoutError as err:
        print('error: ', err)
        return 'Unable to connect.'


def createCollection(client, symbol, json):
    try:
        client.devops[f'{symbol}'].insert_many(json.values())
        return True
    except (BulkWriteError, WriteError) as err:
        print('error: ', err)
        if isinstance(err, BulkWriteError):
            return 'data exists'


def getCollection(client, symbol):
    return json_util.dumps((list(client.devops[f'{symbol}'].find())))


def isCollection(client, symbol):
    return True if symbol in client.devops.collection_names() else False