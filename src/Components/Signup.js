import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Input, Label } from 'reactstrap';
import axios from 'axios';

function Signup({ handleUserUpdate }) {

    const [email, setEmail] = useState("");
    const [ name, setName ] = useState("");
    const [password, setPassword] = useState("");
    const [ borderColor, setBorderColor ] = useState("black")

    const serverUrl = "http://localhost:3001"
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
                setBorderColor("green");
            }
            else{
                setBorderColor("red");
            }
        }).catch((err) => {
            setBorderColor("red");
            console.log(err.response.message);
            
            alert(err.message);
        });
    }

    useEffect(() => {}, [borderColor]);

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
                <Label>Name</Label>
            </div>
            <div className='col-12 col-md-9'>
                <Input style={{borderColor:`${borderColor}`}} placeholder='Enter your name.' onChange={(e) => setName(e.target.value)} />
            </div>
        </div>
        <div className='row d-flex justify-content-center p-2'>
            <div className='col-12 col-md-3'>
                <Label>Password</Label>
            </div>
            <div className='col-12 col-md-9'>
                <Input type='password' style={{borderColor:`${borderColor}`}} placeholder='Enter the password associated with provided email.' onChange={(e) => setPassword(e.target.value)} />
            </div>
        </div>
        <div className='row d-flex justify-content-center p-2'>
            <div className='col-12'>
                <Button className='btn btn-danger' onClick={handleSignup}>Sign up</Button>
            </div>
        </div>
    </>
  )
}

export default Signup