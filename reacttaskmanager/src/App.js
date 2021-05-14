import Header from './components/Header'
import Tasks from './components/Tasks'
import { useState } from 'react'

function App() {
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

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id)); // Use filter method to remove tasks with id.
  }

  // Toggle Reminder
  const toggleReminder = (id) => {
    console.log(id);
  }

  return (
    <div className="container">
      <Header title='Task Tracker'/>
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'There are no tasks to show.'}
    </div>
  );
}

export default App;
