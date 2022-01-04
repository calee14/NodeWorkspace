/*
    grid(1,0) = 0 paths to reach opposite end
                thus when there's a missing dimension then
                it's impossible to reach the other end
    grid(3, 3) => grid(2, 3) shrink the grid
        until our grid traveler reaches a (1, 1) which is the
        base case
*/

const gridTraveler = (m, n) => {
    if (m === 1 && n === 1) return 1;
    if (m === 0 || n === 0) return 0;

    return gridTraveler(m-1, n) + gridTraveler(m, n-1);
}

console.log(gridTraveler(1, 1));
console.log(gridTraveler(2, 3));
console.log(gridTraveler(3, 2));
console.log(gridTraveler(3, 3));
console.log(gridTraveler(18, 18));

