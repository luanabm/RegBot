from src.loadData import getCoursesData
import src.chatResponses as responses
import random
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import tensorflow_text as text
from tensorflow import keras
import speech_recognition as sr
from gtts import gTTS
from playsound import playsound
from sklearn.metrics.pairwise import cosine_similarity
from googletrans import Translator


searchModel = keras.models.load_model(
    '/home/luana/cap-13/AngularBot/Backend/model/searchModel.h5', custom_objects={'KerasLayer': hub.KerasLayer}, compile=False)
chatModel = keras.models.load_model(
    '/home/luana/cap-13/AngularBot/Backend/model/chatModel.h5', custom_objects={'KerasLayer': hub.KerasLayer}, compile=False)
allResponses = responses.getResponses()
tags = sorted(allResponses.keys())
coursesData = getCoursesData()


def chat(text: str):

    results = chatModel.predict([text])
    if np.max(results) > 0.6:
        # Pegue o índice da resposta mais provável
        tag_index = np.argmax(results)
        print(results)
        # Verifique a tag da resposta mais provável
        tag = tags[tag_index]
        # Escolha aleatoriamente uma das respostas para esta tag
        return random.choice(allResponses[tag]), tag
    # Caso não seja identificada uma resposta com probabilidade relevante,
    # o chatbot responderá com uma mensagem padrão
    else:
        return "I\'m sorry, I didn\'t understand that."
        "I\'m still learning how to comunicate. Could you rephrase that?",
        "none"


def isNaN(num):
    return num != num


def stringToAudio():
    microfone = sr.Recognizer()
    with sr.Microphone() as source:
        microfone.adjust_for_ambient_noise(source)
        audio = microfone.listen(source)
        frase = microfone.recognize_google(audio, language='pt-BR')
        translator = Translator()
        detect = translator.detect(frase)
        t = translator.translate(
            frase, dest='pt', src=detect.lang)
        print(t)
        return t.pronunciation


def TranslateText(textToTranslate, language):
    translator = Translator()
    detect = translator.detect(textToTranslate)
    t = translator.translate(
        textToTranslate, dest=language, src=detect.lang)
    return t.text


def query(text: str):
    query = searchModel.predict([text])
    results = cosine_similarity(query, coursesData["embeddings"])

    indexes = (-results).argsort()
    messages = []
    for i in indexes[0][:3]:

        if (isNaN(coursesData["skills"][i])):
            coursesData["skills"][i] = "Something and more"
        if (isNaN(coursesData["names"][i])):
            coursesData["names"][i] = "Some name"
        if (isNaN(coursesData["hosts"][i])):
            coursesData["hosts"][i] = "Someone"
        if (isNaN(coursesData["difficulties"][i])):
            coursesData["difficulties"][i] = "between very difficult and very easy"
        if (isNaN(coursesData["descriptions"][i])):
            coursesData["descriptions"][i] = "Some generic description"
        if (isNaN(coursesData["urls"][i])):
            coursesData["urls"][i] = "http://urlqu3br4d0.com/"
        message = {

            "name": coursesData["names"][i],
            "rated": coursesData["ratings"][i],
            "host": coursesData["hosts"][i],
            "difficultie": coursesData["difficulties"][i],
            "description": coursesData["descriptions"][i],
            "skill": coursesData["skills"][i],
            "url": coursesData["urls"][i]
        }
        messages.append(message)

    return messages
