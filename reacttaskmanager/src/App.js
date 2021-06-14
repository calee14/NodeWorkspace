import Header from './components/Header'
import Tasks from './components/Tasks'
import { useState, useEffect } from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([]); // var in between useState is default

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    
    getTasks()
  }, []) // <- the [] will contain dependencies which will call the useEffect func if the dependency variables change

  // Fetch Tasks
  // make an async func because useeffect won't change type to async
  const fetchTasks = async() => {
    // make a fetch to server
    // await is used for Promise func methods 
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data;
  }

  // Fetch One Task
  const fetchTask = async(id) => {
    // make a fetch to server
    // await is used for Promise func methods 
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data;
  }

  // Add Task
  const addTask = async (task) => {
    // console.log(task)
    // const id = Math.floor(Math.random() * 10000 + 1)
    // console.log(id)
    // const newTask = {id, ...task } // create a new temp var with the id at the beginning of the obj
    // setTasks([...tasks, newTask]) // add the new task after the test of the old tasks

    // adds data first to db then fetches it
    console.log(task)
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task) // note that the server automatically indexes the data with an id
    })

    const data = await res.json() // must await because res is a Promise method 
    console.log(data)
    setTasks([...tasks, data])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter((task) => task.id !== id)); // Use filter method to remove tasks with id.
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id) // gather the task that we want to toggle by fetching
    const updTask = {...taskToToggle, reminder: !taskToToggle.reminder} // update the task by copying down every prop except change reminder
    
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)

    })

    const data = await res.json()

    setTasks(tasks.map((task) => 
      task.id === id ? {...task, reminder: // the ...task copies the task object except changes reminder
        data.reminder } : task));
    
  }

  // The && will run the following code if the preceding ariable if true
  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} title='Task Tracker'/>
        
        <Route path='/' exact render={(props) => (
          <>
            {showAddTask && <AddTask onAdd={addTask}/>}
            {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'There are no tasks to show.'}
          </>
        )} />
        <Route path='/about' component={About}/>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
