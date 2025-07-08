'use client'

// import { NextPage } from 'next'
import React,{ useState,useEffect } from "react";
import { useRouter } from 'next/router'

import { useSearchParams,usePathname } from "next/navigation";

import {socket} from "../../../socket"



export default function Rooms() {
    // POur avoir l'id du room
    let pathname = usePathname()
    let pathnameSplit = pathname.split("/")
    let pathnameId = pathnameSplit[pathnameSplit.length-1]

    // const router = useRouter()
    return (<p>Test id page : {pathnameId}</p>)
    }