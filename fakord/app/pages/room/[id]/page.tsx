"use client"

import { NextPage } from 'next'
import React,{ useState,useEffect } from "react";


import Header from '@/app/composants/header/page';
import Rooms from '@/app/composants/room/page';
import Footer from '@/app/composants/footer/page';
import  RoomProvider from '@/app/composants/roomsDisplay/page';

// Pour le web socket

const Room:NextPage = () =>{

    return (
      <>
        <RoomProvider>
           <Header/>
          <Rooms/>
        </RoomProvider>
        <Footer/>
       </>
    )
}
export default Room