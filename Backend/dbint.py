import sqlite3, typing, os
#sqlite3, bcrypt, typing, datetime, random jwt, os
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
        return string.replace("%", "%25").replace("-", "%2D").replace("\\", "%5C").replace("'", "%27").replace('"', "%22")
    
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
        return string.replace('%22', '"').replace("%27", "'").replace("%5C", "\\").replace("%2D", "-").replace("%25", "%")
    
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
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)

        query = f"select * from {table} where id == {id}"
    else:
        query = f"select * from {table} where id == '{id}'"
    
    result = cursor.execute(query).fetchall()

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
    
    result = cursor.execute(f"select * from {table}").fetchall()

    if result:
        result = [[decode(el) for el in attribute] for attribute in result]

    return result

def update(table : str, id, what, to):
    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()

    columns = [el["name"] for el in structs.types[table]]
    if what not in columns:
        return f"AttributeError: No such column '{what}' in {table} table"
    
    expectedType = structs.table[table]["type"]
    if type(to) != expectedType:
        return f"TypeError: '{type(to)}' object received when expecting '{expectedType}' for '{what}' column"

    original = check(table, id)
    if not original:
        return 404
    
    id, to = encode([id, to])

    idType = structs.types[table][0]["type"]

    if idType == int:
        try:
            id = int(id)
            if type(to) == int:
                try:
                    to = int(to)
                    query = f"""update {table} set {what} = {to} where id = {id}"""
                except Exception as e:
                    return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
            else:
                query = f"""update {table} set {what} = '{to}' where id = {id}"""
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    else:
        if type(to) == int:
            try:
                to = int(to)
                query = f"""update {table} set {what} = {to} where id = '{id}'"""
            except Exception as e:
                return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        else:
            query = f"""update {table} set {what} = '{to}' where id = '{id}'"""
    
    cursor.execute(query)
    
    connection.commit()

    return True

def delete(table : str, id):
    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()

    exists = check(table, id)

    if not exists:
        return 404
    
    id = encode(id)

    idType = structs.types[table][0]["type"]

    if idType == int:
        try:
            id = int(id)
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)

        query = f"delete from {table} where id == {id}"
    else:
        query = f"delete from {table} where id == '{id}'"
    
    result = cursor.execute(query)
    
    connection.commit()

    return True