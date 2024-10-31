import tkinter as tk

window = tk.Tk()
window.title("Calculator")
window.geometry("300x400")

label = 0


    

hello = tk.Label(window, text=label)
hello.grid(row=0, column=1)

#first button row
button1 = tk.Button(window, text="1")
button1.grid(row=2, column=0)

button2 = tk.Button(window, text="2")
button2.grid(row=2, column=1)

button3 = tk.Button(window, text="3")
button3.grid(row=2, column=2)

buttonPlus = tk.Button(window, text="+")
buttonPlus.grid(row=2, column=3)

buttonMinus = tk.Button(window, text="-")
buttonMinus.grid(row=2, column=4)

#second button row
button4 = tk.Button(window, text="4")
button4.grid(row=3, column=0)

button5 = tk.Button(window, text="5")
button5.grid(row=3, column=1)

button6 = tk.Button(window, text="6")
button6.grid(row=3, column=2)

buttonMultiply = tk.Button(window, text="*")
buttonMultiply.grid(row=3, column=3)

buttonDivide = tk.Button(window, text="/")
buttonDivide.grid(row=3, column=4)

#third button row
button7 = tk.Button(window, text="7")
button7.grid(row=4, column=0)

button8 = tk.Button(window, text="8")
button8.grid(row=4, column=1)

button9 = tk.Button(window, text="9")
button9.grid(row=4, column=2)

#fourth button row
button0 = tk.Button(window, text="0")
button0.grid(row=5, column=1)

buttonResult = tk.Button(window, text="=")
buttonResult.grid(row=5, column=3)

window.mainloop()