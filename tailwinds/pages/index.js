import Head from 'next/head'
import Image from 'next/image'
import Content from '../components/Content'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'
import Dropdown from '../components/Dropdown'
import MainNavBar from '../components/MainNavbar'

export default function Home() {
  return (
    <>
      <MainNavBar />
      <Hero />
      <Content />
      <Footer />
      <h1 className="text-3xl font-bold font-serif underline">
        Hello world!
      </h1>
    </>
  )
}
