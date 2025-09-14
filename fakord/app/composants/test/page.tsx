'use client'

// import { Schema, model, connect } from 'mongoose';

import { IUser } from '@/app/model/user';

import { IRoom } from '@/app/model/room';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';


export default function Test() {

  // Les rooms de la BDD
    const [rooms, setRooms]= useState<IRoom[]>([])

    // Les inputs
    const [roomName, setRoomName] = useState('');
    const [createdBy, setCreatedBy] = useState('');

    // Message d'erreur 
    const [warningMsg, setWarningMsg] = useState('');

    // Routage
    const router = useRouter();



     
    // async function identifyRoom(event: React.FormEvent<HTMLFormElement>) {
    //   event.preventDefault();

     
       
    //   }
    
    async function AddRoom(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      
      // La liste des rooms
       const roomResponse = await fetch("/api/rooms")
       const roomData =  await roomResponse.json();

      // La liste des users
        const userResponse = await fetch("/api/users")
        const userData =  await userResponse.json();

      // User actuel
        const currentUser = userData.find((user: IUser) => String(user.username) === createdBy);

      // Detecter si le nom de la room est déjà utilisé avant la création de la room
      const detectRoomName = roomData.find((room: IRoom) => room.name === roomName);

      if (detectRoomName) {
          setWarningMsg("Ce nom de room est déjà utilisé");
      }else if(!currentUser){
          setWarningMsg("Une erreur est survenue, veiller vous reconnecter");
      }else{
        setWarningMsg("");

       await fetch("/api/rooms",{
          method: "POST",
          body: JSON.stringify({ 
              name: roomName,
              createdBy: currentUser?._id,
              members:[currentUser?._id],
          }),
          headers: {'Content-Type': 'application/json'}
      });
      
      }
    }


    async function fetchRooms() {
       try {
      
        const response = await fetch("/api/rooms")
        const data =  await response.json();

        setRooms(data);

      } catch (error) {
        console.error("Error fetching users:", error);

      } finally {}
    }

    useEffect(()=>{

      fetchRooms();

    },[])

     return (<>

    <div>
        <h1 className="text-5xl">Test BDD</h1>
        <h1>{process.env.NEXT_PUBLIC_MONGODB_URI?process.env.NEXT_PUBLIC_MONGODB_URI:"Pas d'uri"}</h1>    
        <br/>
        <h1 className="text-5xl">La liste des Rooms</h1>
        {rooms.length>0 ? (
           <ul>
            
            {rooms.map((u)=>(
                <li key={String(u._id)} id={String(u._id)}>{u.name}</li>
            ))}
           </ul>
        ):
        <p>No current room</p>
        }

        <br/>

        <h1 className="text-5xl" >Création d'une Room </h1>
          <br/>
          <form onSubmit={AddRoom}  className='flex flex-col gap-4'>
          
            <input type='text' onChange={(e)=>{setCreatedBy(e.target.value.trim())}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-30 object-contain p-3 rounded-2xl" name="createdBy" id='email' placeholder='Creator' required/>
            <input type='text' onChange={(e)=>{setRoomName(e.target.value.trim())}} className="bg-cyan-100 text-black field-sizing-content min-w-30 w-fit object-contain p-3 rounded-2xl" name="roomName" id='password' placeholder='Room name' required/>
           
            <p className= {`text-red-500 w-fit ${ warningMsg === ""? "hidden" : "py-2" } `}  id="warning">{warningMsg}</p> 
            <button type="submit" className="bg-green-300 hover:bg-green-400 text-black border-solid w-fit rounded-3xl p-2">Create</button>
          </form>
      </div>

      </>)
}