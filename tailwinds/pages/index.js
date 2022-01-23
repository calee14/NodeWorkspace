import Head from 'next/head'
import Image from 'next/image'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <h1 className="text-3xl font-bold font-serif underline">
        Hello world!
      </h1>
    </>
  )
}
