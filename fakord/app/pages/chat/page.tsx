"use client"

import { NextPage } from 'next'
import { useState } from "react";

import React  from "react";
import { useSearchParams } from "next/navigation";

import Header from '@/app/composants/header/page';

const Chat:NextPage = () =>{



    const searchParams = useSearchParams();

    const [Message,SetMessage] = useState('')
    

    const AjoutText =()=>{
        console.log(Message)
       
        const br = document.createElement("br") 

        const message = document.createElement("div")
        message.classList.add("end")

        // Partie message
        const message_box = document.createElement("li")
        message_box.classList.add("message")
        const message_text = document.createTextNode(Message)

        message_box.appendChild(message_text)

        // Partie user
         const nom_user = searchParams.get("nomUser")
         const userHtml = `<p>${nom_user}</p>`

         const nom_user_box = document.createElement("div")
         
         nom_user_box.innerHTML = userHtml
        //  nom_user_box.appendChild(nom_user_text)

        // Parie messagerie 
        const messagerie = document.getElementById("Messagerie")
        
        message.appendChild(nom_user_box)
        message.appendChild(message_box)
        message.appendChild(br)

        messagerie?.appendChild(message)

       SetMessage("")

}

    return (
        <>
        <Header/>
        <div className='grid grid-cols-3 grid-rows-[400px_400px] gap-4 bg-linear-to-r from-cyan-900 to-blue-900 p-3 '>
           
           {/* Il faut rendre la box du chat responsive pour éviter le défilement horizontal */}
            <div className="col-start-2 row-start-1 row-end-2 flex flex-col items-center overflow-y-auto scrollbar-hide ">
                

                <h1>Nom Salon</h1>
                <br/>
                <ul className="list-none  border-amber-100 rounded-4xl border-2 w-md p-3  bg-blue-300" id="Messagerie">
                    {/* break-all sert à faire un saut de ligne quand un mot est trop long pour le cadre définit */}
                    <div className='end' >
                    <p>nomUser1</p>
                    <li className="break-all p-1  w-xs rounded-md bg-gradient-to-r from-emerald-500 from-10% via-teal-500 via-40% to-teal-800 to-80%">tesddddddddddddddddddddddddddddddddddddddddddtsdddddddddddddddddddddbbkhbkbkqsdljsqdkbsdfsdfisdifv 1</li>
                    <br/>
                    </div>

                    <p>NomUser2</p>
                    <li className="break-all rounded-md p-1 w-sm bg-gradient-to-r from-indigo-500 from-10% via-blue-500 via-40% to-sky-800 to-80%">test 2</li>
                    <br/>
                </ul>  
            </div>

            <div className=" col-start-2 row-start-2 flex flex-row items-center justify-self-center self-start ">
             {/* <p>Your username is : {searchParams.get("nomUser")}</p> */}
                <input onChange={(e)=>SetMessage(e.target.value)} className="bg-cyan-100 text-black p-1 rounded-2xl" name="Message" id="Message" placeholder="message..." value={Message}/>
                <br/>
                
                <button onClick={AjoutText} className="bg-blue-300 hover:bg-blue-400 text-black border-solid rounded-3xl p-2">Send</button>
            </div>

        </div>  
        </>
    )
}

export default Chat