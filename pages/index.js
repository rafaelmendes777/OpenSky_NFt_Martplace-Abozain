import Head from 'next/head'
import { useState } from "react";
import Header from './../components/header'
import Footer from './../components/footer'
import Paragraph1 from './../components/index/paragraph1'
import Paragraph2 from './../components/index/paragraph2'
import Paragraph3 from './../components/index/paragraph3'
import Paragraph4 from './../components/index/paragraph4'

export default function ExplorePage() {
  const [themeMode, setThemeMode] = useState(true)

  return (
    <>
      <Head>
        <title>OpenSky</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header current={0}></Header>
      <div className='bg-[#0D0F23] dark:bg-white'>
        <div className='w-full 2xl:max-w-screen-2xl h-auto pt-[104px] flex flex-col m-auto'>
          <Paragraph1></Paragraph1>
          <Paragraph2></Paragraph2>
          <Paragraph3></Paragraph3>
          <Paragraph4></Paragraph4>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}
