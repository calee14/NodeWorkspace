import React from 'react'
import { useState } from 'react'

const tasksDefault = [
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
]

// Use key tag for when mapping through a list and putting it in an html element
const Tasks = () => {
    const [tasks, setTasks] = useState(tasksDefault) // var in between useState is default
    return (
        <>
        {tasks.map((task) => (
            <h3 key={task.id}>{task.text}</h3>
        ))}
        </>
    )
}

export default Tasks