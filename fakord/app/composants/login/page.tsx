'use client'
import Form from 'next/form'
import { useState } from 'react'
import {socket} from "../../../socket"

import { IUser } from '@/app/model/user';
import { useRouter } from 'next/navigation';


export default function Login() {


//  une autre méthode pour transférer une valeur dans d'autres pages 
// ( ne marche que si chaque user utilise son propre navigateur )
  // localStorage.setItem("username",onlineUsername)

    // Les inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Messages d'erreur lors de la connexion
    const [warningMsg, setWarningMsg] = useState('');

    // Routage
    const router = useRouter();

    async function identifyUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const response = await fetch("/api/users")
        const data =  await response.json();

        // Detecter si l'email et le username sont déjà utilisés avant la création du user
        const detectEmail = await data.find((user: IUser) => user.email === email);
        const checkPassword =detectEmail && detectEmail.password === password;
        
       
        // Vérifications de l'adresse mail et du mot de passe 
        if (!detectEmail) {
            setWarningMsg("Adresse mail intouvable");
            

        }else if(!checkPassword){
            setWarningMsg("Mot de passe incorecte");
    
        }else{
          // Supprime le message d'erreur et renvoie vers le chat général
          setWarningMsg("");

            const params = new URLSearchParams({
                  username: detectEmail.username,
              }).toString();

            // Envoi du username au serveur socket.io
            socket.emit('username',detectEmail.username)


            // Renvoi vers la page de chat avec les données du user
            router.push(`../../pages/room/1?${params}`);
          
        }
      }

     return (
      <>
      
      <div className='flex items-center flex-col gap-4 pt-40'>
        {/* image background de l'input  */}
        <div className=" w-fit rounded-2xl max-w-xs p-5 text-xl bg-[url(../public/pics/cat5.gif)] place-self-center bg-no-repeat bg-cover bg-center text-center">
        
        {/* Note : il faudra essayer de faire en sorte que l'input ne sorte pas de l'élément quand la page rétrécie */}
          <Form onSubmit={identifyUser} action="/pages/room/1" className=" flex flex-col gap-4 items-center " >
            <h1>Login</h1>

              <input type='email' onChange={(e)=>{setEmail(e.target.value.toLowerCase())}} className="bg-cyan-100 text-black field-sizing-content w-fit min-w-30 object-contain p-3 rounded-2xl lowercase" name="email" id='email' placeholder='Email...' required/>
              <input type='password' onChange={(e)=>{setPassword(e.target.value)}} className="bg-cyan-100 text-black field-sizing-content min-w-30 w-fit object-contain p-3 rounded-2xl" name="password" id='password' placeholder='Password...' required/>
            
              <div className="flex flex-wrap flex-row gap-4 justify-center">

                <p className= {`text-red-500 w-fit ${ warningMsg === ""? "size-0" : "py-5" } `}  id="warning">{warningMsg}</p> 
                <button type="submit" className="bg-green-300 hover:bg-green-400 text-black border-solid w-fit rounded-3xl p-2 cursor-pointer">  Login  </button>
                <a href='../../pages/register'className='flex items-center bg-blue-400 hover:bg-blue-500 text-black border-solid rounded-3xl p-2' > New User ?</a>
              
              </div>
            </Form>
          </div>
    
        </div>
    
      </>)
}