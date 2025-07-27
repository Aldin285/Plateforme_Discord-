"use client"

import { NextPage } from 'next'
import React,{ useState,useEffect } from "react";


import Header from '@/app/composants/header/page';
import Test from '@/app/composants/test/page';
import Footer from '@/app/composants/footer/page';

// Pour le web socket

const Tests:NextPage = () =>{

    return (
      <>
        {/* <Header/> */}
        <Test/>
        {/* <Footer/> */}
       </>
    )
}
export default Tests



