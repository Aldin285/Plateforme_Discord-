'use client'

// import { Schema, model, connect } from 'mongoose';

import { IUser } from '@/app/model/user';

import { useState, useEffect } from 'react';



export default function Test() {

  // Les users de la BDD
    const [users, setUsers]= useState<IUser[]>([])

    // Les inputs
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');

    // Liste des genres
    const genderList = ["Man", "Woman", "Attack Helicopter", "Chad", "Fish", "Alien" ,"Other"];

    // Date actuelle  
    const currentDate = new Date();
    const maxDate = currentDate.toISOString().split('T')[0];

    // Message d'erreur lors de la création d'un user
    const [warningMsg, setWarningMsg] = useState('');

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
        
        await fetch("/api/users",{
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

      // réintialise la liste des users
      fetchUsers();
      }
    }



    async function fetchUsers() {
       try {
      
        const response = await fetch("/api/users")
        const data =  await response.json();

        setUsers(data);

      } catch (error) {
        console.error("Error fetching users:", error);

      } finally {}
    }

    useEffect(()=>{

      const gender = document.getElementById("gender");
      if (gender) {
          for (const el of genderList) {
          gender.innerHTML += `<option value="${el}">${el}</option>`;
          }
      }

      fetchUsers();
    
    },[])

     return (<>

    <div>
        <h1 className="text-5xl">Test BDD</h1>
        <h1>{process.env.NEXT_PUBLIC_MONGODB_URI?process.env.NEXT_PUBLIC_MONGODB_URI:"Pas d'uri"}</h1>    
        <br/>
        <h1 className="text-5xl">La liste des Users</h1>
        {users.length>0 ? (
           <ul>
            
            {users.map((u)=>(
                <li key={String(u._id)} id={String(u._id)}>{u.firstname}</li>
            ))}
           </ul>
        ):
        <p>No current user</p>
        }

        <br/>

        <h1 className="text-5xl" >Ajouter un user </h1>
          <br/>
          <form onSubmit={AddUser} className='flex flex-col gap-4'>
          
              <input type='text' onChange={(e)=>{setFirstname(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-30 object-contain p-3 rounded-2xl" name="firstname" id='firstname' placeholder='Firstname...' required/>
              <input type='text' onChange={(e)=>{setLastname(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-30 object-contain p-3 rounded-2xl" name="lastname" id='lastname' placeholder='Lastname...' required/>
              <input type='date' min={"1925-01-01"} max={maxDate} onChange={(e)=>{setBirthday(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-30 object-contain p-3 rounded-2xl" name="birthday" id='birthday' placeholder='Birthday...' required/>
              <input type='email' onChange={(e)=>{setEmail(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-30 object-contain p-3 rounded-2xl" name="email" id='email' placeholder='Email...' required/>
              <input type='password' pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" onChange={(e)=>{setPassword(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content min-w-30 w-fit object-contain p-3 rounded-2xl" name="password" id='password' placeholder='Password...' required/>
              <input type='text' onChange={(e)=>{setUsername(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-30 object-contain p-3 rounded-2xl" name="username" id='username' placeholder='Username...' required/>
              <select className='bg-cyan-100 text-black field-sizing-content w-fit min-w-30 object-contain p-3 rounded-2xl'
                  onChange={(e)=>{setGender(e.target.value)}} id="gender" required >
                      <option value="" >None</option>
                    
                  </select>
           
              <p className= {`text-red-500 w-fit ${ warningMsg === ""? "size-0" : "py-5" } `}  id="warning">{warningMsg}</p> 
              <button type="submit" className="bg-green-300 hover:bg-green-400 text-black border-solid w-fit rounded-3xl p-2">Créer</button>
          </form>
      </div>

      </>)
}