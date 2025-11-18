types = {
    "clients": [
        {"name": "id", "type": int, "required": True},
        {"name": "name", "type": str, "required": True},
        {"name": "location", "type": str, "required": True},
        {"name": "carbontype", "type": int, "required": True},
        {"name": "producer", "type": bool, "required": True}
    ],
    "routes": [
        {"name": "id", "type": str, "required": True},
        {"name": "locations", "type": str, "required": True}
    ],
    "drivers": [
        {"name": "id", "type": int, "required": True},
        {"name": "name", "type": str, "required": True},
        {"name": "position", "type": str, "required": True}
    ],
    "trucks": [
        {"name": "id", "type": int, "required": True},
        {"name": "capacity", "type": int, "required": True},
        {"name": "long", "type": float, "required": True},
        {"name": "lat", "type": float, "required": True},
        {"name": "routeid", "type": str, "required": False},
        {"name": "driverid", "type": str, "required": False}
    ],
    "users": [
        {"name": "id", "type": int, "required": True},
        {"name": "username", "type": str, "required": True},
        {"name": "password", "type": str, "required": True},
        {"name": "token", "type": str, "required": False}
    ]
}

class Client:
    def __init__(self, id : int, name : str, location : str, carbontype : int, producer : bool):
        self.id = id
        self.name = name
        self.location = location
        self.carbontype = carbontype
        self.producer = producer
    
    def listise(self):
        return [self.id, self.name, self.location, self.carbontype, self.producer]

class Route:
    def __init__(self, id : str, locations : str):
        self.id = id
        self.locations = locations
    
    def listise(self):
        return [self.id, self.locations]

class Driver:
    def __init__(self, id : int, name : str, position : str):
        self.id = id
        self.name = name
        self.position = position
    
    def listise(self):
        return [self.id, self.name, self.position]

class Truck:
    def __init__(self, id : int, capacity : int, long : float, lat : float, routeid : int = None, driverid : int = None):
        self.id = id
        self.capacity = capacity
        self.long = long
        self.lat = lat
        self.routeid = routeid
        self.driverid = driverid
    
    def listise(self):
        return [self.id, self.capacity, self.long, self.lat, self.routeid, self.driverid]