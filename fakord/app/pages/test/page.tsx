"use client";

interface User {
  _id: Number;
  fistname: String;
  lastname: String;
  rooms:[String];
  info:{
    birthday:Date;
    gender: String;
  }
}
interface UsersProps{
  users: User[];
}

export default function Home() {
 
  return (
    <div>
      <h1 className="text-5xl">Test BDD</h1>
      <h1>{process.env.NEXT_PUBLIC_MONGODB_URI?process.env.NEXT_PUBLIC_MONGODB_URI:"Pas d'uri"}</h1>    
    </div>
  );
}