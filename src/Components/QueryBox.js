import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Button, Input } from 'reactstrap';
import { AiOutlineSend } from "react-icons/ai";
/// Renders the query box present at the bottom of the
/// chat interface. Takes input from the user.
function QueryBox({setUserPrompt}) {
    /// State variable to store the value of user query.
    const [ query, setQuery ] = useState("");
  /// Rendering the QueryBox component.
  return (
    <div className='container'>
        <div className='row d-flex justify-content-center'>
            <div className='col-9 d-flex align-items-center'>
                <Input placeholder='Enter your query' value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className='col-3 d-flex align-items-center'>
                <Button style={{border:'0px'}} onClick={() => {
                        console.log(query);
                        /// Setting the entered query to the prompt state variable
                        /// present at the App component.
                        setUserPrompt(query);
                        /// Reseting the value of query, for clearing the input box.
                        setQuery("");
                    }}>
                    <AiOutlineSend />
                </Button>
            </div>
        </div>
    </div>
  )
}

export default QueryBox