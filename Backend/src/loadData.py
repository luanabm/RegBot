import json

data_file_path = 'data/data.json'

def getCoursesData():

    with open(data_file_path) as json_file:
        data = json.load(json_file)
    
    return data