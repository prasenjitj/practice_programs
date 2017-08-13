data =  [(1, 5), (2, 4), (3, 6)]
def mergeoverlapping(initialranges):
    i = sorted(set([tuple(sorted(x)) for x in initialranges]))

    # initialize final ranges to [(a,b)]
    f = [i[0]]
    for c, d in i[1:]:
        a, b = f[-1]
        if c<=b<d:
            f[-1] = a, d
        elif b<c<d:
            f.append((c,d))
        else:
            # else case included for clarity. Since
            # we already sorted the tuples and the list
            # only remaining possibility is c<d<b
            # in which case we can silently pass
            pass
    return f

print mergeoverlapping(data)
