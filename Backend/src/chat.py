from src.loadData import getCoursesData
import src.chatResponses as responses
import random
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import tensorflow_text as text
from tensorflow import keras
from sklearn.metrics.pairwise import cosine_similarity


searchModel = keras.models.load_model(
    '/home/luana/Downloads/TCCC (1)/AngularBot/Backend/model/searchModel.h5', custom_objects={'KerasLayer': hub.KerasLayer}, compile=False)
chatModel = keras.models.load_model(
    '/home/luana/Downloads/TCCC (1)/AngularBot/Backend/model/chatModel.h5', custom_objects={'KerasLayer': hub.KerasLayer}, compile=False)
allResponses = responses.getResponses()
tags = sorted(allResponses.keys())
coursesData = getCoursesData()


def chat(text: str):

    results = chatModel.predict([text])
    if np.max(results) > 0.6:
        # Pegue o índice da resposta mais provável
        tag_index = np.argmax(results)
        # Verifique a tag da resposta mais provável
        tag = tags[tag_index]
        # Escolha aleatoriamente uma das respostas para esta tag
        return random.choice(allResponses[tag]), tag
    # Caso não seja identificada uma resposta com probabilidade relevante,
    # o chatbot responderá com uma mensagem padrão
    else:
        return ('Não entendi. Me desculpe, pode repetir?', 'indefinido')


def isNaN(num):
    return num != num


def query(text: str):
    query = searchModel.predict([text])
    results = cosine_similarity(query, coursesData["data"])

    indexes = (-results).argsort()
    messages = []
    for i in indexes[0][:1]:

        if (isNaN(coursesData["num"][i])):
            coursesData["num"][i] = "Something and more"
        if (isNaN(coursesData["regulation"][i])):
            coursesData["regulation"][i] = "Some name"
        if (isNaN(coursesData["paragraph"][i])):
            coursesData["paragraph"][i] = "Someone"
        message = {

            "num": coursesData["num"][i],
            "regulation": coursesData["regulation"][i],
            "paragraph": coursesData["paragraph"][i],
        }
        messages.append(message)

    return messages
