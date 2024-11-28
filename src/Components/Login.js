import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Input, Label } from 'reactstrap';
import axios from 'axios';
function Login({ handleUserUpdate }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ borderColor, setBorderColor ] = useState("black")

    const serverUrl = "http://localhost:3001"
    const handleLogin = () => {
        axios.post(`${serverUrl}/user/login`, {
            email: email,
            password: password
        }).then((response) => {
            if(response.data.message === "User can proceed"){
                handleUserUpdate({
                    email: email,
                    name: response.data.name
                });
                setBorderColor("green");
            }
            else{
                setBorderColor("red");
            }
        }).catch((err) => {
            setBorderColor("red");
            alert(err.message);
        });
    }
  return (
    <>
        <div className='row d-flex justify-content-center p-2'>
            <div className='col-12 col-md-3'>
                <Label>Email</Label>
            </div>
            <div className='col-12 col-md-9'>
                <Input style={{borderColor:`${borderColor}`}} placeholder='Enter your registered email id.' onChange={(e) => setEmail(e.target.value)} />
            </div>
        </div>
        <div className='row d-flex justify-content-center p-2'>
            <div className='col-12 col-md-3'>
                <Label>Password</Label>
            </div>
            <div className='col-12 col-md-9'>
                <Input style={{borderColor:`${borderColor}`}} placeholder='Enter the password associated with provided email.' onChange={(e) => setPassword(e.target.value)} />
            </div>
        </div>
        <div className='row d-flex justify-content-center p-2'>
            <div className='col-12'>
                <Button className='btn btn-success' onClick={handleLogin}>Login</Button>
            </div>
        </div>
    </>
  )
}

export default Login