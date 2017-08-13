class Hello(object):
    def __init__(self, name):
        self.name = name
    def sayHello(self):
        print "Hello %s !" % self.name

def main():
    h = Hello("prasenjit")
    h.sayHello()

if __name__ == main:
    main()
