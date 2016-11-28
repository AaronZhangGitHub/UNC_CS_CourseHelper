import textract
import csv
text = textract.process('/Users/Brennan/Downloads/Comp426Final/courses.pdf')
for i in range(13):
	text = text.replace("http://www.catalog.unc.edu/courses/comp/\n\n%s/12\n\n\x0c10/26/2016\n\nCOMPUTER SCIENCE (COMP) < University of North Carolina at Chapel Hill\n"%i, " ")
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
		if di["CID"]=="COMP 401":
	 	 	di["Description"]="Required preparation, a first formal course in computer programming (e.g., COMP 110, COMP 116). Advanced programming: object- oriented design, classes, interfaces, packages, inheritance, delegation, observers, MVC (model view controller), exceptions, assertions. Honors version available"
	 	if di["CID"]=="COMP 735":
	 	 	di["Description"]="Verification of concurrent systems. Synchronization; mutual exclusion and related problems, barriers, rendezvous, nonblocking algorithms. Fault tolerance: consensus, Byzantine agreement, self-stabilization. Broadcast algorithms. Termination and deadlock detection. Clock synchronization."
	  	if di["CID"]=="COMP 825":
	 		di["Description"]="Propositional calculus, Horn clauses, first-order logic, resolution. Prolog: operational semantics, relationship to resolution, denotational semantics, and non-logical features. Programming and applications. Selected advanced topics."	
 	if i.find("Prerequisite, ")!=-1: 	
 		requisites=i[i.index("Prerequisite, ")+14:]
 		if requisites.find(":")== -1:
 			di["Prerequisites"]=requisites
 		else:
 			requisites=requisites[:requisites.index(":")]
 			di["Prerequisites"]= requisites[:requisites.rindex("\n")]	
	elif i.find("Prerequisites, ")!=-1:
	 	requisites=i[i.index("Prerequisites, ")+15:]
	 	if requisites.find(":")== -1:
	 		di["Prerequisites"]=requisites
	 	else:
	 		requisites=requisites[:requisites.index(":")]
	 		di["Prerequisites"]= requisites[:requisites.rindex("\n")]
 	else:
 		di["Prerequisites"]="None"	
 	li.append(di)
	
with open('classes.csv','w') as myfile:
		wr=csv.writer(myfile, quoting=csv.QUOTE_ALL)
		wr.writerow(["CID", "Name", "Credits", "Description", "Prerequisites"])

for i in li:
	row=[i["CID"],i["Name"], i["Credits"], i["Description"], i["Prerequisites"]]
	with open('classes.csv','a') as myfile:
		wr=csv.writer(myfile, quoting=csv.QUOTE_ALL)
		wr.writerow(row)

