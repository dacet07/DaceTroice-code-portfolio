import os, time

toDoList = []

file = open("todo.txt", "r")
fileContents = file.read()
if fileContents.strip():
  toDoList = eval(fileContents)
file.close()

yellowText = "\033[93m"
greenText = "\033[92m"
defaultText = "\033[0m"
redText = "\033[31m"

def addToDo():
  task = input("\nTask: ").strip().capitalize()
  date = input("When is it due by: ")
  priority = int(input("Priority(1/2/3): "))
  item = {"task": task, "date": date, "priority": priority}
  toDoList.append(item)
 
def viewToDo():
   
  print(f"""\n{yellowText}View by priority:
  1. Hight
  2. Medium
  3. Low
  4. All""")
  viewPriority = int(input(f"{yellowText}Select an option (1/2/3/4): {defaultText}"))
  if viewPriority == 4:
    print(
      f"\n{greenText}   | {'Task': <30} | {'Due date': <15} | {'Priority': <10} |{defaultText}"
    )
    n = 1
    for item in toDoList:
      print()
      print(f"{n}.", end=" | ")
      n += 1
      for key, value in item.items():
         if key == 'task':
            print(f"{value: <30}", end=" | ") 
         elif key == 'date':
            print(f"{value: <15}", end=" | ")
         elif key == 'priority':
            if value == 1:
              priority = "High"
            elif value == 2:
              priority = "Medium"
            elif value == 3:
              priority = "Low"

            print(f"{priority: <10}", end=" | ")
    print()

  elif viewPriority == 1 or viewPriority == 2 or viewPriority == 3:
    print(
      f"\n{greenText}   | {'Task': <30} | {'Due date': <15} | {'Priority': <10} |{defaultText}"
    )
    for item in toDoList:
      if item['priority'] == viewPriority:
        print()
        for key, value in item.items():
           if key == 'task':
              print(f"{value: <30}", end=" | ") 
           elif key == 'date':
              print(f"{value: <15}", end=" | ")
           elif key == 'priority':
              if value == 1:
                  priority = "High"
              elif value == 2:
                  priority = "Medium"
              elif value == 3:
                  priority = "Low"

              print(f"{priority: <10}", end=" | ")
    print()
  else:
    print(f"{redText}Invalid option!{defaultText}")

  time.sleep(10)


def editToDo():
  
  taskNumber = int(input("Enter number of task you want to edit: "))
  taskNumber -= 1
  if taskNumber < 0 or taskNumber >= len(toDoList):
    print("Couldn't find that")
    time.sleep(1)
    return
  else:
    print("Task you want edit:")
    print(
      f"{toDoList[taskNumber]['task']}, date: {toDoList[taskNumber]['date']}, priority: {toDoList[taskNumber]['priority']} "
    )
    print(
      "Write edited task, date, or priority if you want to change the item.")
    newTask = input("Task: ")
    newDate = input("Date: ")
    newPriority = input("Priority: ")
    if newTask != "":
      toDoList[taskNumber]['task'] = newTask
    if newDate != "":
      toDoList[taskNumber]['date'] = newDate
    if newPriority != "":
      toDoList[taskNumber]['priority'] = newPriority
  

def remoweToDo():
  
  taskNumber = int(input("Enter number of task you want to remowe: "))
  taskNumber -= 1
  if taskNumber < 0 or taskNumber >= len(toDoList):
    print("Couldn't find that")
    time.sleep(1)
    return
  else:
    print(
      f"{toDoList[taskNumber]['task']}, date: {toDoList[taskNumber]['date']}, priority: {toDoList[taskNumber]['priority']} "
    )
    affirm = input("Do you want remowe this? (y/n) ").lower()
    if affirm == "y":
      toDoList.remove(toDoList[taskNumber])
      print("Item remowed!")
      time.sleep(1)
  

def eraseAll():
  global toDoList
  affirm = input(f"\n{redText}Do you want erase all list? (y/n){defaultText} ").lower()
  if affirm == "y":
    toDoList = []
    
    print("List is empty!")
    time.sleep(1)


while True:
  os.system("clear")
  print()
  print("=== To Do List === \n")
  print(f"""{yellowText}Menu:
  1. Add
  2. View
  3. Edit
  4. Remowe
  5. Erase all
  6. Exit""")
  action = int(
    input(f"\n{yellowText}Select an option (1/2/3/4/5/6): {defaultText}"))
  if action == 1:
    addToDo()
  elif action == 2:
    if len(toDoList) == 0:
      print(f"{redText}Your list is empty!{defaultText}")
      time.sleep(1)
      continue
    else:
      viewToDo()
  elif action == 3:
    if len(toDoList) == 0:
      print(f"{redText}Your list is empty!{defaultText}")
      time.sleep(2)
      continue
    else:
      editToDo()
  elif action == 4:
    remoweToDo()
  elif action == 5:
    eraseAll()
  elif action == 6:
    print(f"\n{greenText}Bye!")
    break

  file = open("todo.txt", "w")
  file.write(str(toDoList))
  file.close()

exit()
