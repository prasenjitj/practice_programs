l = [1, 1, 2, 3, 3, 4, 5, 8, 6, 7, 7]
tmp = []
def get_unique(arr):
    for i in range(len(arr)):
        for j in range(len(arr)):
            if arr[i] != arr[j]:
                if arr[i] not in tmp:
                    tmp.append(arr[i])
    return tmp
print get_unique(l)

print dict((x,True) for x in l).keys()

print [x for i,x in enumerate(l) if l.index(x) == i]

for i in l:
    if i in l[l.index(i)+1:]:
        l.remove(i)
print l

#  count of duplicate elements
>>> l = [1,1,2,3,4,6,1,2]
>>> d = {}
>>> for i in l:
...     if i in d:
...         d[i] +=1
...     else:
...         d[i] =1
...
...
...
>>> d
{1: 3, 2: 2, 3: 1, 4: 1, 6: 1}
>>> max(d,key=lambda x: d[x])
1
>>>
# find pair in integer array whose sum is 10 in 0(n)
#
def find_pair(l,T):
    d = {}
    for i,j in enumerate(l):
        if j not in d:
            d[i] = j
    for k in d:
        temp = T - d[k]
        if temp >= 0 and temp in d.values():
            print d[k],T -d[k]

print find_pair([1,4,45,6,10,-8],16)

