print("🌟Palindrome Checker🌟\n")

wordToCheck = input("Input a word > ").strip().lower()

def palindrome(word):
  if len(word) <= 2 and word[0] == word[-1]:
    return True
  if word[0] == word[-1]:
    word = word[1:-1]
    return palindrome(word)
  else:
    return False

if palindrome(wordToCheck):
  print(f"\n\033[92m{wordToCheck.title()} is a palindrome!")
else:
  print(f"\n\033[31m{wordToCheck.title()} is not a palindrome!")