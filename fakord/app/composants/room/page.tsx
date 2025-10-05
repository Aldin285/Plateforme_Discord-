'use client'

// import { NextPage } from 'next'
import React,{ createContext, useState,useEffect, useContext, useRef } from "react";
import { useRouter } from 'next/navigation'

import { useSearchParams,usePathname } from "next/navigation";

import {socket} from "../../../socket"


import { IUser } from '@/app/model/user';
import room, { IRoom } from '@/app/model/room';
import { IMessage } from '@/app/model/message';

import { set } from "mongoose";


export default function Rooms() {

    const router = useRouter();

    // Pour avoir l'id du room actuel
    let pathname = usePathname()
    let pathnameSplit = pathname.split("/")
    let currentRoomId = pathnameSplit[pathnameSplit.length-1]

 
    const searchParams = useSearchParams();
    const [Message,SetMessage] = useState('')

    // const username = localStorage.getItem("username")
     const username = searchParams.get("username")

    //  ------------------------------------------------------------------------------------------------------------------------------------------
    // Message d'erreur pour la création d'une room
     const [warningMsg, setWarningMsg] = useState('');

    //  const newRoom = document.getElementById("newRoom")
     const [newRoomDisplay,SetNewRoomDisplay] = useState(false)

    //  Sasie de nom room 
     const [newRoomName, SetNewRoomName] = useState('');

    // Liste des rooms du user
     const [userRooms,SetUserRooms] = useState<IRoom[]>([])
     const [loadingUserRooms,SetLoadingUserRooms] = useState(true)
     const [loadingUserRoomsMessage,SetLoadingUserRoomsMessage] = useState("Vous n'avez rejoint aucune room ")


    // Affichage de l'historique
    const [chatHistory,SetChatHistory] = useState<IMessage[]>([])
    const [loadingChatHistory,SetLoadingChatHistory] = useState(true)
    const [chatHistoryMessage,SetChatHistoryMessage] = useState("Vous avez saisi aucun message dans cette room ")
    // pour scroller automatiquement vers le bas
    const messagesEndRef = useRef<HTMLUListElement>(null);

    // Fonction affichage menu creation room
     function NewRoomDisplaySwitch(){
        SetNewRoomDisplay(!newRoomDisplay)   
    }


    // Fonction ajout room
    async function AddRoom(event: React.FormEvent<HTMLFormElement>) {
        try{
          event.preventDefault();
          
            // La liste des rooms
            const roomResponse = await fetch("/api/rooms")
            const roomData =  await roomResponse.json();

            // La liste des users
            const userResponse = await fetch("/api/users")
            const userData =  await userResponse.json();

            // Detection du user actuel
            const currentUser = userData.find((user: IUser) => String(user.username) === username);

            // Detecter si le nom de la room est déjà utilisé avant la création
            const detectRoomName = roomData.find((room: IRoom) => room.name === newRoomName);
    
          if (detectRoomName) {
              setWarningMsg("Ce nom de room est déjà utilisé");
          }else if(!currentUser || currentUser===undefined){
              setWarningMsg("Une erreur est survenue, veiller vous reconnecter");
          }else{
            setWarningMsg("");
    
           const postResponse = await fetch("/api/rooms",{
              method: "POST",
              body: JSON.stringify({ 
                  name: newRoomName,
                  createdBy: currentUser?._id,
                  members:[currentUser?._id],
              }),
              headers: {'Content-Type': 'application/json'}
          });


          if (!postResponse.ok) {
            const errorData = await postResponse.json();
            setWarningMsg(errorData.message || "Une erreur est survenue lors de la création de la room");
            return;
          }else{
        //   Attendre que la room soit créé pour pouvoir utiliser son ID
            const createdRoom = await postResponse.json();

            await fetch("/api/users", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: currentUser?._id,
                newRoomId: createdRoom._id,
                }),
            });

        }
          
          }
        }catch (error) {
                 console.error("Error creating room:", error);
        } finally {
            // Ferme le menu de création de room
            SetNewRoomDisplay(false)
            // Recharge la page pour afficher la nouvelle room
            window.location.reload();
        }
    }

     //    ------------------------------------------------------------------------------------------------------------------------------------------
        
        // Affichage des rooms du user
        async function fetchUserRooms() {
            try {
                // Récupérer la liste des rooms
                const roomResponse = await fetch("/api/rooms")
                const roomData =  await roomResponse.json();

                // Récupère la liste des rooms du user actuel
                const userResponse = await fetch("/api/users")
                const userData =  await userResponse.json();
                const curentUserRooms = userData.find((user: IUser) => String(user.username) === username)?.rooms;
                
                const userRooms = roomData.filter((room: IRoom) => curentUserRooms.includes(room._id));
                const rooms = userRooms.map((room: IRoom) => ({ id: room._id, name: room.name }));
                 
                SetUserRooms(rooms)

                if(!roomResponse.ok || !userResponse.ok) {
                    console.error("Failed to fetch rooms or users");
                    SetLoadingUserRoomsMessage("Erreur lors de l'affichage de vos rooms. Veiller vous reconnecter")
                    // Un délai pour faire un effet de chargement quand les données ne sont pas encore disponibles
                    setTimeout(() => {
                        SetLoadingUserRooms(false)
                     }, 1000);
                 
                    return;
                }else{
                    setTimeout(() => {
                        SetLoadingUserRooms(false)
                    }, 1000);
                }
            }catch (error) {
                 console.error("Error displaying current user's rooms:", error);

            } finally {}
    }
    //    ------------------------------------------------------------------------------------------------------------------------------------------    
        // Affichage de l'historique
        async function DisplayChatHistory() {
            try {
                
                // Récupère la liste des rooms du user actuel
                const userResponse = await fetch("/api/users")
                const userData =  await userResponse.json();


               // Récupérer la liste des rooms
                const roomResponse = await fetch("/api/rooms")
                const roomData =  await roomResponse.json();
                const roomMessages = roomData.find((room: IRoom) => room._id === currentRoomId)?.messages;
                
                const roomMessagesData = roomMessages.map((message: IMessage) =>({id: message._id, sender : String(message.sender), content : message.content} ))
              
                roomMessagesData.forEach((u: any) => {
                    const findUser = userData.find((user: IUser) => user._id === u.sender);
                    if(findUser){
                        u.sender = findUser.username
                    }else{
                        u.sender = "Deleted User"
                    }
                });
                SetChatHistory(roomMessagesData)

                if(!roomResponse.ok || !userResponse.ok) {
                    console.error("Failed to fetch rooms or users");
                    SetChatHistoryMessage("Erreur lors de l'affichage de l'historique des messages. Veiller vous reconnecter")
                    setTimeout(() => {
                        SetLoadingChatHistory(false)
                     }, 2000);
                     return
                }else{
                    setTimeout(() => {
                        SetLoadingChatHistory(false)
                     }, 2000);
                }
                
            }catch (error) {
                console.error("Error displaying current user's rooms:", error);
            } finally {}
    }
