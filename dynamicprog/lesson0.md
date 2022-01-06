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