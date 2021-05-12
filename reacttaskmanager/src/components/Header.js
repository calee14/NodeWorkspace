import React from 'react'
import PropTypes from 'prop-types'

const Header = ({ title }) => {
    return (
        <div>
            <h1>{title}</h1>
        </div>
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