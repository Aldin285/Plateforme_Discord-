'use client'

// import { Schema, model, connect } from 'mongoose';

import { IUser } from '@/app/model/user';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';


export default function Register() {

    // Les inputs
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');

    // Liste des genres
    const genderList = ["Man", "Woman", "Attack Helicopter", "Chad", "Peak", "Fish", "Alien", "Other"];

    // Date actuelle  
    const currentDate = new Date();
    const maxDate = currentDate.toISOString().split('T')[0];

    // Message d'erreur lors de la création d'un user
    const [warningMsg, setWarningMsg] = useState('');

    // Routage
    const router = useRouter();

    async function AddUser(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const response = await fetch("/api/users")
      const data =  await response.json();

      // Detecter si l'email et le username sont déjà utilisés avant la création du user
      const detectEmail = data.find((user: IUser) => user.email === email);
      const detectUsername = data.find((user: IUser) => user.username === username);
      
      
      if (detectEmail) {
          setWarningMsg("Cette adresse mail est déjà utilisé");

      }else if(detectUsername){
          setWarningMsg("Ce Surnom est déjà utilisé");

      }else{
        setWarningMsg("");
        
        const newUser = await fetch("/api/users",{
          method: "POST",
          body: JSON.stringify({ 
              firstname: firstname,
              lastname: lastname,
              email: email,
              password: password,
              username: username,
              birthday: birthday,
              gender: gender
          }),
          headers: {'Content-Type': 'application/json'}
      });

       const params = new URLSearchParams({
                username,
            }).toString();

        // Renvoi vers la room General
        if (!newUser.ok) {
          const errorData = await newUser.json();
          setWarningMsg(errorData.message || "Une erreur est survenue lors de la création du compte");
          return;
        }else{
            router.push(`../../pages/room/${process.env.NEXT_PUBLIC_GENERAL_CHAT_ID}?${params}`);
        }}
    }

    useEffect(()=>{

      const gender = document.getElementById("gender");
      if (gender) {
          for (const el of genderList) {
          gender.innerHTML += `<option value="${el}">${el}</option>`;
          }
      }
    },[])

     return (<>

    <div className='flex items-center flex-col gap-4 py-10'>
        <div className='bg-[rgba(154,224,206,0.31)] bg-contain backdrop-blur-md rounded-[20px] px-4 p-5'>
        <h1 className='text-center pb-5'>New account</h1>
          <form onSubmit={AddUser} className='flex flex-col gap-4'>
          
              <input type='text' onChange={(e)=>{setFirstname(e.target.value.trim())}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-50 object-contain p-3 rounded-2xl" name="firstname" id='firstname' placeholder='Firstname...' required/>
              <input type='text' onChange={(e)=>{setLastname(e.target.value.trim())}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-50 object-contain p-3 rounded-2xl" name="lastname" id='lastname' placeholder='Lastname...' required/>
              <input type='date' min={"1925-01-01"} max={maxDate} onChange={(e)=>{setBirthday(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-50 object-contain p-3 rounded-2xl" name="birthday" id='birthday' placeholder='Birthday...' required/>
              <input type='email' onChange={(e)=>{setEmail(e.target.value.toLowerCase().trim())}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-50 object-contain p-3 rounded-2xl lowercase" name="email" id='email' placeholder='Email...' required/>
              <input type='password' pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" onChange={(e)=>{setPassword(e.target.value.trim())}} className="bg-cyan-100 text-black field-sizing-content min-w-50 w-fit object-contain p-3 rounded-2xl" name="password" id='password' placeholder='Password...' required/>
              <input type='text' onChange={(e)=>{setUsername(e.target.value.trim())}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-50 object-contain p-3 rounded-2xl" name="username" id='username' placeholder='Username...' required/>
              <select className='bg-cyan-100 text-black field-sizing-content w-fit min-w-50 object-contain p-3 rounded-2xl'
                  onChange={(e)=>{setGender(e.target.value)}} name='gender' id="gender" required >
                      <option value="" >None</option>
                    
                  </select>
           
              <p className= {`text-red-500 w-fit ${ warningMsg === ""? "size-0" : "py-5" } `}  id="warning">{warningMsg}</p> 
              
              <div className='text-center'>
              <button type="submit" className="bg-green-300 hover:bg-green-400 text-black border-solid w-fit rounded-3xl p-2">Créer</button>
              </div>

          </form>
          </div>
      </div>

      </>)
}