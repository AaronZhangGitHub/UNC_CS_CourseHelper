from pony.orm import *

db = Database()

class Category(db.Entity):
	CatID = PrimaryKey(int, auto=True)
	Name = Required(str)
	Classes = Set('Class', table='ClassCategory', column="CID")

	class Meta:
		collections = [
			('Classes', 'Class')
		]
		primary_key = 'CatID'

class Class(db.Entity):
	CID = PrimaryKey(int, auto=True)
	Name = Required(str)
	Description = Required(str)
	Categories = Set(Category, table='ClassCategory', column="CatID")
	Tags = Set('Tag', table='ClassTag', column="TID")
	UsersTaken = Set('ClassesTaken')
	UsersToTake = Set('ClassesToTake')
	EQClasses = Set('EQC', table='EQClass', column='EQClass', reverse='Classes')
	Prerequisites = Set('EQC', table='Prerequisite', column='EQClass')

	class Meta:
		collections = [
			('Categories', 'Category'),
			('Tags', 'Tag'),
			('UsersTaken', 'ClassesTaken'),
			('UsersToTake', 'ClassesToTake'),
			('EQClasses', 'EQC'),
			('Prerequisites', 'EQC')
		]
		primary_key = 'CID'


class Tag(db.Entity):
	TID = PrimaryKey(int, auto=True)
	Name = Required(str)
	Classes = Set(Class, table='ClassTag', column='CID')
	InterestedUsers = Set('User', table='Interest', column='UID')

	class Meta:
		collections = [
			('Classes', 'Class'),
			('InterestedUsers', 'User')
		]
		primary_key = 'TID'


class User(db.Entity):
	UID = PrimaryKey(int, auto=True)
	Name = Required(str)
	Username = Required(str)
	Password = Required(str)
	ClassesTaken = Set("ClassesTaken")
	ClassesToTake = Set('ClassesToTake')
	Interests = Set(Tag, table='Interest', column='TID')

	class Meta:
		collections = [
			('ClassesTaken', 'ClassesTaken'),
			('ClassesToTake', 'ClassesToTake'),
			('Interests', 'Tag')
		]
		primary_key = 'UID'


class ClassesTaken(db.Entity):
	User = Required(User, column='UID')
	Class = Required(Class, column='CID')
	Semester = Required(str)
	PrimaryKey(Class, User, Semester)

	class Meta:
		collections = []
		primary_key = 'Class,User,Semester'


class ClassesToTake(db.Entity):
	User = Required(User, column='UID')
	Class = Required(Class, column='CID')
	Semester = Required(str)
	PrimaryKey(Class, User, Semester)

	class Meta:
		collections = []
		primary_key = 'Class,User,Semester'

class EQC(db.Entity):
	EQClass = PrimaryKey(int, auto=True)
	Classes = Set(Class, table='EQClass', column='CID')
	PrerequisiteFor = Set(Class, table='Prerequisite', column='CID')

	class Meta:
		collections = [
			('Classes', 'Class'),
			('PrerequisiteFor', 'Class')
		]
		primary_key = 'EQClass'

