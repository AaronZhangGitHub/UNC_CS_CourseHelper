import sqlite3
import pandas as pd
dataframe = pd.read_csv("classes.csv")       
db = sqlite3.connect("classes.db")
cursor = db.cursor()

#CREATES TABLE TO RECORD USERS
cursor.execute("""CREATE TABLE IF NOT EXISTS Users(UID INTEGER, 
                                                    Name TEXT,
                                                    Username TEXT, 
                                                    Password TEXT, 
                                                    Primary Key(UID))""")


#CREATES TABLE TO RECORD CLASSES
cursor.execute("""CREATE TABLE IF NOT EXISTS Classes(CID INTEGER, 
                                                        Name TEXT, 
                                                        Description TEXT, 
                                                        EQClass INTEGER, 
                                                        Primary Key(CID))""")


#CREATES TABLE TO REPRESENT CATEGORIES WHICH ARE USED TO REPRESENT FIELDS IN COMPUTER SCIENCE
cursor.execute("""CREATE TABLE IF NOT EXISTS Category(CatID INTEGER, 
                                                        Title TEXT, 
                                                        Primary Key(CatID))""")


#CREATES TABLE TO REPRESENT TAGS WHICH ARE USED TO SELECT CLASSES BASED ON USER INTERESTS
cursor.execute("""CREATE TABLE IF NOT EXISTS Tags(TID INTEGER, 
                                                    Name TEXT, 
                                                    Primary Key(TID, Name))""")


#CREATES TABLE TO RECORD PREREQUISITES ASSOCIATED WITH CLASSES
cursor.execute("""CREATE TABLE IF NOT EXISTS Prerequisites(CID INTEGER, 
                                                            EQClass INTEGER, 
                                                            Primary Key(CID, EQClass), 
                                                            Foreign Key(CID) References Classes(CID), 
                                                            Foreign Key(EQClass) References Classes(EQClass))""")


#CREATES TABLE TO RECORD INTERESTS ASSOCIATED WITH USERS
cursor.execute("""CREATE TABLE IF NOT EXISTS Interests(UID INTEGER, 
                                                        TID INTEGER, 
                                                        Primary Key(UID, TID), 
                                                        Foreign Key(UID) References Users(UID), 
                                                        Foreign Key(TID) References Tags(TID) )""")


#CREATES TABLE TO RECORD CATEGORIES ASSOCIATED WITH CLASSES
cursor.execute("""CREATE TABLE IF NOT EXISTS ClassCategory(CID INTEGER, 
                                                            CatID INTEGER, 
                                                            Primary Key(CID, CatID), 
                                                            Foreign Key(CID) References Classes(CID), 
                                                            Foreign Key(CatID) References Category(CatID))""")


#CREATES TABLE TO RECORD TAGS ASSOCIATED WITH CLASSES
cursor.execute("""CREATE TABLE IF NOT EXISTS ClassTags(CID INTEGER,
                                                        TID INTEGER, 
                                                        Primary Key(CID, TID), 
                                                        Foreign Key(CID) References Classes(CID), 
                                                        Foreign Key(TID) References Tags(TID))""")


#CREATES TABLE TO RECORD CLASSES TAKEN BY STUDENTS
cursor.execute("""CREATE TABLE IF NOT EXISTS ClassesTaken(UID INTEGER, 
                                                            CID INTEGER, 
                                                            Primary Key(UID, CID), 
                                                            Foreign Key(UID) References Users(UID), 
                                                            Foreign Key(CID) References Classes(CID))""")

db.commit()
db.close()
