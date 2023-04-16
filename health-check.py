import os
import requests
import time

def checkhealth():
    try:
        res = requests.get('http://localhost:8080/get-dfsResults?prompt=progress india growth development')
        if res.status_code == 200:
            print('service is up!')
        else:
            print('service is down! Restarting')
            os.system('start cmd /K node index.js')
    except:
        print('service is down! Restarting')
        os.system('start cmd /K node index.js')

while (True):
    checkhealth()
    time.sleep(60)