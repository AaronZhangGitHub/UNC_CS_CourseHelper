import csv
a=[i for i in range(100)]
with open('test', 'wb') as myfile:
    wr = csv.writer(myfile, quoting=csv.QUOTE_ALL)
    wr.writerow(a)