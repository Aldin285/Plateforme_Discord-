'use client'

// import { NextPage } from 'next'
import React,{ useState,useEffect } from "react";
import { useRouter } from 'next/navigation'

import { useSearchParams,usePathname } from "next/navigation";

import {socket} from "../../../socket"



export default function Rooms() {
    // POur avoir l'id du room
    let pathname = usePathname()
    let pathnameSplit = pathname.split("/")
    let pathnameId = pathnameSplit[pathnameSplit.length-1]

 
    const searchParams = useSearchParams();
    const [Message,SetMessage] = useState('')

    // const username = localStorage.getItem("username")
     const username = searchParams.get("username")
   
    // chat box
    

        // Pour le web socket 
         useEffect(() => {

            // Renvoie les données si une personne réintialise la page 
            socket.emit('enLigne')
           
            // Affichage des users en ligne 
            socket.on('onlineUsers',(connectedUsers,oldConnectedUsers)=>{
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

            // Affichage des room disponibles
            socket.on('rooms',(rooms)=>{
            
                const br = document.createElement("br");
                const listeRooms= document.getElementById("Rooms")
            
                if (listeRooms){
                    listeRooms.innerHTML=""
                        for (const u of rooms){
                        listeRooms.innerHTML+="<li id='"+u.id+" '> \
                        <a href='"+u.id+"?username="+ username+"'> "+u.name+"</a> \
                        </li> ";

                        if (pathnameId==u.id){
                            const roomName = document.getElementById("roomName")
                            if (roomName){
                                roomName.innerHTML="<p>"+u.name+"</p>"
                            }
                            
                        }
                        
                    }
                }
                
            })


            socket.on('messageRoom', (msg,senderUsername) => {
                console.log("Message reçu")
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


        // Partie historique 
         socket.on('historique', (historique) => {

            const messagerie = document.getElementById("Messagerie");    
                const br = document.createElement("br");
                    if ( messagerie){
                        messagerie.innerHTML=""
                        for (const m of historique){
                            // vérifie si on est dans le bon salon
                            if(m.roomId==pathnameId){
                                const message = document.createElement("div");
                                if ( m.expediteur==username){
                                    message.classList.add("end");
                                }
                                
                            
                                // Partie message
                                const message_box = document.createElement("li");
                                if ( m.expediteur==username){
                                    message_box.classList.add("myMessage");
                                }else{
                                    message_box.classList.add("othersMessage");
                                }
                            
                                const message_text = document.createTextNode(m.contenue);
                            
                                message_box.appendChild(message_text);
                                
                                // Partie user
                                const nom_user_box = document.createElement("div");
                                nom_user_box.innerHTML = `<p>${ m.expediteur}</p>`;
                                
                                // Partie messagerie
                                
                                message.appendChild(nom_user_box);
                                message.appendChild(message_box);
                                message.appendChild(br);
                            
                                messagerie?.appendChild(message);
                            }
                        }
                }
        });


        
        
        return () => {
            // pour éviter les fuites de données et éviter de répéter une action deux fois ou plus (ajouter de le nom d'un user connecté)
            socket.off('messageRoom');
            socket.off('username');
            socket.off('historique');
        };
        }, []);

    
        const sendMessage =()=>{
            // Crée un broadcast pour envoyer le message à tout les users connectés
            socket.emit('messageRoom',Message,username,pathnameId)
            SetMessage("")
    }
    
        return (
            <>
            <div className="flex flex-row justify-between items-start w-full p-3 gap-8">
               
               {/* Rooms list */}
                <div className="flex flex-col items-start min-w-[180px]">
                    <h2 className="font-bold mb-2">Rooms</h2>
                    <ul className="list-none  border-amber-100  border-2 w-auto size-auto p-3  rounded-2xl bg-blue-300" id="Rooms">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-20 mb-1.5 animate-pulse"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-30 mb-1.5 animate-pulse"></div>
                    </ul>  
                </div>

               
               {/* Il faut rendre la box du chat responsive pour éviter le défilement horizontal */}
               {/* Chat box */}

                {/* Current room title*/}
                <div className=" flex flex-col items-center flex-1 max-w-2xl">
                    <div id="roomName" className="mb-2">
                    <p className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-20 mb-1.5 animate-pulse"></p>
                    </div>

                    <ul className="list-none bg-blue-300 border-amber-100 rounded-4xl border-2 size-lvw p-3 w-full min-h-[300px] max-h-[500px] overflow-y-auto scrollbar-hide " id="Messagerie">
                    {/* Messages */}
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

    
            </div>  
            </>
        )
    }