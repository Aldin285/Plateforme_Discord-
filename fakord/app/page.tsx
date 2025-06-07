'use client'
import Form from 'next/form'
import MediaThemeTailwindAudio from "player.style/tailwind-audio/react"
import Header from './composants/header/page'

import { NextPage } from 'next'
// import { url } from "inspector"
// import Link from "next/link"

  


export default function Home() {

  return (
   
  <>
  <Header/>

  <div className='grid grid-cols-3 grid-rows-3 gap-4 bg-linear-to-r from-cyan-900 to-blue-900'>
    {/* image background de l'input  */}
    <div className="col-start-2 row-start-2 w-full rounded-2xl max-w-xs  text-xl bg-[url(../public/pics/pearTetoDance.gif)] place-self-center bg-no-repeat bg-cover bg-center text-center">
    
    {/* Note : il faudra essayer de faire en sorte que l'input ne sorte pas de l'élément quand la page rétrécie */}
      <Form action="/pages/chat" className=" shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
        <h1>Username</h1>
        <br/>
          <input className="bg-cyan-100 text-black field-sizing-content w-auto object-contain p-3 rounded-2xl" name="nomUser" placeholder='username...'/>
      
          <br/>
          <br/>
          <button type="submit" className="bg-green-300 hover:bg-green-400 text-black border-solid rounded-3xl p-2">Let's chat</button>
        </Form>
      </div>

      <div className=" col-start-3 row-start-3 flex items-end">
        <MediaThemeTailwindAudio style={{width: "100%"}}>
            <audio
              slot="media"
              src= "/audio/TetoPearSong.mp3"
              playsInline
              autoPlay
              crossOrigin="anonymous"
            ></audio>
          </MediaThemeTailwindAudio>
      </div>

    </div>

  </>)

}