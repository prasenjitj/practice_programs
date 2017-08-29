class AutoIncrementSinglton(object):
    _instance = None

    def __new__(self, *args, **kwargs):
        if not self._instance:
            self._instance = super(AutoIncrementSinglton,
                                   self).__new__(self)
            self.value = 0
        self.value += 1
        return self.value

print AutoIncrementSinglton()
print AutoIncrementSinglton()
print AutoIncrementSinglton()
print AutoIncrementSinglton()


def Singleton(cls):
    instances = {}
    def getInstance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return getInstance


@Singleton
class PhonebookManager(object):

    def __init__(self):
        self.myDict = {}

    def AddEntry(self, name, number, *args, **kwargs):
        self.P[name] = number

    def GetEntry(self, name, *args, **kwargs):
        if name in self.myDict.keys():
            return self.myDict[name]
        return '000-000-0000'

pm = PhonebookManager()
pm.AddEntry('tomithy', '555-555-5555')
pm2 = PhonebookManager()
pm2.AddEntry('parse',363-000-000)
pm3 = PhonebookManager()
pm3.AddEntry('x',7878-000)

print(pm2.GetEntry('parse'))
print(pm2.GetEntry('tomithy'))

print PhonebookManager().myDict
