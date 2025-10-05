'use client'

// import { NextPage } from 'next'
import React,{ createContext, useState,useEffect, useContext } from "react";
import { useRouter } from 'next/navigation'

import { useSearchParams,usePathname } from "next/navigation";

import {socket} from "../../../socket"


import { IUser } from '@/app/model/user';
import { IRoom } from '@/app/model/room';


  

//-------------------------------------------------------------------------------------------------------------------------------------------
  
    // Creation de contexte pour l'affichage des rooms 
    const RoomContext = createContext({
        roomsSwitch: false,
        roomsDisplaySwitch: () => {},
    });
    // Creation de provider 
    export const RoomProvider = ({children}: { children: React.ReactNode }) =>{

        const router = useRouter();

        const searchParams = useSearchParams();

        const [warningMsg, setWarningMsg] = useState('');

        const[rooms, setRooms] = useState<IRoom[]>([]);

        const [roomsSwitch, setRoomsSwitch] = useState(false);

        //    ------------------------------------------------------------------------------------------------------------------------------------------
        // Affichage des rooms
        async function FetchRooms() {
        try{
            // La liste des rooms
            const roomResponse = await fetch("/api/rooms")
            const roomData =  await roomResponse.json();
            
            const allRooms = roomData.map((room: IRoom) => ({ id: room._id, name: room.name }));

            setRooms(allRooms); 

            if(rooms.length===0 || rooms==undefined || !rooms){
                setWarningMsg("Aucune room disponible pour le moment")
            }

            if (!roomResponse.ok) {
                console.error("Failed to fetch rooms:", roomResponse.statusText);
                setWarningMsg("Erreur lors de la récupération des rooms")
                return;
            }


        }catch (error) {
                    console.error("Error displaying rooms:", error);
        } finally {
            setRoomsSwitch(false)
        }
    }
        //------------------------------------------------------------------------------------------------------------------------------------------

        const roomsDisplaySwitch = () =>{
            setRoomsSwitch(!roomsSwitch)
            console.log("RoomsSwitch :",roomsSwitch)
        }
        useEffect(() => {
            FetchRooms()
            
        }, []); 

        return(
            
            <RoomContext.Provider value={{roomsSwitch,roomsDisplaySwitch}}>
            <>
            {children}
            {/* {console.log(`Children :`, children)} */}
                {/* Affiche un arrière-plan noir et transparant */}
                {roomsSwitch && (
                <div className="fixed inset-0 bg-black/40 z-97"></div>
                )}


                <div className={`absolute top-1/3 left-4/10 ${roomsSwitch?"" : "hidden"} z-99 flex flex-col items-center gap-y-5  bg-emerald-700 p-3 rounded-2xl text-nowrap text-center`}>
                        <h1>Rooms</h1>

                    <ul className="list-none  w-auto size-auto p-3  rounded-2xl ">
                       {rooms.length === 0 ? (
                        <p>Aucune room disponible pour le moment</p>
                       ) : (
                        rooms.map((room) => (
                            <li key={room.id} className="mb-2 p-2 rounded-lg shadow-md hover:bg-emerald-800">
                                <div className="flex justify-between items-center ">
                                    <span className="font-medium">{room.name}</span>
                                    <button
                                        onClick={() => {
                                            router.push(`/room/${room.id}?username=${searchParams.get("username")}`);
                                            setRoomsSwitch(false);
                                        }}
                                        className="joinRoomButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full cursor-pointer"
                                    >Join</button>
                                </div>
                            </li>
                        ))
                       )}
                       <p className= {`text-red-500 w-fit ${ warningMsg === ""? "hidden" : "py-5" } `}  id="warning">{warningMsg}</p> 
                    </ul>

                    <button onClick={()=>setRoomsSwitch(false)} type="button" className="bg-red-300 hover:bg-red-400 text-black border-solid w-fit rounded-3xl p-2 cursor-pointer">Back</button>
                

                </div>
            </>
            </RoomContext.Provider>
        )
    }

    export const useRooms = () => useContext(RoomContext);

    export default RoomProvider;