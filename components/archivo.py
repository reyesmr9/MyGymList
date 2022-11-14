import os

images=[]

def getFiles(path):
    for file in os.listdir(path):
        if file.endswith(".png"):
            images.append(os.path.join(path, file))

filesPath = "C:/Users/reyes/react-native-course/assets/fitness"

getFiles(filesPath)
print(images)