"use client"

import { NextPage } from 'next'
import React,{ useState,useEffect } from "react";


import Header from '@/app/composants/header/page';
import Rooms from '@/app/composants/room/page';
import Footer from '@/app/composants/footer/page';

// Pour le web socket

const Room:NextPage = () =>{

    return (
      <>
        <Header/>
        <Rooms/>
        <Footer/>
       </>
    )
}
export default Room