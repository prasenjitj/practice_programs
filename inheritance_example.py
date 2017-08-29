#!/usr/bin/env python

# V-- 1 --V
class Base_Character(object):
    # -- 2 --
    def printName(self):
        print (self.name)

##--------------------------------------------

class NonPlayable_Character(Base_Character):
    pass

class NPC_Friendly(NonPlayable_Character):
    pass

class NPC_Enemy(NonPlayable_Character):
    # -- 3 --
    def __init__(self):
        self.attackDamage = 5

##--------------------------------------------
# -- 4 --
class Weapon (object):
    def __init__(self,weapon_name):
        self.weapon_name = weapon_name
    def get_weapon(self):
        return self.weapon_name


class Playable_Character(Base_Character):
    # -- 5 --
    def __init__(self,weapon_name):
        self.weapon = Weapon(weapon_name)

class PC_Archer(Playable_Character):
    pass

class PC_GreenLantern(Playable_Character):
    pass

class PC_Butcher(Playable_Character):
    pass


## ======================================
if __name__ == '__main__':
    enemy = NPC_Enemy()
    print (enemy.attackDamage)
    butcher = PC_Butcher('SOWRD')
    print (butcher.weapon.get_weapon())
