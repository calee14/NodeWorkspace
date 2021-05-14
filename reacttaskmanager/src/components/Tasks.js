import React from 'react'
import Task from './Task'

// Use key tag for when mapping through a list and putting it in an html element
const Tasks = ({ tasks, onDelete, onToggle }) => { // destructure the props obeject with curly brackets
    
    return (
        <>
        {tasks.map((task) => (
            <Task key={task.id} task={task} onDelete={onDelete} onToggle={onToggle} />
        ))}
        </>
    )
}

export default Tasks