import fastapi
import structs, dbint

api = fastapi.FastAPI()

@api.get("/")
def root():
    return {"code": 200}

@api.post("/truck")
def createTruck():
    return {}

@api.get("/truck")
def readTruck():
    return {"truck": "yes"}

@api.patch("/truck")
def updateTruck():
    return {}

@api.delete("/truck")
def deleteTruck():
    return {}

import uvicorn

uvicorn.run(api, port=5089)