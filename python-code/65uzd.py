class character:
  name = None
  health = 100
  magicPoints = 20

  def __init__(self, name):
    self.name = name
    
  def print(self):
    print(f"\nName: {self.name}")
    print(f"Health: {self.health}")
    print(f"Magic Points: {self.magicPoints}")

class player(character):
  nickname = None
  lives = 5

  def __init__(self, nickname):
    self.name = "Player"
    self.nickname = nickname
    
  def isAlive(self):
    return self.lives > 0

  def print(self):   
    super().print()
    print(f"Nickname: {self.nickname}")
    print(f"Lives: {self.lives}")
    if self.isAlive:
      print("Alive?: Yes")
    else:
      print("Alive?: No") 
    
class enemy(character):
  type = None
  strength = None

  def __init__(self, name, type, strength):
    self.name = name
    self.type = type
    self.type = strength

  def print(self):
    super().print()
    print(f"Type: {self.type}")
    print(f"Strength: {self.strength}")

class orc(enemy):
  speed = None

  def __init__(self, name, speed):
    self.name = name
    self.type = "Orc"
    self.strength = 50
    self.speed = speed

  def print(self):
    super().print()
    print(f"Speed: {self.speed}")

class vampire(enemy):
  day = None

  def __init__(self, name, day):
    self.name = name
    self.type = "Vampire"
    self.strength = 100
    self.day = day

  def print(self):
    super().print()
    if self.day:
      print("Day/Night?: Day")
    else:
      print("Day/Night?: Night")

    
currentPlayer = player("Spiderman")
vampireOne = vampire("Olaf", False)
vampireTwo = vampire("Casper", True)
orcOne = orc("Monster", 200)
orcTwo = orc("Baby", 100)
orcThree = orc("Gorgon", 35)

currentPlayer.print()
vampireOne.print()
vampireTwo.print()
orcOne.print()
orcTwo.print()
orcThree.print()
