import React from 'react'


// Use key tag for when mapping through a list and putting it in an html element
const Tasks = ({ tasks }) => { // destructure the props obeject with curly brackets
    
    return (
        <>
        {tasks.map((task) => (
            <h3 key={task.id}>{task.text}</h3>
        ))}
        </>
    )
}

export default Tasks