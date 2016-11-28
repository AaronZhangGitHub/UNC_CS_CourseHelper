import sqlite3
import pandas as pd
dataframe = pd.read_csv("classes.csv")
db = sqlite3.connect("websiteDatabase.db")
cursor = db.cursor()

cursor.execute("""DROP TABLE IF EXISTS ClassTag""")
cursor.execute("""DROP TABLE IF EXISTS Class""")
cursor.execute("""DROP TABLE IF EXISTS EQClass""")
cursor.execute("""DROP TABLE IF EXISTS Prerequisite""")
cursor.execute("""DROP TABLE IF EXISTS Tag""")
cursor.execute("""DROP TABLE IF EXISTS User""")
cursor.execute("""DROP TABLE IF EXISTS Category""")
cursor.execute("""DROP TABLE IF EXISTS ClassCategory""")
cursor.execute("""DROP TABLE IF EXISTS EQC""")

#CREATES TABLE TO RECORD USERS
cursor.execute("""CREATE TABLE IF NOT EXISTS User(UID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TINYTEXT,
    Username TINYTEXT,
    Password TINYTEXT,
    UNIQUE(Username))""")


#CREATES TABLE TO RECORD CLASSES
cursor.execute("""CREATE TABLE IF NOT EXISTS Class(CID INTEGER PRIMARY KEY,
    Name TINYTEXT,
    Description TEXT)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS EQC(EQClass INTEGER PRIMARY KEY)""")

#CREATES TABLE TO REPRESENT EQUIVALENCE CLASSES WHICH ARE USED TO TRACK PREREQUISITES
cursor.execute("""CREATE TABLE IF NOT EXISTS EQClass(CID INTEGER,
    EQClass Integer,
    Primary Key(CID, EQClass)
    Foreign Key(CID) References Class(CID)
    Foreign Key(EQClass) References EQC(EQClass))""")

#CREATES TABLE TO REPRESENT CATEGORIES WHICH ARE USED TO REPRESENT FIELDS IN COMPUTER SCIENCE
cursor.execute("""CREATE TABLE IF NOT EXISTS Category(CatID INTEGER PRIMARY KEY,
    Name TINYTEXT)""")


#CREATES TABLE TO REPRESENT TAGS WHICH ARE USED TO SELECT CLASSES BASED ON USER INTERESTS
cursor.execute("""CREATE TABLE IF NOT EXISTS Tag(TID INTEGER PRIMARY KEY,
    Name TINYTEXT)""")


#CREATES TABLE TO RECORD PREREQUISITES ASSOCIATED WITH CLASSES
cursor.execute("""CREATE TABLE IF NOT EXISTS Prerequisite(CID INTEGER,
    EQClass INTEGER,
    Primary Key(CID, EQClass),
    Foreign Key(CID) References Class(CID),
    Foreign Key(EQClass) References EQC(EQClass))""")


#CREATES TABLE TO RECORD INTERESTS ASSOCIATED WITH USERS
cursor.execute("""CREATE TABLE IF NOT EXISTS Interest(UID INTEGER,
    TID INTEGER,
    Primary Key(UID, TID),
    Foreign Key(UID) References User(UID),
    Foreign Key(TID) References Tag(TID) )""")


#CREATES TABLE TO RECORD CATEGORIES ASSOCIATED WITH CLASSES
cursor.execute("""CREATE TABLE IF NOT EXISTS ClassCategory(CID INTEGER,
    CatID INTEGER,
    Primary Key(CID, CatID),
    Foreign Key(CID) References Class(CID),
    Foreign Key(CatID) References Category(CatID))""")


#CREATES TABLE TO RECORD TAGS ASSOCIATED WITH CLASSES
cursor.execute("""CREATE TABLE IF NOT EXISTS ClassTag(CID INTEGER,
    TID INTEGER,
    Primary Key(CID, TID),
    Foreign Key(CID) References Class(CID),
    Foreign Key(TID) References Tag(TID))""")


#CREATES TABLE TO RECORD CLASSES TAKEN BY STUDENTS
cursor.execute("""CREATE TABLE IF NOT EXISTS ClassesTaken(UID INTEGER,
    CID INTEGER,
    Semester TINYTEXT,
    Primary Key(UID, CID, Semester),
    Foreign Key(UID) References User(UID),
    Foreign Key(CID) References Class(CID))""")

cursor.execute("""CREATE TABLE IF NOT EXISTS ClassesToTake(UID INTEGER,
    CID INTEGER,
    Semester TINYTEXT,
    Primary Key(UID, CID, Semester),
    Foreign Key(UID) References User(UID),
    Foreign Key(CID) References Class(CID))""")


categories=[]
eqclasses=[]
for row in dataframe.itertuples():
    if row[0]==47:
        break
    cid=row[0]+1
    try:
        cursor.execute("""INSERT INTO Class(CID, Name, Description) VALUES(?,?, ?)""", (cid,"%s: %s"%(row[1],row[2]), row[4]))
    except:
        pass
    for eqclass in row[8].split(","):
        if eqclass.strip() not in eqclasses:
            eqclasses.append(eqclass.strip())
            try:
                cursor.execute("""INSERT INTO EQC VALUES(?)""", (eqclass.strip(),))
            except:
                pass
        try:
            cursor.execute("""INSERT INTO EQClass(CID, EQClass) VALUES(?, ?)""", (cid,eqclass.strip()))
        except:
            pass
    for prereq in row[9].split(","):
        try:
            cursor.execute("""INSERT INTO Prerequisite(CID, EQClass) VALUES(?, ?)""", (cid,prereq.strip()))
        except:
            pass
    try:
        for cat in row[6].split(","):
            if cat.strip() not in categories:
                categories.append(cat.strip())
                cursor.execute("""INSERT INTO Category VALUES(?,?)""", (categories.index(cat.strip()),cat.strip()))
            cursor.execute("""INSERT INTO ClassCategory VALUES(?,?)""", (cid,categories.index(cat.strip())))
    except:
        pass


db.commit()
db.close()
