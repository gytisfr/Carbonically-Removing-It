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
    def __init__(self, id : int, routeid : int, driverid : int, capacity : int):
        self.id = id
        self.routeid = routeid
        self.driverid = driverid
        self.capacity = capacity
    
    def listise(self):
        return [self.id, self.routeid, self.driverid, self.capacity]