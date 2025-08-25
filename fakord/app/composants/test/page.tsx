'use client'

// import { Schema, model, connect } from 'mongoose';

import { IUser } from '@/app/model/user';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';


export default function Test() {

  // Les users de la BDD
    const [users, setUsers]= useState<IUser[]>([])

    // Les inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    // Message d'erreur lors de la création d'un user
    const [warningMsg, setWarningMsg] = useState('');

    // Routage
    const router = useRouter();



     
    async function identifyUser(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const response = await fetch("/api/users")
      const data =  await response.json();

      // Detecter si l'email et le username sont déjà utilisés avant la création du user
      const detectEmail = await data.find((user: IUser) => user.email === email);
      const checkPassword =detectEmail && detectEmail.password === password;
      
      
      if (!detectEmail) {
          setWarningMsg("Adresse mail intouvable");
          

      }else if(!checkPassword){
          setWarningMsg("Mot de passe incorecte");
 
      }else{
        setWarningMsg("");

         const params = new URLSearchParams({
                username: detectEmail.username,
            }).toString();

        // Renvoi vers la page de chat avec les données du user
       
        router.push(`../../pages/room/1?${params}`);
       
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

        <h1 className="text-5xl" >Identification </h1>
          <br/>
          <form onSubmit={identifyUser} action="../../pages/room/1" className='flex flex-col gap-4'>
          
             <input type='email' onChange={(e)=>{setEmail(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-30 object-contain p-3 rounded-2xl" name="email" id='email' placeholder='Email...' required/>
              <input type='password' onChange={(e)=>{setPassword(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content min-w-30 w-fit object-contain p-3 rounded-2xl" name="password" id='password' placeholder='Password...' required/>
            
           
              <p className= {`text-red-500 w-fit ${ warningMsg === ""? "size-0" : "py-5" } `}  id="warning">{warningMsg}</p> 
              <button type="submit" className="bg-green-300 hover:bg-green-400 text-black border-solid w-fit rounded-3xl p-2">Se connecter</button>
          </form>
      </div>

      </>)
}