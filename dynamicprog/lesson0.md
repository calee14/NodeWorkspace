# Dynamic Programming
- easy to turn algo into code
    - difficult part is to visualize the algo and write it out
- fibonnaci problem
- need to draw out the problems
- __dynamic programming__ = recognizing recurring patterns in a problem
- even though the grid problem seemed much different than fibonacci, we used the same methods to memoize the recursive func.
    - think the recursive func as a tree

# Memoization Recipe
1. Make it work (with brute force)
    - visualize the problem as a tree
    - look at the nodes and find patterns
        - decrement 1 or 2
        - shrink the grid down or right 
    - implement the tree using recursion
    - test
2. Make it efficient (then speed it up with memoization)
    - add a memo object (should pass by __reference__)
        - must have keys that represent the keys for our arguments to the function
            - then the values of the keys should have the value of that funciton
    - add a base case to return memo values that are already stored 
    - store return values into the memo

# howSum notes
- brute force
    1. O(n^m * m) time
    2. O(m) space
- memoized:
    1. O(n*m^2) time (no longer exponential in run time)
    2. O(m^2) space (not exponential but polynomial)

# Tabulation
- tabluation is all about building a table to store values
- fib(6) -> 8
    - O(n) time
    - O(n) space
- logic is the same from memoization

# Tabulation Recipe
1. must visualize the problem as a table when trying to solve
2. the size of the table is correlated with the inputs
3. init the table with normal val
    - choose a data type that's related to the answer or thing you're returning
4. seed the trivial answer into the table
    - find a base case or answer that you already know to be always true
5. iterate through the table
6. fill adjacent or further positions based on the current position and algo

# Dynamic Programming
- notice any overlapping subproblems
- decide what is the trivially smallest input
- think recursively for Memoization
- think iteratively to use Tabulation
- draw the stuff out