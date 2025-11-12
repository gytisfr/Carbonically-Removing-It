import sqlite3, bcrypt, typing, datetime, random, jwt, os
#bcrypt, typing, datetime, random jwt, os
import structs

os.chdir("\\".join(__file__.split("\\")[:-1]))

chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

secret = "5a13f6c8-7927-40c8-8ff7-f29ba1935aa3"

def encode(text : typing.Union[str, list]):
    #"   %22
    #'   %27
    #\   %5C
    #-   %2D
    #%   %25
    if type(text) == list:
        new = []
        for entry in text:
            if type(entry) == str:
                new.append(entry.replace("%", "%25").replace("-", "%2D").replace("\\", "%5C").replace("'", "%27").replace('"', "%22"))
            else:
                new.append(entry)
        return new
    elif type(text) == str:
        text = text.replace("%", "%25").replace("-", "%2D").replace("\\", "%5C").replace("'", "%27").replace('"', "%22")
        return text
    else:
        return text

def decode(text : typing.Union[int, list]):
    if type(text) == list:
        new = []
        for entry in text:
            if type(entry) == str:
                new.append(entry.replace("%22", '"').replace("%27", "'").replace("%5C", "\\").replace("%2D", "-").replace("%25", "%"))
            else:
                new.append(entry)
        return new
    elif type(text) == str:
        text = text.replace("%22", '"').replace("%27", "'").replace("%5C", "\\").replace("%2D", "-").replace("%25", "%")
        return text

class client:
    def create(client : structs.Client):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()

        listed = encode(client.listise())

        try:
            cursor.execute(f"""insert into clients values({', '.join(["'" + attribute + "'" if type(attribute) == str else attribute for attribute in listed])})""")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    
    def read(id : int):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()

        id = encode(id)

        result = cursor.execute(f"select * from clients where id == {id}").fetchall()[0]

        return (result)
    
    def update(client : structs.Client):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()

        client = encode(client.listise())

        id = client[0]

        ogclient = client.read(id)

        if not ogclient:
            return "err"
        
        ogclient = encode(structs.Client(ogclient).listise())

        indexToWhat = {0: "id", 1: "name", 2: "location", 3: "carbontype", 4: "producer"}

        for att in range(len(client)):
            if client[att] != ogclient[att]:
                what = indexToWhat[att]
                try:
                    cursor.execute(f"""update clients set {what} = {client[att]} where id = {id}""")
                except Exception as e:
                    return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    
    def delete(client : int or structs.Client):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()

        if type(client) == structs.Client:
            client = client.id
        
        client = encode(client)

        cursor.execute(f"delete from clients where id = {client}")

class route:
    def create(route : structs.Route):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()

        listed = encode(route.listise())

        try:
            cursor.execute(f"""insert into routes values({', '.join(["'" + attribute + "'" if type(attribute) == str else attribute for attribute in listed])});""")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    
    def read(id : int):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        
        id = encode(id)

        result = cursor.execute(f"select * from routes where id == '{id}'").fetchall()[0]

        return (result)
    
    def update(route : structs.Route):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        
        route = encode(route.listise())

        id = route[0]

        ogroute = route.read(id)

        if not ogroute:
            return "err"
        
        ogroute = encode(structs.Route(ogroute).listise())

        indexToWhat = {0: "id", 1: "locations"}

        for att in range(len(route)):
            if route[att] != ogroute[att]:
                what = indexToWhat[att]
                try:
                    cursor.execute(f"""update routes set {what} = {route[att]} where id = '{id}'""")
                except Exception as e:
                    return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    
    def delete(route : int or structs.Route):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        
        if type(route) == structs.Route:
            route = route.id
        
        route = encode(route)

        cursor.execute(f"delete from routes where id = '{route}'")

class truck:
    def create(truck : structs.Truck):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        
        listed = encode(truck.listise())

        try:
            cursor.execute(f"""insert into trucks values({', '.join(["'" + attribute + "'" if type(attribute) == str else attribute for attribute in listed])});""")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    
    def read(id : int):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()

        result = cursor.execute(f"select * from trucks where id == {id}").fetchall()

        print(result)

        return (result)
    
    def update(truck : structs.Truck):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        
        truck = encode(truck.listise())

        id = truck[0]

        ogtruck = truck.read(id)

        if not ogtruck:
            return "err"
        
        ogtruck = encode(structs.Truck(ogtruck).listise())

        indexToWhat = {0: "id", 1: "locations"}

        for att in range(len(truck)):
            if truck[att] != ogtruck[att]:
                what = indexToWhat[att]
                try:
                    cursor.execute(f"""update trucks set {what} = {truck[att]} where id = {id}""")
                except Exception as e:
                    return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    
    def delete(truck : int or structs.Truck):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        
        if type(truck) == structs.Truck:
            truck = truck.id

        cursor.execute(f"delete from trucks where id = {truck}")