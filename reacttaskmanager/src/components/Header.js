import React from 'react'
import PropTypes from 'prop-types'
import Button from './Button'

const Header = ({ title, onAdd, showAdd }) => {
    // Can pass func as a prop to component
    const onClick = () => {
        console.log('click')
    }

    // For react use {} in html for dynamic styles
    return (
        <header className='header'>
            <h1>{title}</h1>
            <Button color={showAdd ? 'red' : 'green'} text={showAdd ? 'Close' : 'Add'} onClick={onAdd}/>
        </header>
    )
}

Header.defaultProps = {
    title: 'Task Tracker',
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
}

// CSS in JS is camel case for some
// const headerStyle = {
//     color: 'blue',
//     backgroundColor: 'white'
// }

export default Header