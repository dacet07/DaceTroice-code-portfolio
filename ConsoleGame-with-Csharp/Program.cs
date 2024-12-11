using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("The Number Guessing Game!");
        Console.WriteLine("Number between 1 and 100.");

        Random random = new Random();
        int number = random.Next(1, 101);
        int numberOfTries = 0;
        int playerGuess = 0;

        // Game loop
        while (playerGuess != number)
        {
            Console.ResetColor();
            Console.WriteLine("Enter your guess: ");
            string? playerInput = Console.ReadLine();

            if (string.IsNullOrEmpty(playerInput))
            {
                Console.WriteLine("Please enter a valid number.");
                continue;
            }

            // Validate input
            if (!int.TryParse(playerInput, out playerGuess))
            {
                Console.WriteLine("Please enter a valid number.");
                continue;
            }

            numberOfTries++;

            if (playerGuess < number)
            {
                Console.ForegroundColor = ConsoleColor.Blue;
                Console.WriteLine("Too low!");
            }
            else if (playerGuess > number)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("Too high!");
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"Congratulations! You've guessed the number in {numberOfTries} tries.");
                Console.ResetColor();
            }
        }
    }
}
