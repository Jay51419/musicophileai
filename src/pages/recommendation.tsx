import { type NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import Noise from "~/components/Noise";
import SpotifyIcon from "~/components/Spotify";
import SuggestionCard from "~/components/SuggestionCard";
import YoutubeIcon from "~/components/YoutubeIcon";
import Spinner from "~/components/spinner";
import { type Track } from "~/server/helpers/spotify-token";
import { api } from "~/utils/api";

const Recommendation: NextPage = () => {
    const [recommendations, setReccommendations] = useState<Track[] | null>()
    const [prompt, setPrompt] = useState("")
    const [showRefreshButton, setShowRefreshButton] = useState(false)
    const getReccomendation = api.openai.getReccomendation.useMutation({
        onSuccess(data, _, __) {
            setShowRefreshButton(false)
            if (data !== null && data !== undefined && data.length !== 0) {
                setReccommendations(data)
            } else {
                setShowRefreshButton(true)
            }
        },
    });
    const suggestions = ["Hindi Romantic wedding 90s", "Sad slow rhythm love"]
    const recommend = () => {
        if (prompt == "") return;
        getReccomendation.mutate({ prompt })

    }

    return (
        <div className="flex flex-col min-h-screen h-full pattern bg-gray-700">
            <header className="h-20 bg-opacity-90 fixed w-full z-10 top-0">
                <div className="container mx-auto px-6 py-8 flex items-center">
                    <div className="flex items-center">
                        <h1 className="text-5xl font-bold text-[#c7d6ed] drop-shadow-[0_1.4px_1.4px_rgba(75,0,130,1)]   satisfy ">
                            Musicophileai
                        </h1>
                    </div>
                </div>
            </header>
            <div className="min-h-screen" >
                <div className="min-h-screen h-full bg-gradient-to-r from-black via-indigo-950 to-black opacity-90  flex flex-col justify-center" >
                    <div className="flex flex-col w-full h-full justify-start items-center z-20 mt-32" >
                        <div className="w-full flex justify-center items-center" >
                            <input placeholder="Enter your mood or ocassion" className="bg-[#c7d6ed9c] h-14 text-lg w-full max-w-xs sm:max-w-md placeholder-black px-2 focus:outline-none caret-black" type="text" value={prompt} onChange={e => setPrompt(e.target.value)} />
                            <button onClick={recommend} className="bg-slate-950  py-4 px-4   hover:bg-slate-900 hover:text-white duration-700">
                                <span className="text-lg font-semibold text-transparent  bg-clip-text bg-gradient-to-r from-[#c7d6ed] to-[#82a1c1]">
                                    Recommend
                                </span>
                            </button>
                        </div>
                        <div className="mt-16 ">
                            {getReccomendation.isLoading && <Spinner></Spinner>}
                            {showRefreshButton && <button onClick={recommend} className="bg-slate-950  py-4 px-4   hover:bg-slate-900 hover:text-white duration-700">
                                <span className="text-lg font-semibold text-transparent  bg-clip-text bg-gradient-to-r from-[#c7d6ed] to-[#82a1c1]">
                                    Retry
                                </span>
                            </button>}
                            {recommendations == null && !getReccomendation.isLoading && !showRefreshButton && suggestions.map((suggestion, i) => {
                                return (
                                    <button className="m-4" key={i} onClick={() => setPrompt(suggestion)} >
                                        <SuggestionCard text={suggestion} />
                                    </button>
                                )
                            })}
                            <div className="scroll" >
                                {
                                    recommendations?.map((track, i) => {
                                        return (
                                            <div key={i} className="w-full sm:w-[36rem]   px-4 py-6 flex justify-between bg-slate-950 gap-x-8 my-3">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-white text-lg" >
                                                        Song: <span className="font-semibold text-lg " >{track.name}</span>
                                                    </span>
                                                    <span className="text-white text-lg" >
                                                        Artist: <span className="font-semibold  text-lg" >{track.artist}</span>
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-y-4" >
                                                    <Link href={track.url} target="_blank" className="bg-black px-4 py-2 flex items-center gap-x-1" >
                                                        <span className="text-white font-semibold text-sm">LISTEN ON</span>
                                                        <SpotifyIcon />
                                                    </Link>
                                                    <Link href={track.youtube} target="_blank" className="bg-black px-4 py-2 flex items-center justify-between gap-x-" >
                                                        <span className="text-white font-semibold text-sm">WATCH ON</span>
                                                        <YoutubeIcon />
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};





export default Recommendation;
