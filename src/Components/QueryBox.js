import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Button, Input } from 'reactstrap';
import { AiOutlineSend } from "react-icons/ai";

function QueryBox({setUserPrompt}) {
    const [ query, setQuery ] = useState("");
  return (
    <div className='container'>
        <div className='row d-flex justify-content-center'>
            <div className='col-9 d-flex align-items-center'>
                <Input placeholder='Enter your query' value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className='col-3 d-flex align-items-center'>
                <Button style={{border:'0px'}} onClick={() => {
                        console.log(query);
                        
                        setUserPrompt(query);
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