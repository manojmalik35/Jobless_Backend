
import React from 'react';

const Input = (props) => {

    let handleChange = (e) =>{
        props.handleChange(e.target);
    }
    
    let placeholder = `Enter your ${props.type}`;
    return ( 
        <input name={props.type} type={props.type} placeholder={placeholder} value={props.value} onChange={handleChange}/>
     );
}
 
export default Input;