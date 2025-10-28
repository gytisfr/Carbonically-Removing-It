class Truck:
    def __init__(self, id : int, route : str, driver : int, capacity : int):
        self.id = id
        self.routeid = routeid
        self.driverid = driverid
        self.capacity = capacity

class Route:
    def __init__(self, id : str, locations : str):
        self.id = id
        self.locations = locations

class Client:
    def __init__(self, id : int, name : str, location : str, carbontype : int, producer : bool):
        self.id = id
        self.name = name
        self.location = location
        self.carbontype = carbontype
        self.producer = producer

class Driver:
    def __init__(self, id : int, name : str, position : str):
        self.id = id
        self.name = name
        self.position = position