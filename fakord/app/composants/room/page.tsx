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
     const username = searchParams.get("nomUser")
   
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
                if(listeUser){
                    listeUser.innerHTML=""
                    for (const u of connectedUsers){
                        listeUser.innerHTML+="<li>"+u +" </li>"
                       
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
                        <a href='"+u.id+"?nomUser="+ username+"'> "+u.name+"</a> \
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
            <div className='grid grid-cols-4 grid-rows-[500px_100px] gap-4 bg-linear-to-r from-cyan-900 to-blue-900 p-3 '>
               
               {/* Partie Chat Box */}
               <div className="col-start-2 col-end-4 row-start-1 row-end-2 flex flex-col items-center " id="roomName">
                    <p className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-20 mb-1.5 animate-pulse"></p>
               </div>
               
               
               {/* Il faut rendre la box du chat responsive pour éviter le défilement horizontal */}
                <div className="  col-start-2 col-end-4 row-start-1 row-end-2 flex flex-col items-center bg-cover overflow-y-auto scrollbar-hide ">
                   <br/> 
                    <ul className="list-none  border-amber-100 rounded-4xl border-2 w-md size-lvw p-3  bg-blue-300" id="Messagerie">
                
                    </ul>  
                </div>

                {/* Partie rooms */}
                <div className="  col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col items-start bg-auto">
                   <br/> 
                    <ul className="list-none  border-amber-100  border-2 w-auto size-auto p-3  bg-blue-300" id="Rooms">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-20 mb-1.5 animate-pulse"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-30 mb-1.5 animate-pulse"></div>
                    </ul>  
                </div>

                
               
               {/* Partie users connectés */}
               <p className="col-start-4 col-end-5 row-start-1 row-end-2 flex flex-col items-center">Users Connectés</p>
               <div className="col-start-4 col-end-5 row-start-1 row-end-2 flex flex-col items-center bg-cover  ">
                   <br/> 
                    <ul className="list-none  border-amber-100 rounded-4xl border-2 w-auto size-auto p-3  bg-blue-300" id="ConnectedUsers">
                    Aucun User Connecté
                    </ul>  
                </div>
            
                {/* Partie saisie message */}
                <div className=" col-start-2 col-end-4 row-start-2 flex flex-row items-center justify-self-center self-start ">
                 {/* <p>Your username is : {searchParams.get("nomUser")}</p> */}
                    <input onChange={(e)=>{SetMessage(e.target.value)}
                       } className="bg-cyan-100 text-black p-1 rounded-2xl" name="Message" id="Message" placeholder="message..." value={Message}/>
                    <br/>
                    
                    <button onClick={sendMessage} className="bg-blue-300 hover:bg-blue-400 text-black border-solid rounded-3xl p-2" >Send</button>
                    
                </div>
                {/* <br/>
                 <button  type="button" onClick={()=> router.push("room/2")} className="bg-red-500 hover:bg-blue-400 text-black border-solid rounded-3xl p-2" >Go to link</button> */}

    
            </div>  
            </>
        )
    }