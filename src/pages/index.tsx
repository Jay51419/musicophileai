import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Noise from "~/components/Noise";


const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Musicopileai</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>
      <div className="flex flex-col min-h-screen pattern " >
        <header className="h-20 bg-opacity-90 fixed w-full z-10 top-0">
          <div className="container mx-auto px-6 py-8 flex items-center">
            <div className="flex items-center">
              <h1 className="text-5xl font-bold text-[#c7d6ed] drop-shadow-[0_1.4px_1.4px_rgba(75,0,130,1)]   satisfy ">
                Musicphileai
              </h1>
            </div>
            <div className="flex ml-auto">

            </div>
          </div>
        </header>
        <div className="h-screen  flex flex-col   justify-center" >
          <div className="flex flex-col min-h-screen pattern bg-black" >
            <div className="bg-gradient-to-r from-black via-indigo-950 to-black absolute top-0 right-0 h-full w-full opacity-90"   ></div>
            <main className="flex flex-col h-full justify-center items-start sm:items-center px-4 z-20 ">
              <h2 className="text-4xl sm:text-7xl mt-16 font-black leading-tight mb-8 text-left sm:text-center  text-[#c7d6ed]">
                Discover Your <br className="sm:hidden" /> Next <br className="hidden sm:block" />  Favorite <br className="sm:hidden" />Song
              </h2>
              <p className="text-white text-lg text-left sm:text-center sm:text-xl mb-12 max-w-lg">
                With Musicphileai, you can find the perfect song for any mood, occasion, or activity. Our advanced AI algorithms analyze millions of songs to provide you with personalized recommendations that you{"'"}ll love.
              </p>
              <Link href="/recommendation" className="bg-slate-950  py-5 px-9   hover:bg-gray-400 hover:text-white duration-700">
                <span className="text-lg sm:text-3xl font-semibold text-transparent  bg-clip-text bg-gradient-to-r from-[#c7d6ed] to-[#82a1c1]">
                  Get Started
                </span>
              </Link>
            </main>

          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
