import fastapi
import structs, dbint
from fastapi import Header
from fastapi.middleware.cors import CORSMiddleware

api = fastapi.FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@api.get("/", tags=["Root"])
def root():
    return {"code": 200}

class Client:
    @api.post("/client", tags=["Client"])
    def create_client(name : str, location : str, carbontype : int, producer : bool, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.create("clients", structs.Client(0, name, location, carbontype, producer))
        if type(result) == list:
            return {"code": 200, "id": result[0]}
        return {"code": 400, "error": result}

    @api.get("/client", tags=["Client"])
    def read_client(id : int, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.read("clients", id)
        if type(result) == list:
            return {"code": 200, "data": dict(zip([column["name"] for column in structs.types["clients"]], result))}
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 404}

    @api.get("/client/check", tags=["Client"])
    def check_client(id : int, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.check("clients", id)
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 200 if result else 404}

    @api.get("/client/fetch", tags=["Client"])
    def fetch_client(token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.fetch("clients")
        columns = [column["name"] for column in structs.types["clients"]]
        return {"code": 200, "data": [dict(zip(columns, client)) for client in result]}

    @api.patch("/client", tags=["Client"])
    def update_client(id : int, what : str, to, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        exists = dbint.check("clients", id)
        if not exists:
            return {"code": 404}
        
        result = dbint.update("clients", id, what, to)
        if result == True:
            return {"code": 200}
        if result == 400:
            return {"code": 400, "error": f"AttributeError: No such column '{what}' in clients table"}
        return {"code": 400, "error": result}

    @api.delete("/client", tags=["Client"])
    def delete_client(id : int, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        exists = dbint.check("clients", id)
        if not exists:
            return {"code": 404}
        result = dbint.delete("clients", id)
        if result == True:
            return {"code": 200}
        return {"code": 400, "error": result}

class Route:
    @api.post("/route", tags=["Route"])
    def create_route(locations : str, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.create("routes", structs.Route("aaaa-aaaa", locations))
        if type(result) == list:
            return {"code": 200, "id": result[0]}
        return {"code": 400, "error": result}

    @api.get("/route", tags=["Route"])
    def read_route(id : str, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.read("routes", id)
        if type(result) == list:
            return {"code": 200, "data": dict(zip([column["name"] for column in structs.types["routes"]], result))}
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 404}

    @api.get("/route/check", tags=["Route"])
    def check_route(id : str, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.check("routes", id)
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 200 if result else 404}

    @api.get("/route/fetch", tags=["Route"])
    def fetch_route(token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.fetch("routes")
        columns = [column["name"] for column in structs.types["routes"]]
        return {"code": 200, "data": [dict(zip(columns, route)) for route in result]}

    @api.patch("/route", tags=["Route"])
    def update_route(id : str, what : str, to, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        exists = dbint.check("routes", id)
        if not exists:
            return {"code": 404}
        
        result = dbint.update("routes", id, what, to)
        if result == True:
            return {"code": 200}
        if result == 400:
            return {"code": 400, "error": f"AttributeError: No such column '{what}' in routes table"}
        return {"code": 400, "error": result}

    @api.delete("/route", tags=["Route"])
    def delete_route(id : str, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.delete("routes", id)
        if result == True:
            return {"code": 200}
        if result == 404:
            return {"code": 404}
        return {"code": 400, "error": result}

class Driver:
    @api.post("/driver", tags=["Driver"])
    def create_driver(name : str, position : str, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.create("drivers", structs.Driver(0, name, position))
        if type(result) == list:
            return {"code": 200, "id": result[0]}
        return {"code": 400, "error": result}

    @api.get("/driver", tags=["Driver"])
    def read_driver(id : int, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.read("drivers", id)
        if type(result) == list:
            return {"code": 200, "data": dict(zip([column["name"] for column in structs.types["drivers"]], result))}
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 404}

    @api.get("/driver/check", tags=["Driver"])
    def check_driver(id : int, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.check("drivers", id)
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 200 if result else 404}

    @api.get("/driver/fetch", tags=["Driver"])
    def fetch_driver(token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.fetch("drivers")
        columns = [column["name"] for column in structs.types["drivers"]]
        return {"code": 200, "data": [dict(zip(columns, driver)) for driver in result]}

    @api.patch("/driver", tags=["Driver"])
    def update_driver(id : int, what : str, to, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        exists = dbint.check("drivers", id)
        if not exists:
            return {"code": 404}
        
        result = dbint.update("drivers", id, what, to)
        if result == True:
            return {"code": 200}
        if result == 400:
            return {"code": 400, "error": f"AttributeError: No such column '{what}' in drivers table"}
        return {"code": 400, "error": result}

    @api.delete("/driver", tags=["Driver"])
    def delete_driver(id : int, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.delete("drivers", id)
        if result == True:
            return {"code": 200}
        if result == 404:
            return {"code": 404}
        return {"code": 400, "error": result}

class Truck:
    @api.post("/truck", tags=["Truck"])
    def create_truck(routeid : str, long : float, lat : float, driverid : int = None, capacity : int = None, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.create("trucks", structs.Truck(0, capacity, long, lat, routeid, driverid))
        if type(result) == list:
            return {"code": 200, "id": result[0]}
        return {"code": 400, "error": result}

    @api.get("/truck", tags=["Truck"])
    def read_truck(id : int, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.read("trucks", id)
        if type(result) == list:
            return {"code": 200, "data": dict(zip([column["name"] for column in structs.types["trucks"]], result))}
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 404}

    @api.get("/truck/check", tags=["Truck"])
    def check_truck(id : int, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.check("trucks", id)
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 200 if result else 404}

    @api.get("/truck/fetch", tags=["Truck"])
    def fetch_truck(token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.fetch("trucks")
        columns = [column["name"] for column in structs.types["trucks"]]
        return {"code": 200, "data": [dict(zip(columns, truck)) for truck in result]}

    @api.patch("/truck", tags=["Truck"])
    def update_truck(id : int, what : str, to, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        exists = dbint.check("trucks", id)
        if not exists:
            return {"code": 404}
        
        result = dbint.update("trucks", id, what, to)
        if result == True:
            return {"code": 200}
        if result == 400:
            return {"code": 400, "error": f"AttributeError: No such column '{what}' in trucks table"}
        return {"code": 400, "error": result}

    @api.delete("/truck", tags=["Truck"])
    def delete_truck(id : int, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        exists = dbint.check("trucks", id)
        if not exists:
            return {"code": 404}
        
        result = dbint.delete("trucks", id)
        if result == True:
            return {"code": 200}
        if result == 404:
            return {"code": 404}
        return {"code": 400, "error": result}

class User:
    @api.post("/users", tags=["Users"])
    def create_user(username : str, password : str):
        exists = dbint.User.from_username(username)
        if exists:
            return {"code": 400, "error": f"IntegrityError: A client with id '{id}' already exists"}
        
        result = dbint.User.create(username, password)
        if type(result) != list:
            return {"code": 400, "error": result}
        return {"code": 201, "token": result[0]}
    
    @api.get("/users", tags=["Users"])
    def read_user(id : int, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.User.read(id)
        if result:
            return {"code": 200, "username": result}
        return {"code": 404, "error": result}
    
    @api.get("/users/check", tags=["Users"])
    def check_user(id : int, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.User.check(id)
        return {"code": 200 if result else 404}
    
    @api.get("/users/from_username", tags=["Users"])
    def from_username(username : str, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        result = dbint.User.from_username(username)
        return {"code": 200 if result else 404}
    
    @api.patch("/users", tags=["Users"])
    def update_user(id : int, what : str, to, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        exists = dbint.User.check(id)
        if not exists:
            return {"code": 404}
        
        result = dbint.User.update(id, what, to)
        if result == True:
            return {"code": 200}
        return {"code": 400, "error": result}
    
    @api.delete("/users", tags=["Users"])
    def delete_user(id : int, token : str=Header(default=None)):
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        
        exists = dbint.User.check(id)
        if not exists:
            return {"code": 404}
        
        result = dbint.User.delete(id)
        if result == True:
            return {"code": 200}
        return {"code": 400, "error": result}

class Authentication:
    @api.post("/auth/login", tags=["Authentication"])
    def login(username : str, password : str):
        result = dbint.Authentication.login(username, password)
        if type(result) == list:
            return {"code": 200, "token": result[0]}
        if result == False:
            return {"code": 401}
        return {"code": 400, "error": result}
    
    @api.post("/auth/logout", tags=["Authentication"])
    def logout(token : str=Header(default=None)):
        result = dbint.Authentication.logout(token)
        if result:
            return {"code": 200}
        if result == False:
            return {"code": 401}
        return {"code": 400, "error": result}
    
    @api.post("/auth/validate/token", tags=["Authentication"])
    def validate_token(token : str=Header(default=None)):
        result = dbint.Authentication.validate(token)
        if result:
            return {"code": 200, "id": result[0], "username": result[1]}
        if result == False:
            return {"code": 401}
        return {"code": 400, "error": result}

import uvicorn

uvicorn.run(api, host="0.0.0.0", port=5089)