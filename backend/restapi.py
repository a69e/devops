from flask import Flask
from flask_cors import CORS
import stock


app = Flask(__name__)
CORS(app)


@app.route('/<symbol>', methods=['GET'])
def getData(symbol):
    return stock.getData(symbol)


@app.route('/info/<symbol>', methods=['GET'])
def getInfo(symbol):
    return stock.getInfo(symbol)


@app.route('/holder/<symbol>', methods=['GET'])
def getHolder(symbol):
    return stock.getHolder(symbol)


app.run(host='0.0.0.0', port=5000, debug=True)