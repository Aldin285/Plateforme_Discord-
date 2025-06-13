"use client"

import { NextPage } from 'next'
import React,{ useState,useEffect } from "react";


import Header from '@/app/composants/header/page';
import ChatRoom from '@/app/composants/chat/page';
import Footer from '@/app/composants/footer/page';

// Pour le web socket

const Chat:NextPage = () =>{

    return (
      <>
        <Header/>
        <ChatRoom/>
        <Footer/>
       </>
    )
}
export default Chat