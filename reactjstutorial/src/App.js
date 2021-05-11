import React, { useState } from 'react'

function App() {
  // Can call on functions as if it was an HTML element to run function and render the html
  // Can also pass parameters in the form of an JSON object.
  // To set parameter with value must use {} if not string
  return <div>
    <Folder name="Desktop" isOpen={true}>
      <Folder name="Music">
        <File name="all_star.mp4"/>
        <File name="express_file.mp4"/>
      </Folder>
      <File name="dogs.jpeg"/>
      <File name="cats.jpeg"/>
    </Folder>
    <Folder name="Applications"></Folder>

    
    </div>;
}

// Use functions to return html to be rendered.
const Folder = (props) => {
  // array unpacking: similar to object unpacking but replaces indexes with variables. if no var for index then ignored
  // useState is also a hook which will trigger a re-render whenever the callback is called
  const [ isOpen, setIsOpen ] = useState(true); // setIsOpen is a callback for useState that will affect the isOpen var
  // object unpacking: this will pluck out variables and properties in json object
  const { name, children} = props; // children will include html and react objects
  const direction = isOpen ? 'down' : 'right'

  console.log(props);
  const borderStyle = { border : "2px solid pink" };

  const handleClick = () => {
    setIsOpen(!isOpen);
  }
  // Must use className if want to edit class of html element
  // If string interopolation then must use {} and `` for the string then add $ infront of {}
  return <div>
    <span onClick={handleClick}><i className="blue folder icon"></i><i className={`caret ${direction} icon`}></i>{name}</span>
    <div style={{marginLeft: '17px'}}>
      {isOpen ? children : null}
    </div>
  </div> // Can render props.children; Can also apply style in the form of an object
}

const File = (props) => {
  const { name } = props;
  const fileExtension = name.split('.')[1];
  const fileIcons = {
    mp4: 'headphones',
    jpeg: 'file image',
    png: 'file image outline',
  }
  return <div>
    <i className={`${fileIcons[fileExtension]} icon`}></i>
    {name}
    </div>
}
export default App;
