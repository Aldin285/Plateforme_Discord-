'use client'
import Form from 'next/form'
import { useState } from 'react'
import {socket} from "../../../socket"

export default function Login() {

 const [onlineUsername,SetOnlineUsername] = useState('')


//  une autre méthode pour transférer une valeur dans d'autres pages 
// ( ne marche que si chaque user utilise son propre navigateur )
  // localStorage.setItem("username",onlineUsername)

  const SendUsername =()=>{
    socket.emit('username',onlineUsername)
    console.log("TEST")
  }

     return (
      <>
      
      <div className='grid grid-cols-3 grid-rows-3 gap-4 '>
        {/* image background de l'input  */}
        <div className="col-start-2 row-start-2 w-full rounded-2xl max-w-xs  text-xl bg-[url(../public/pics/cat5.gif)] place-self-center bg-no-repeat bg-cover bg-center text-center">
        
        {/* Note : il faudra essayer de faire en sorte que l'input ne sorte pas de l'élément quand la page rétrécie */}
          <Form action="/pages/room/1" className=" shadow-md rounded px-8 pt-6 pb-8 ">
            <h1>Username</h1>
            <br/>
              <input onChange={(e)=>{SetOnlineUsername(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content w-auto object-contain p-3 rounded-2xl" name="nomUser" placeholder='username...'/>
          
              <br/>
              <br/>
              <div className="flex justify-center flex-wrap flex-row gap-4">
              <button onClick={SendUsername} type="submit" className="bg-green-300 hover:bg-green-400 text-black border-solid rounded-3xl p-2">Let's chat</button>
              <a href='../../pages/register'className='flex items-center' > New User ?</a>
              </div>
            </Form>
          </div>
    
        </div>
    
      </>)
}