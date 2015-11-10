from flask import Flask, request

app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def tsp():
    if request.method == 'POST':
        # addresses = request.args.get('coords', '')
        addresses = ''
        return addresses
    
if __name__ == '__main__':
    app.run(debug=True)
