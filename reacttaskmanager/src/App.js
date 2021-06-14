import Header from './components/Header'
import Tasks from './components/Tasks'
import { useState } from 'react'
import AddTask from './components/AddTask'

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([
    {
        id: 1,
        text: 'Doctors Appointment',
        day: 'Feb 5th at 2:30pm',
        reminder: true
    },
    {
        id: 2,
        text: 'Coach Appointment',
        day: 'Feb 8th at 2:30pm',
        reminder: true
    },
    {
        id: 3,
        text: 'Send Mission Bit Email',
        day: 'Feb 15th at 2:30pm',
        reminder: false
    },
  ]); // var in between useState is default

  // Add Task
  const addTask = (task) => {
    console.log(task)
    const id = Math.floor(Math.random() * 10000 + 1)
    console.log(id)
    const newTask = {id, ...task } // create a new temp var with the id at the beginning of the obj
    setTasks([...tasks, newTask]) // add the new task after the test of the old tasks
  }

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id)); // Use filter method to remove tasks with id.
  }

  // Toggle Reminder
  const toggleReminder = (id) => {
    setTasks(tasks.map((task) => 
      task.id === id ? {...task, reminder: // the ...task copies the task object except changes reminder
        !task.reminder } : task));
    
  }

  // The && will run the following code if the preceding ariable if true
  return (
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} title='Task Tracker'/>
      {showAddTask && <AddTask onAdd={addTask}/>}
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'There are no tasks to show.'}
    </div>
  );
}

export default App;
