from flask import Flask, request
from flask_cors import CORS
from src.chat import chat, query, stringToAudio
import json

app = Flask(__name__)
CORS(app)

# Rota para receber mensagem e entregar a sua resposta equivalente
@app.route("/message", methods=['POST'])
def postMessage():
    data, tag = chat(request.form['message'])
    return json.dumps({'data': data, 'tag': tag})

# Rota para receber uma linha e realizar uma busca, entregando os três resultados mais próximos.
@app.route("/query", methods = ['POST'])
def searchCourse():
    return json.dumps({'data': query(request.form['message'])})

@app.route("/start-audio", methods=['POST'])
def postAudioStart():
    if request.form['mensage']:
        audioSpeach = stringToAudio()

    return json.dumps({'data': chat(audioSpeach), 'pergunta': audioSpeach})


#Host em que o backend irá rodar
HOST = 'localhost'
#Porta na qual o backend irá rodar
PORT = 5555
