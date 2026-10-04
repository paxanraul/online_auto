"use client";
import {useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
export default function Home(){const router=useRouter();useEffect(()=>{let l='ru';try{l=localStorage.getItem('autoshop-locale')==='az'?'az':'ru'}catch{}router.replace('/'+l)},[router]);return <main className="container"><Link href="/ru">Русский</Link> · <Link href="/az">Azərbaycanca</Link></main>}
