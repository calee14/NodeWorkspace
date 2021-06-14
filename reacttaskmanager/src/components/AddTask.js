import React from 'react'
import { useState } from 'react'

const AddTask = ({ onAdd }) => {
    const [text, setText] = useState('') // create vars with states for the forms
    const [day, setDay] = useState('')
    const [reminder, setReminder] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault()

        if(!text) {
            alert('Please add a task')
            return
        }

        onAdd({ text, day, reminder }) // pass in the parameters for the func obj passed as a param

        setText('') // clear the form var
        setDay('')
        setReminder(false)
    }
    return (
        <>
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>Task</label>
                <input type='text' placeholder='Add Task' value={text} onChange={(e)=>setText(e.target.value)}/>
            </div>
            <div className='form-control'>
                <label>Day & Time</label>
                <input type='text' placeholder='Add Day and Time' value={day} onChange={(e)=>setDay(e.target.value)}/>
            </div>
            <div className='form-control form-control-check'>
                <label>Set Reminder</label>
                <input type='checkbox' checked={reminder} value={reminder} onChange={(e)=>setReminder(e.currentTarget.checked)}/>
            </div>
            <input className='btn btn-block' type='submit' value='Save'/>
        </form>
        </>
    )
}

export default AddTask