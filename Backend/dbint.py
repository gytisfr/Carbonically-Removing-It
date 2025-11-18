import sqlite3, bcrypt, datetime, random, typing, jwt, os
import structs

os.chdir("\\".join(__file__.split("\\")[:-1]))

chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

secret = "bbda1398-4214-424b-8e0a-3b6582f00913"

def encode(text : typing.Union[str, list]):
    #"   %22
    #'   %27
    #\   %5C
    #-   %2D
    #%   %25

    def actual(string : str):
        return string.replace("%", "%25").replace("-", "%2D").replace("\\", "%5C").replace("'", "%27").replace('"', "%22").replace("$", "%24")
    
    if type(text) == list:
        new = []
        for entry in text:
            new.append(encode(entry))
        return new
    elif type(text) == str:
        return actual(text)
    else:
        return text

def decode(text : typing.Union[int, list]):
    def actual(string : str):
        return string.replace("%24", "$").replace('%22', '"').replace("%27", "'").replace("%5C", "\\").replace("%2D", "-").replace("%25", "%")
    
    if type(text) == list:
        new = []
        for entry in text:
            new.append(decode(entry))
        return new
    elif type(text) == str:
        return actual(text)
    else:
        return text

"""
def checkTypesMatch(table : str, data : list):
    types = [el["type"] for el in structs.types[table]]
    if len(data) != len(types):
        return "err" #incorrect amount of arguments
    notMatchings = []
    for value in range(len(data)):
        if type(data[value]) != types[value]:
            notMatchings.append(value)
    if notMatchings:
        return notMatchings
    return True
"""



def create(table : str, struct):
    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()
    
    listed = encode(struct.listise())

    try:
        cursor.execute(f"""insert into {table} values({', '.join(["'" + attribute + "'" if type(attribute) == str else 'null' if attribute == None else str(attribute) for attribute in listed])});""")
    except Exception as e:
        return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    
    connection.commit()

    return True

def read(table : str, id):
    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()

    id = encode(id)

    idType = structs.types[table][0]["type"]

    if idType == int:
        try:
            id = int(id)
        except:
            pass
        query = f"select * from {table} where id = {id};"
    else:
        query = f"select * from {table} where id = '{id}';"
    
    try:
        result = cursor.execute(query).fetchall()
    except Exception as e:
        return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    
    if not result:
        return False

    result = [decode(el) for el in result[0]]

    return result

def check(table : str, id):
    result = read(table, id)

    if type(result) == dict:
        return bool(result)
    
    return result

def fetch(table : str):
    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()
    
    result = cursor.execute(f"select * from {table};").fetchall()

    if result:
        result = [[decode(el) for el in attribute] for attribute in result]

    return result

def update(table : str, id, what : str, to):
    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()

    what = what.lower()

    columns = [el["name"] for el in structs.types[table]]
    if what not in columns:
        return f"AttributeError: No such column '{what}' in {table} table"
    
    expectedType = [el["type"] for el in structs.types[table] if el["name"] == what][0]
    if type(to) != expectedType:
        return f"TypeError: '{type(to)}' object received when expecting '{expectedType}' for '{what}' column"
    
    id, to = encode([id, to])

    idType = structs.types[table][0]["type"]

    if idType == int:
        try:
            id = int(id)
            if type(to) == int:
                try:
                    to = int(to)
                    query = f"""update {table} set {what} = {to} where id = {id};"""
                except Exception as e:
                    pass
            else:
                query = f"""update {table} set {what} = '{to}' where id = {id};"""
        except Exception as e:
            pass
    else:
        if type(to) == int:
            try:
                to = int(to)
                query = f"""update {table} set {what} = {to} where id = '{id}';"""
            except:
                pass
        else:
            query = f"""update {table} set {what} = '{to}' where id = '{id}';"""
    
    try:
        cursor.execute(query)
    except Exception as e:
        return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    
    connection.commit()

    return True

def delete(table : str, id):
    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()
    
    id = encode(id)

    idType = structs.types[table][0]["type"]

    if idType == int:
        try:
            id = int(id)
        except:
            pass

        query = f"delete from {table} where id = {id};"
    else:
        query = f"delete from {table} where id = '{id}';"
    
    try:
        cursor.execute(query)
    except Exception as e:
        return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    
    connection.commit()

    return True

class User:
    def create(username : str, password : str):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()

        username = encode(username)

        hash = encode(bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8"))

        try:
            cursor.execute(f"insert into users(username, password) values('{username}', '{hash}');")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)

        connection.commit()

        id = User.from_username(username)

        preToken = {"id": id, "timestamp": datetime.datetime.now().timestamp()}
        token = jwt.encode(preToken, secret, algorithm="HS256")

        encodedToken = encode(token)

        try:
            cursor.execute(f"update users set token = '{encodedToken}' where id = {id};")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)

        connection.commit()
        
        return [token]
    
    def read(id : int):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        
        result = cursor.execute(f"select * from users where id = {id};").fetchall()

        if not result:
            return False

        result = decode(result[0][1])

        return result
    
    def check(id : int):
        result = User.read(id)

        if type(result) == str:
            return bool(result)
    
        return result
    
    def from_username(username : str):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()

        username = encode(username)
        
        result = cursor.execute(f"select * from users where username = '{username}';").fetchall()

        if not result:
            return False

        return result[0][0]
    
    def update(id : int, what : str, to):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()

        what = what.lower()

        if what != "username":
            return f"AttributeError: No such column '{what}' in {table} table"
        
        to = encode(to)
        
        try:
            cursor.execute(f"""update users set {what} = '{to}' where id = {id};""")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        
        connection.commit()

        return True
    
    def delete(id : int):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        
        try:
            cursor.execute(f"delete from users where id = {id};")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        
        connection.commit()

        return True

class Authentication:
    def login(username : str, password : str):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()

        username = encode(username)

        user = cursor.execute(f"select id, password from users where username = '{username}';").fetchall()

        if not user:
            return False

        id = user[0][0]
        passwordHashDecoded = decode(user[0][1])
        match = bcrypt.checkpw(password.encode("utf-8"), passwordHashDecoded.encode("utf-8"))

        if not match:
            return False

        preToken = {"id": id, "timestamp": datetime.datetime.now().timestamp()}
        token = jwt.encode(preToken, secret, algorithm="HS256")

        try:
            cursor.execute(f"update users set token = '{token}' where id = {id};")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        
        connection.commit()

        return token
    
    def logout(token : str):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()

        token = encode(token)

        id = cursor.execute(f"select id from users where token = '{token}';").fetchall()

        if not id:
            return False

        try:
            cursor.execute(f"update users set token = '' where id = {id[0][0]};")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        
        connection.commit()

        return True
    
    def validate(token : str):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()

        token = encode(token)

        id = cursor.execute(f"select id from users where token = '{token}';").fetchall()

        if not id:
            return False

        return id[0][0]