'use client'

// import { NextPage } from 'next'
import React,{ useState,useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useRouter } from "next/navigation";

import {socket} from "../../../socket"



export default function ChatRoom() {
    const router = useRouter()

    const searchParams = useSearchParams();
    const [Message,SetMessage] = useState('')
    const username = searchParams.get("nomUser")
   
    // const [currentUsername,SetcurrentUsername] = useState('')
    
        // Pour le web socket 
         useEffect(() => {
           
            // Affichage des users en ligne 
            socket.on('onlineUsers',(connectedUsers,oldConnectedUsers)=>{
                console.log(`Users connectés : ${connectedUsers}`)
            
                const br = document.createElement("br");
                const listeUser= document.getElementById("ConnectedUsers")
                // Supprime tout les noms users dans la liste pour éviter la répétition
                if(listeUser){
                    listeUser.innerHTML=""
                }

                for (const u of connectedUsers){
                        // console.log(`User ${count} added: ${u}`)
                        const connectedUsername = document.createElement("li")
                        connectedUsername.id =u 
                        const connectedUser = document.createTextNode(u)
                        connectedUsername.appendChild(connectedUser)
                        listeUser?.appendChild(connectedUsername)
                       
                }
                
            })

            // Affichage des room disponibles
            socket.on('rooms',(rooms)=>{
            
                const br = document.createElement("br");
                const listeRooms= document.getElementById("Rooms")
           
                if (listeRooms){
                    listeRooms.innerHTML=""
                }

                for (const u of rooms){
                        const roomId=u.id
                        console.log(roomId)

                        const room = document.createElement("li")
                        room.id =roomId 

                        const roomLink = document.createElement("a")
                        roomLink.href="room/"+roomId

                        const roomName = document.createTextNode(u.name)

                        roomLink.appendChild(roomName)
                        room.appendChild(roomLink)
                        listeRooms?.appendChild(room)
                       
                }
                
            })


            socket.on('message', (msg,senderUsername) => {
                // Pour tester si le message est envoyé vers le serveur socket
                console.log("Message sent by ", senderUsername,":", msg);

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
                const messagerie = document.getElementById("Messagerie");
                message.appendChild(nom_user_box);
                message.appendChild(message_box);
                message.appendChild(br);
            
                messagerie?.appendChild(message);
        });


        // Partie historique 
         socket.on('historique', (historique) => {

                const br = document.createElement("br");
                const messagerie = document.getElementById("Messagerie");
                    if ( messagerie){
                        messagerie.innerHTML=""
                    }
                    
                for (const m of historique){
                
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
        });
        
        return () => {
            // pour éviter les fuites de données et éviter de répéter une action deux fois ou plus (ajouter de le nom d'un user connecté)
            socket.off('message');
            socket.off('username');
            socket.off('historique');
        };
        }, []);
    
        const sendMessage =()=>{
            // Crée un broadcast pour envoyer le message à tout les users connectés
            socket.emit('message',Message,username)
            SetMessage("")
    }
    
        return (
            <>
            <div className='grid grid-cols-4 grid-rows-[500px_100px] gap-4 bg-linear-to-r from-cyan-900 to-blue-900 p-3 '>
               
               {/* Partie Chat Box */}
               <p className="col-start-2 col-end-4 row-start-1 row-end-2 flex flex-col items-center">Nom Salon</p>
               
               {/* Il faut rendre la box du chat responsive pour éviter le défilement horizontal */}
                <div className="  col-start-2 col-end-4 row-start-1 row-end-2 flex flex-col items-center bg-cover overflow-y-auto scrollbar-hide ">
                   <br/> 
                    <ul className="list-none  border-amber-100 rounded-4xl border-2 w-md size-lvw p-3  bg-blue-300" id="Messagerie">
                
                    </ul>  
                </div>

                {/* Partie rooms */}
                <div className="  col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col items-start bg-auto overflow-y-auto scrollbar-hide ">
                   <br/> 
                    <ul className="list-none  border-amber-100  border-2 w-auto size-auto p-3  bg-blue-300" id="Rooms">
                        Aucune salle pour le moment
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