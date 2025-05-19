from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/infer', methods=['POST'])
def infer():
    data = request.json
    response = {
        "agent": "echo_agent",
        "received": data,
        "result": "Simulovaní vystup z echo_agent"
    }
    return jsonyfx(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8003)
