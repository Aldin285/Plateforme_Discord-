'use client'

// import { Schema, model, connect } from 'mongoose';

import { IUser } from '@/app/model/user';

import { useState, useEffect } from 'react';



export default function Test() {

    const [users, setUsers]= useState<IUser[]>([])

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');


    async function AddUser() {
        // Ajouter un user dans la BDD
        const response = await fetch("/api/users",{
            method: "POST",
            body: JSON.stringify({ 
                firstname: firstname,
                lastname: lastname,
                rooms: [],
                info: {
                    birthday: new Date(birthday),
                    gender: gender
                }
            }),
            headers: {'Content-Type': 'application/json'}
        });
    }



    async function fetchUsers() {
       try {
      
        const response = await fetch("/api/users")
        const data =  await response.json();

        console.log("The data: "+data)
        setUsers(data);

      } catch (error) {
        console.error("Error fetching users:", error);

      } finally {}
    }

    useEffect(()=>{
    
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
                <li key={u._id} id={u._id}>{u.firstname}</li>
            ))}
           </ul>
        ):
        <p>No current user</p>
        }

        <br/>

        <h1 className="text-5xl" >Ajouter un user </h1>
          <br/>
          <div className='flex flex-col gap-4'>
            <input type='text' onChange={(e)=>{setFirstname(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content w-fit object-contain p-3 rounded-2xl" name="firstname" placeholder='Firstname...'/>
            <input type='text' onChange={(e)=>{setLastname(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content w-fit object-contain p-3 rounded-2xl" name="lastname" placeholder='Lastname...'/>
            <input type='date' onChange={(e)=>{setBirthday(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content w-fit object-contain p-3 rounded-2xl" name="birthday" placeholder='Birthday...'/>
            <input type='text' onChange={(e)=>{setGender(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content w-fit object-contain p-3 rounded-2xl" name="gender" placeholder='Gender...'/>
          </div>
            <br/>
            <br/>
            <button onClick={AddUser} type="submit" className="bg-green-300 hover:bg-green-400 text-black border-solid rounded-3xl p-2">Créer</button>
    </div>

      </>)
}