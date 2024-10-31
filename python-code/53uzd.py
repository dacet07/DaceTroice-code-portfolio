import os, time
inventory = []

yellowText = "\033[93m"
greenText = "\033[92m"
defaultText = "\033[0m"

def addInventory():
  item = input("\nInput the item to add: > ").strip().capitalize()
  if item != "":
    inventory.append(item)
    print(f"{yellowText}{item} has been added to your inventory.{defaultText}")
    time.sleep(2)

def removeInventory():
  item = input("\nInput the item to remowe: > ").strip().capitalize()
  if item in inventory:
    while item in inventory:
      inventory.remove(item)
    print(f"{yellowText}{item} has been removed from your inventory.{defaultText}")
  else:
    print(f"Can't remove {item}!")
  time.sleep(2)

def viewInventory():
  item = input("\nInput the item to view: > ").strip().capitalize()
  count = inventory.count(item)
  print(f"{yellowText}You have {count} {item}.{defaultText}")
  time.sleep(6)

try:
  file = open("inventory.txt", "r")
  inventory = eval(file.read())
  file.close()
except:
  print("File not found!")
  time.sleep(2)
 
while True:
  os.system("clear")
  print(f"{greenText}RPG Inventory")
  print(f"=============\n{defaultText}")
  menu = input(f"{yellowText}1: Add\n2: Remowe\n3: View\n4: Exit\n> {defaultText}")
  if menu == "1":
    addInventory()
  elif menu == "2":
    removeInventory()
  elif menu == "3":
    viewInventory()
  elif menu == "4":
    break
  else:
    print("\nInput number 1/2/3/4")
    time.sleep(2)

try:
  file = open("inventory.txt", "w")
  file.write(str(inventory))
  file.close()
except:
  print("File can't be write!")
   
print("\nBye!")
exit()