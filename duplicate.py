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
