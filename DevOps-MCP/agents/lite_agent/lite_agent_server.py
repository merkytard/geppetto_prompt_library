from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/infer', methods=['POST'])
def infer():
    data = request.json
    response = {
        "agent": "lite_agent",
        "received": data,
        "result": "Simulovaní vystup z lite_agent"
    }
    return jsonyfy(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)
