bash runtests.sh &> lastlog
cat lastlog | grep -v "+ echo" > log1
bash runtests.sh &> lastlog
cat lastlog | grep -v "+ echo" > log2
bash runtests.sh &> lastlog
cat lastlog | grep -v "+ echo" > log3
bash runtests.sh &> lastlog
cat lastlog | grep -v "+ echo" > log4
bash runtests.sh &> lastlog
cat lastlog | grep -v "+ echo" > log5