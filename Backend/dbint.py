import sqlite3
#bcrypt, typing, datetime, random jwt, os
import structs

os.chdir("\\".join(__file__.split("\\")[:-1]))

def encode():
    pass

def decode():
    pass

connection = sqlite3.connect("db.sqlite3")
cursor = connection.cursor()

class truck:
    def create(truck : structs.Truck):
        cursor.execute("insert into trucks values();")
    
    def read(id : int):
        pass
    
    def update(id : int, truck : structs.Truck):
        pass
    
    def delete(truck : structs.Truck):
        pass