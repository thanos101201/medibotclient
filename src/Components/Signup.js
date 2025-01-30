import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import axios from 'axios';
/// Renders the Signup component
function Signup({ handleUserUpdate }) {

    /// State variable to store the email provided by user.
    const [email, setEmail] = useState("");
    /// State variable to store the name provided by user.
    const [ name, setName ] = useState("");
    /// State variable to store the password provided by user.
    const [password, setPassword] = useState("");
    /// State variable to store the border color.
    const [ borderColor, setBorderColor ] = useState("black")
    
    const serverUrl = "https://demochatbotserver.vercel.app";
    // const serverUrl = "http://localhost:3001"
    
    
    /// Makes post request to the sever for performing
    /// sign up operation.
    const handleSignup = () => {
        axios.post(`${serverUrl}/user`, {
            email: email,
            password: password,
            name: name
        }).then((response) => {
            if(response.data.message === "User registered"){
                handleUserUpdate({
                    email: email,
                    name: name
                });
                /// Setting the border color of the input boxes to green if post operation succeeds.
                setBorderColor("green");
            }
            else{
                /// Setting the border color of the input boxes to red if post operation fails.
                setBorderColor("red");
            }
        }).catch((err) => {
            /// Setting the border color of the input boxes to red if post operation fails.
            setBorderColor("red");
            console.log(err.response.message);
            
            alert(err.message);
        });
    }

    useEffect(() => {}, [borderColor]);

  /// Rendering the form for signup operation.
  return (
    <Form>
        <FormGroup>
            <Label for="signEmail">Email</Label>
            <Input
                id='signEmail'
                type='email'
                value={email}
                placeholder='Enter your registered email id.'
                onChange={(e) => setEmail(e.target.value)}
                style={{borderColor: borderColor}}
            />
        </FormGroup>
        <FormGroup>
            <Label for="signName">Name</Label>
            <Input
                id='signName'
                type='text'
                value={name}
                placeholder='Enter your name'
                onChange={(e) => setName(e.target.value)}
                style={{borderColor: borderColor}}
            />
        </FormGroup>
        <FormGroup>
            <Label for="signPassword">Password</Label>
            <Input
                id='signPassword'
                type='password'
                value={password}
                placeholder='Enter yor password'
                onChange={(e) => setPassword(e.target.value)}
                style={{borderColor: borderColor}}
            />
        </FormGroup>
        <div className='text-center'>
            <Button className='btn btn-danger' onClick={handleSignup}>Sign up</Button>
        </div>
    </Form>
  )
}

export default Signup