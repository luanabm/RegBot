from flask import Flask, request
from flask_cors import CORS
from src.chat import chat, query
from src.googleTranslate import stringToAudio, createToAudio
import json

app = Flask(__name__)
CORS(app)

# Rota para receber mensagem e entregar a sua resposta equivalente
@app.route("/message", methods=['POST'])
def postMessage():
    data, tag = chat(request.form['message'])
    print(chat(request.form['message']))
    # createToAudio(data)
    return json.dumps({'data': data, 'tag': tag})

# Rota para receber uma linha e realizar uma busca, entregando os três resultados mais próximos.
@app.route("/query", methods = ['POST'])
def searchCourse():
    data = query(request.form['message'])
    return json.dumps({'data': data})

@app.route("/", methods=['POST'])
def postAudioStart():
    if request.form['message']:
        audioSpeach = stringToAudio()
    if audioSpeach != 'Desculpe, não entendi o áudio. Pode repetir?':
        data, tag = chat(audioSpeach)
        print(tag)
        print(data)
        if tag == 'indefinido':
            data = query(audioSpeach)
            print(data)
    else:
        data = 'Desculpe, não entendi o áudio. Pode repetir?'
        tag = ""
        audioSpeach = 'undefined'
    return json.dumps({'data': data, 'tag': tag, 'pergunta': audioSpeach})


#Host em que o backend irá rodar
HOST = 'localhost'
#Porta na qual o backend irá rodar
PORT = 5555
