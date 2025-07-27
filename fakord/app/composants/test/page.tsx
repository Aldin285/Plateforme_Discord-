'use client'

// import { Schema, model, connect } from 'mongoose';

import { IUser } from '@/app/model/user';

import { useState, useEffect } from 'react';



export default function Test() {

    const [users, setUsers]= useState<IUser[]>([])

    useEffect(()=>{
        async function AddUser() {
      try {
        // Ajouter un user dans la BDD
        // const response = await fetch("/api/users",{
        //     method: "POST",
        //     body: JSON.stringify({ 
        //         firstname: 'Lorien',
        //         lastname: 'Testard',
        //         rooms: [1, 2, 3],
        //         info: {
        //             birthday: '2000-01-01T00:00:00.000Z',
        //             gender: 'male'
        //         }
        //     }),
        //     headers: {'Content-Type': 'application/json'}
        // });
        
        const response = await fetch("/api/users")
        const data = await response.json();
        console.log("The data: "+data)
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {}
    }

    AddUser();
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
    </div>

      </>)
}