//    ------------------------------------------------------------------------------------------------------------------------------------------    
        // Envoie du message à la base de donnée
         async function SaveMessage() {
            try {
                // Récupère la liste des rooms du user actuel
                const userResponse = await fetch("/api/users")
                const userData =  await userResponse.json();
                const curentUser = userData.find((user: IUser) => String(user.username) === username);
                if(!curentUser || curentUser===undefined) return;

                await fetch("/api/messages", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sender: curentUser?._id,
                        content: Message,
                        roomId: currentRoomId,
                        }),
                 });

            }catch (error) {
                console.error("Error displaying current user's rooms:", error);
            } finally {}
        }

    //    ------------------------------------------------------------------------------------------------------------------------------------------    
        // Vérification du username et de l'ID de la room
        async function StatusCheck() {
            try {

                const userResponse = await fetch("/api/users")
                const userData =  await userResponse.json();
                const userCheck = userData.find((user: IUser) => String(user.username) === username);

                // Récupérer la liste des rooms
                const roomResponse = await fetch("/api/rooms")
                const roomData =  await roomResponse.json();
                const roomCheck = roomData.find((room: IRoom) => room._id === currentRoomId);

                if(!userCheck || userCheck===undefined || !roomCheck || roomCheck===undefined){
                    router.push("../../")
                }else {
                console.log("Status check passed");
                // Renvoie les données si une personne réintialise la page 
                socket.emit('enLigne',username,currentRoomId)
            }
            }
            catch (error) {
                console.error("Error displaying current user's rooms:", error);
            } finally {}
        }
    //    -------------------------------------------------------------------------------------------------------------------------------------------
        
        const sendMessage =()=>{
            // Crée un broadcast pour envoyer le message à tout les users connectés
            socket.emit('messageRoom',Message,username,currentRoomId)
            SetMessage("")
            // Message sauvegardé dans la BDD
            SaveMessage()
    }
     //    -------------------------------------------------------------------------------------------------------------------------------------------


        
        // Vérification du username et de l'ID de la room
         useEffect(() => {
            StatusCheck()
         },[])

        // Pour scroller automatiquement vers le bas quand on se connecte
        // Normalement ça redérige vers le bas à chaque nouveau message mais ça ne marche pas
         useEffect(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
            }
        }, [chatHistory]);

         useEffect(() => {

            // Affichage des rooms du user
            fetchUserRooms() 

            // Affichage des rooms du user
            DisplayChatHistory()
           
            // Affichage des users en ligne 
            socket.on('onlineUsers',(connectedUsers)=>{
                // console.log(`Users connectés : ${connectedUsers}`)
            
                const br = document.createElement("br");
                const listeUser= document.getElementById("ConnectedUsers")
                // Supprime tout les noms users dans la liste pour éviter la répétition
                if(connectedUsers.length!=0){
                    listeUser!.innerHTML=""
                    for (const u of connectedUsers){
                        listeUser!.innerHTML+="<li>"+u +" </li>"
                       
                }
                }

                
                
            })


            socket.on('messageRoom', (msg,senderUsername) => {
                // console.log("Message reçu")
                const messagerie = document.getElementById("Messagerie");
            
                const br = document.createElement("br");
            
                const message = document.createElement("div");
                if ( senderUsername==username){
                    message.classList.add("end");
                }
                
            
                // Partie message
                const message_box = document.createElement("li");
                if ( senderUsername==username){
                    message_box.classList.add("myMessage");
                }else{
                    message_box.classList.add("othersMessage");
                }
            
                const message_text = document.createTextNode(msg);
            
                message_box.appendChild(message_text);
                
                // Partie user
                const nom_user_box = document.createElement("div");
                nom_user_box.innerHTML = `<p>${senderUsername}</p>`;
                
                // Partie messagerie
                
                message.appendChild(nom_user_box);
                message.appendChild(message_box);
                message.appendChild(br);
            
                messagerie?.appendChild(message);
        });
        
        return () => {
            // pour éviter les fuites de données et éviter de répéter une action deux fois ou plus (ajouter de le nom d'un user connecté)
            socket.off('messageRoom');
            socket.off('username');
            socket.off('historique');
        };
        }, []);

        return (
            <>
            <div className="flex flex-row justify-between items-start w-full p-3 gap-8">
               
               {/* Rooms list */}
                <div className="flex flex-col items-start min-w-[180px]">
                    <h2 className="font-bold mb-2">Rooms</h2>
                    <ul className="list-none  border-amber-100  border-2 w-auto size-auto p-3  rounded-2xl bg-blue-300" id="Rooms">

                        {/*Quand les données ne sont pas encore chargées ou s'il y a eu une erreur*/}
                        {userRooms.length === 0 || !userRooms || userRooms==undefined ? (

                            // Effet de chargement
                            loadingUserRooms ?(
                                 <>
                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-20 mb-1.5 animate-pulse"></div>
                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-30 mb-1.5 animate-pulse"></div>
                                 </>
                                 
                            ) :
                            // Message qui change selon le cas
                                (<p>{loadingUserRoomsMessage}</p>)
                            
                        ) : (
                            // Affichage des rooms
                            userRooms.map((room) => (
                                <li key={room.id} id={room.id}>
                                    <a href={room.id + "?username=" + username}> {room.name}</a>
                                </li>
                            ))
                        )}

                    </ul>

                    <div className="pt-3"> 
                        <button onClick={NewRoomDisplaySwitch} className="border-t-2 border-t-amber-50 cursor-pointer ">+New room</button>
                    </div>
                </div>

               
               {/* Il faut rendre la box du chat responsive pour éviter le défilement horizontal */}
               {/* Chat box */}

                {/* Current room title*/}
                <div className=" flex flex-col items-center flex-1 max-w-2xl">
                    <div id="roomName" className="mb-2">
                        {loadingUserRooms ?(
                            <p className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-20 mb-1.5 animate-pulse"></p>
                        ) :(
                            <p>{userRooms.find((room) => room.id === currentRoomId)?.name || "Room inconnue"}</p>
                        )}
                 
                        </div>

                    {/* Chat history */}
                    <ul ref={messagesEndRef} className="list-none bg-blue-300 border-amber-100 rounded-4xl border-2 size-lvw p-3 w-full min-h-[300px] max-h-[500px] overflow-y-auto scrollbar-hide" id="Messagerie">
                        {!chatHistory || chatHistory===undefined || chatHistory.length===0 ? (
                        
                            loadingChatHistory ?(
                                <>
                                {/* Effet de chargement */}
                                <div className="pt-10 gap-y-3 flex flex-col justify-end">

                                   <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-20 mb-1.5 animate-pulse"></div>
                                   <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-30 mb-1.5 animate-pulse"></div>

                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-40 mb-1.5 animate-pulse end"></div>

                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-10 mb-1.5 animate-pulse"></div>

                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-15 mb-1.5 animate-pulse end"></div>
                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-8 mb-1.5 animate-pulse end"></div>


                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-30 mb-1.5 animate-pulse"></div>
                                   <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-20 mb-1.5 animate-pulse"></div>

                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-37 mb-1.5 animate-pulse end"></div>

                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-17 mb-1.5 animate-pulse"></div>

                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-21 mb-1.5 animate-pulse end"></div>
                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-7 mb-1.5 animate-pulse end"></div>

                                    
                                </div>
                                </>
                            ) :
                                // Message qui change selon le cas
                                (<p>{chatHistoryMessage}</p>)
                            ) : (
                                chatHistory.map((message) => (
                                <div key={message.id} className={ String(message.sender)===username ? "end" : "" }>
                                    
                                    <div>
                                        <p>{String(message.sender)}</p>
                                    </div>

                                    <div>
                                        <li className={ String(message.sender)===username ? "myMessage" : "othersMessage" }>{message.content}</li>
                                    </div>
                             
                                </div>
                             )
                            )
                        )}
                    </ul>  

                    {/* Message Input*/}
                    <div className="flex flex-row items-center justify-center w-full mt-4 gap-x-3">
                        <input onChange={(e)=>{SetMessage(e.target.value.trim())}}
                         className="bg-cyan-100 text-black p-3 rounded-2xl " name="Message" id="Message"
                          placeholder="message..." value={Message}/>
                        
                        <button onClick={sendMessage} className="bg-blue-300 hover:bg-blue-400 text-black border-solid rounded-3xl p-3" >
                            Send
                        </button>
                    </div>
                    
                </div>

                
               {/*Connected users */}
               <div className="flex flex-col items-center min-w-[180px]">

               <p className="font-bold mb-2">Users Connectés</p>
                    <ul className="list-none  border-amber-100 rounded-2xl border-2 p-3  bg-blue-300" id="ConnectedUsers">
                    Aucun User Connecté
                    </ul>  
                </div>
                {/* <br/>
                 <button  type="button" onClick={()=> router.push("room/2")} className="bg-red-500 hover:bg-blue-400 text-black border-solid rounded-3xl p-2" >Go to link</button> */}


                {/* Partie création room */}

                {/* Affiche un arrière-plan noir et transparant */}
                {newRoomDisplay && (
                <div className="fixed inset-0 bg-black/40 z-98"></div>
                )}

                <form onSubmit={AddRoom} className={` realative ${newRoomDisplay?"" : "hidden"} z-99`} id="newRoom">
                    <div className="absolute top-1/3 left-4/10 flex flex-col items-center gap-y-5  bg-emerald-700 p-3 rounded-2xl text-nowrap text-center">
                        <h1>New Room</h1>

                        <input type='text'  onChange={(e)=>{SetNewRoomName(e.target.value.trim())}} className="bg-cyan-100 text-black field-sizing-content min-w-30 w-fit object-contain p-3 rounded-2xl" name="roomName" id='password' placeholder='Room name' required/>
           
                        <p className= {`text-red-500 w-fit ${ warningMsg === ""? "hidden" : "py-5" } `}  id="warning">{warningMsg}</p> 

                        <div className="flex flex-row gap-x-3">
                            <button type="submit" className="bg-green-300 hover:bg-green-400 text-black border-solid w-fit rounded-3xl p-2 cursor-pointer">Create</button>
                            <button onClick={()=>SetNewRoomDisplay(false)} type="button" className="bg-red-300 hover:bg-red-400 text-black border-solid w-fit rounded-3xl p-2 cursor-pointer">Cancel</button>
                        </div>
                    </div>
                </form>

            </div>  
            </>
        )
    }