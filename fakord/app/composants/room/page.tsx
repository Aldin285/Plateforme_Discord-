'use client'

// import { NextPage } from 'next'
import React,{ useState,useEffect } from "react";
import { useRouter } from 'next/navigation'

import { useSearchParams,usePathname } from "next/navigation";

import {socket} from "../../../socket"


import { IUser } from '@/app/model/user';
import { IRoom } from '@/app/model/room';



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

                // Afficher des rooms 
                const listeRooms= document.getElementById("Rooms")

                if(!curentUserRooms || curentUserRooms===undefined || curentUserRooms.length===0){
                    listeRooms!.innerHTML="Vous avez rojoint aucune room"
                }else if(curentUserRooms && curentUserRooms.length>0){
                    const userRooms = roomData.filter((room: IRoom) => curentUserRooms.includes(room._id));
                    const rooms = userRooms.map((room: IRoom) => ({ id: room._id, name: room.name }));

                    listeRooms!.innerHTML=""
                        for (const u of rooms){
                        listeRooms!.innerHTML+="<li id='"+u.id+" '> \
                        <a href='"+u.id+"?username="+ username+"'> "+u.name+"</a> \
                        </li> ";

                        if (currentRoomId==u.id){
                            const roomName = document.getElementById("roomName")
                            roomName!.innerHTML="<p>"+u.name+"</p>"
                        }
                        
                    }
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
               
                
                const messagerie = document.getElementById("Messagerie")
                messagerie!.innerHTML=""
                if(!roomMessages || roomMessages===undefined || roomMessages.length===0){
                    messagerie!.classList.add("text-center")
                    messagerie!.innerHTML="Aucun message dans cette room"
                }
                else if(roomMessages && roomMessages.length>0){
                    messagerie!.classList.remove("text-center")
                    for (const m of roomMessages){

                        const message = document.createElement("div");
                        const senderUsername = userData.find((user: IUser) => String(user._id) === m.sender)?.username
                        
                        if ( senderUsername==username){
                            message.classList.add("end");
                        }
                         // Partie message
                        const messageBox = document.createElement("li");
                        if ( senderUsername==username){
                            messageBox.classList.add("myMessage");
                        }else{
                            messageBox.classList.add("othersMessage");
                        }

                        const message_text = document.createTextNode(m.content);
                        
                        messageBox.appendChild(message_text);

                        // Partie user
                            const usernameBox = document.createElement("div");
                            usernameBox.innerHTML = `<p>${ senderUsername}</p>`;
                            
                            // Partie messagerie
                            
                            message.appendChild(usernameBox);
                            message.appendChild(messageBox);
                        
                            messagerie?.appendChild(message);
                    }
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
     

        // Pour le web socket 
         useEffect(() => {
            // Vérification du username et de l'ID de la room
            StatusCheck()
         },[])

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
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-20 mb-1.5 animate-pulse"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-30 mb-1.5 animate-pulse"></div>
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


                {/* Partie création room */}

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