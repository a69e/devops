from flask import Flask
from flask_cors import CORS
import stock


app = Flask(__name__)
#CORS(app)


@app.route('/<symbol>', methods=['GET'])
def get(symbol):
    return stock.getData(symbol)


app.run(host='0.0.0.0', port=5000, debug=True)