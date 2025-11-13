import fastapi
import structs, dbint

api = fastapi.FastAPI()

@api.get("/", tags=["Root"])
def root():
    return {"code": 200}

class Client:
    @api.post("/client", tags=["Client"])
    def create_client(id : int, name : str, location : str, carbontype : int, producer : bool):
        result = dbint.create("clients", structs.Client(id, name, location, carbontype, producer))
        if result == True:
            return {"code": 200}
        if result == "sqlite3.IntegrityError: UNIQUE constraint failed: clients.id":
            return {"code": 400, "error": f"IntegrityError: A client with id '{id}' already exists"}
        return {"code": 400, "error": result}

    @api.get("/client", tags=["Client"])
    def read_client(id : int):
        result = dbint.read("clients", id)
        if type(result) == list:
            return {"code": 200, "data": dict(zip([column["name"] for column in structs.types["clients"]], result))}
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 404}

    @api.get("/client/check", tags=["Client"])
    def check_client(id : int):
        result = dbint.check("clients", id)
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 200 if result else 404}

    @api.get("/client/fetch", tags=["Client"])
    def fetch_client():
        result = dbint.fetch("clients")
        columns = [column["name"] for column in structs.types["clients"]]
        return {"code": 200, "data": [dict(zip(columns, client)) for client in result]}

    @api.patch("/client", tags=["Client"])
    def update_client(id : int, what : str, to : str):
        result = dbint.update("clients", id, what, to)
        if result == True:
            return {"code": 200}
        if result == 400:
            return {"code": 400, "error": f"AttributeError: No such column '{what}' in clients table"}
        if result == 404:
            return {"code": 404}
        return {"code": 400, "error": result}

    @api.delete("/client", tags=["Client"])
    def delete_client(id : int):
        result = dbint.delete("clients", id)
        if result == True:
            return {"code": 200}
        if result == 404:
            return {"code": 404}
        return {"code": 400, "error": result}

class Route:
    @api.post("/route", tags=["Route"])
    def create_route(id : str, locations : str):
        result = dbint.create("routes", structs.Route(id, locations))
        if result == True:
            return {"code": 200}
        if result == "sqlite3.IntegrityError: UNIQUE constraint failed: routes.id":
            return {"code": 400, "error": f"IntegrityError: A route with id '{id}' already exists"}
        return {"code": 400, "error": result}

    @api.get("/route", tags=["Route"])
    def read_route(id : int):
        result = dbint.read("routes", id)
        if type(result) == list:
            return {"code": 200, "data": dict(zip([column["name"] for column in structs.types["routes"]], result))}
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 404}

    @api.get("/route/check", tags=["Route"])
    def check_route(id : int):
        result = dbint.check("routes", id)
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 200 if result else 404}

    @api.get("/route/fetch", tags=["Route"])
    def fetch_route():
        result = dbint.fetch("routes")
        columns = [column["name"] for column in structs.types["routes"]]
        return {"code": 200, "data": [dict(zip(columns, route)) for route in result]}

    @api.patch("/route", tags=["Route"])
    def update_route(id : int, what : str, to : str):
        result = dbint.update("routes", id, what, to)
        if result == True:
            return {"code": 200}
        if result == 400:
            return {"code": 400, "error": f"AttributeError: No such column '{what}' in routes table"}
        if result == 404:
            return {"code": 404}
        return {"code": 400, "error": result}

    @api.delete("/route", tags=["Route"])
    def delete_route(id : int):
        result = dbint.delete("routes", id)
        if result == True:
            return {"code": 200}
        if result == 404:
            return {"code": 404}
        return {"code": 400, "error": result}

class Driver:
    @api.post("/driver", tags=["Driver"])
    def create_driver(id : int, name : str, position : str):
        result = dbint.create("drivers", structs.Driver(id, name, position))
        if result == True:
            return {"code": 200}
        if result == "sqlite3.IntegrityError: UNIQUE constraint failed: drivers.id":
            return {"code": 400, "error": f"IntegrityError: A driver with id '{id}' already exists"}
        return {"code": 400, "error": result}

    @api.get("/driver", tags=["Driver"])
    def read_driver(id : int):
        result = dbint.read("drivers", id)
        if type(result) == list:
            return {"code": 200, "data": dict(zip([column["name"] for column in structs.types["drivers"]], result))}
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 404}

    @api.get("/driver/check", tags=["Driver"])
    def check_driver(id : int):
        result = dbint.check("drivers", id)
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 200 if result else 404}

    @api.get("/driver/fetch", tags=["Driver"])
    def fetch_driver():
        result = dbint.fetch("drivers")
        columns = [column["name"] for column in structs.types["drivers"]]
        return {"code": 200, "data": [dict(zip(columns, driver)) for driver in result]}

    @api.patch("/driver", tags=["Driver"])
    def update_driver(id : int, what : str, to : str):
        result = dbint.update("drivers", id, what, to)
        if result == True:
            return {"code": 200}
        if result == 400:
            return {"code": 400, "error": f"AttributeError: No such column '{what}' in drivers table"}
        if result == 404:
            return {"code": 404}
        return {"code": 400, "error": result}

    @api.delete("/driver", tags=["Driver"])
    def delete_driver(id : int):
        result = dbint.delete("drivers", id)
        if result == True:
            return {"code": 200}
        if result == 404:
            return {"code": 404}
        return {"code": 400, "error": result}

class Truck:
    @api.post("/truck", tags=["Truck"])
    def create_truck(id : int, routeid : int, long : float, lat : float, driverid : int = None, capacity : int = None):
        result = dbint.create("trucks", structs.Truck(id, capacity, long, lat, routeid, driverid))
        if result == True:
            return {"code": 200}
        if result == "sqlite3.IntegrityError: UNIQUE constraint failed: trucks.id":
            return {"code": 400, "error": f"IntegrityError: A truck with id '{id}' already exists"}
        return {"code": 400, "error": result}

    @api.get("/truck", tags=["Truck"])
    def read_truck(id : int):
        result = dbint.read("trucks", id)
        if type(result) == list:
            return {"code": 200, "data": dict(zip([column["name"] for column in structs.types["trucks"]], result))}
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 404}

    @api.get("/truck/check", tags=["Truck"])
    def check_truck(id : int):
        result = dbint.check("trucks", id)
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 200 if result else 404}

    @api.get("/truck/fetch", tags=["Truck"])
    def fetch_truck():
        result = dbint.fetch("trucks")
        columns = [column["name"] for column in structs.types["trucks"]]
        return {"code": 200, "data": [dict(zip(columns, truck)) for truck in result]}

    @api.patch("/truck", tags=["Truck"])
    def update_truck(id : int, what : str, to : str):
        result = dbint.update("trucks", id, what, to)
        if result == True:
            return {"code": 200}
        if result == 400:
            return {"code": 400, "error": f"AttributeError: No such column '{what}' in trucks table"}
        if result == 404:
            return {"code": 404}
        return {"code": 400, "error": result}

    @api.delete("/truck", tags=["Truck"])
    def delete_truck(id : int):
        result = dbint.delete("trucks", id)
        if result == True:
            return {"code": 200}
        if result == 404:
            return {"code": 404}
        return {"code": 400, "error": result}

import uvicorn

uvicorn.run(api, port=5089)