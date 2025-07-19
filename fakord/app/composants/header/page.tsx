'use client'
import 'flowbite'

// Importation des icones
import { FaPause } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";

import { useState, useRef, useEffect } from 'react'


export default function Header() {
    // Music
    const [currentMusic,setcurrentMusic] = useState('Snowy')

    const musicList = ["Snowy","TetoPearSong","Aline","Sirène - Rouge dIris"]

  

    useEffect(() => {
    const musicSelect = document.getElementById("musicSelect");
    if (musicSelect) {
        for (const el of musicList) {
        musicSelect.innerHTML += `<option value="${el}">${el}</option>`;
        }
    }
}, []); // Run once after the component mounts

   

    const audioRef = useRef<HTMLAudioElement>(null)
    const [buttonStatus, setButtonStatus] = useState(false)
    
    const statusChange = () => {
    if (!audioRef.current) return;

    if (buttonStatus) {
        audioRef.current.pause();
    } else {
        audioRef.current.play();
    }
    
        setButtonStatus(!buttonStatus);
      };

    return (
        <header>
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-linear-to-l from-cyan-950 via-teal-950 to-emerald-950">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
               {/* icone gauche et logo */}
                <p className="flex items-center">
                    <img src="/pics/dancingTetoPear.gif" className="mr-3 h-6 sm:h-9" alt=" Teto Pear" />
                    <a href='/'><span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Fakord</span></a>
                </p>

                {/* Musique du site */}
                <div className="flex items-center lg:order-2">  
                {/* <a href="./../../" className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Home</a> */}
                
                <select className='text-black rounded-3xl bg-gray-400'
                onChange={(e)=>{setcurrentMusic(e.target.value)}} id="musicSelect" >
                    <option value={"Snowy"}>Select</option>
                   
                </select>
                
                <audio slot="media" src= {"/audio/"+ currentMusic+".mp3"}
                playsInline crossOrigin="anonymous"
                ref={audioRef}
                ></audio>
                
                <button onClick={statusChange} type='button' id="button">
                {buttonStatus?(
                    <FaPause className='text-cyan-300  text-3xl rounded-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-cyan-600 '/>
                ) : (
                <FaPlay className='text-cyan-300  text-3xl rounded-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-cyan-600 '/>)
                }
                </button>


                   
                   {/* changement du header pour le format mobile */}
                    <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                        <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
                <div className="hidden justify-between w-full lg:flex lg:w-auto lg:order-2" id="mobile-menu-2">
                    <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                        
                         <li>
                            <a href="./../../" className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="" className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white" aria-current="page">Lien 2</a>
                        </li>  
                       
                        {/* <li>
                            <RouterLink to="Page2" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Page2</RouterLink>
                        </li>  */}

                        
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    )

}