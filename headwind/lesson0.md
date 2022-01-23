# tailwindcss
- use `rem` for padding utilities
    - rem = 16pixels
    - rem is a standard unit so the values are uniform or proportional more easily
    - it also helps keep all values connected to each other. so one change will affect the other 
- tailwindcss uses the JIT compiler
```html
<!-- responsive design for different screen sizes -->
<h1 class="sm: bg-yellow-400"></h1>
<!-- have color gradients  -->
<h1 class="bg-gradient-tor from-cyan-600 via-cyan-200 to cyan-900"></h1>
<h1 class="bg-cyan-900 hover: text-gray-200"></h1>
<!-- typography so fonts and sizes -->
<h1 class="text-4xl font-extrabold">hello there</h1>
<!-- add hover effect  -->
<h1 class="bg-cyan-900 hover: text-gray-200">the quick brown fox jumped over the lazy dog</h1>
<!-- creates a large shadow -->
<button class=""mt-12 px-3 py-2 bg-indigo-500 text-white rounded-md shadow-lg></button>
<!-- set css styles yourself  -->
<button class=""mt-12 px-3 py-2 [background:black] text-white rounded-md shadow-lg></button>
```
