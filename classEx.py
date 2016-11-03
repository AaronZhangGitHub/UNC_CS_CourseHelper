import textract
import csv
text = textract.process('/Users/Brennan/Downloads/courses.pdf')
for i in range(13):
	text = text.replace("http://www.catalog.unc.edu/courses/comp/\n\n%s/12\n\n\x0c10/26/2016\n\nCOMPUTER SCIENCE (COMP) < University of North Carolina at Chapel Hill\n"%i, "")
classes=text.split("\nCOMP ")
c=classes[1:]
li=[]
for i in c:
 	di={}
 	di["CID"]="COMP %s"%i[:i.index(".")]
 	i=i[i.index(".")+1:]
 	di["Name"]=i[:i.index(".")]
 	i=i[i.index(".")+1:]
 	di["Credits"]=i[:i.index(".\n")]
 	i=i[i.index(".\n")+1:]
 	if i.find(":")== -1:
 		di["Description"]=i.replace("\n","")
 	else:
 	 	description=i[:i.index(":")]
 	 	di["Description"]=description[:description.rindex("\n")].replace("\n","")
 	if i.find("Prerequisite, ")!=-1: 	
 		requisites=i[i.index("Prerequisite, ")+14:]
 		if requisites.find(":")== -1:
 			di["Prerequisites"]=requisites
 		else:
 			requisites=requisites[:requisites.index(":")]
 			di["Prerequisites"]= requisites[:requisites.rindex("\n")]
 	else:
 		di["Prerequisites"]="None"	
 	li.append(di)

with open('test.csv','a') as myfile:
		wr=csv.writer(myfile, quoting=csv.QUOTE_ALL)
		wr.writerow(["CID", "Name", "Credits", "Description", "Prerequisites"])

for i in li:
	row=[i["CID"],i["Name"], i["Credits"], i["Description"], i["Prerequisites"]]
	with open('test.csv','a') as myfile:
		wr=csv.writer(myfile, quoting=csv.QUOTE_ALL)
		wr.writerow(row)

