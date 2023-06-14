from googletrans import Translator
import speech_recognition as sr
import wave
from gtts import gTTS
from playsound import playsound

def stringToAudio():
    microfone = sr.Recognizer()
    with sr.Microphone() as source:
        microfone.adjust_for_ambient_noise(source)
        audio = microfone.listen(source)
        try:
            frase = microfone.recognize_google(audio, language='pt')
        except sr.UnknownValueError:
            frase = "Desculpe, não entendi o áudio. Pode repetir?"
        return frase

def createToAudio(audio):
    tts = gTTS(audio, lang = 'pt')
    with open('bot.mp3', 'wb') as fp:
        tts.save(fp)
        playsound(fp)


def TranslateText(textToTranslate, language):
    translator = Translator()
    detect = translator.detect(textToTranslate)
    t = translator.translate(
        textToTranslate, dest=language, src=detect.lang)
    return t.text