import fastapi
import structs, dbint

api = fastapi.FastAPI()

@api.get("/")
def root():
    return {"code": 200}

@api.post("/truck")
def createTruck(id : int, routeid : int, driverid : int = None, capacity : int = None):
    dbint.truck.create(structs.Truck(id, routeid, driverid, capacity))
    return {"code": 200}

@api.get("/truck")
def readTruck(id : int):
    truck = dbint.truck.read(id)
    print(truck)
    return {"truck": "yes"}

@api.patch("/truck")
def updateTruck(id : int, what : str, to : str):
    return {}

@api.delete("/truck")
def deleteTruck(id : int):
    dbint.truck.delete(id)
    return {"code": 200}

import uvicorn

uvicorn.run(api, port=5089)