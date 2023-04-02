import { type NextPage } from "next";
import { useState } from "react";
import Spinner from "~/components/spinner";
import { type Track } from "~/server/helpers/spotify-token";
import { api } from "~/utils/api";

const Recommendation: NextPage = () => {
    const [recommendations, setReccommendations] = useState<Track[] | null>()
    const [prompt, setPrompt] = useState("Old hindi classic lata mangeskar")
    const [showRefreshButton, setShowRefreshButton] = useState(false)
    const getReccomendation = api.openai.getReccomendation.useMutation({
        onSuccess(data, _, __) {
            setShowRefreshButton(false)
            if (data !== null && data !== undefined) {
                setReccommendations(data)
                if (data[0]?.url == "") {
                    setShowRefreshButton(true)
                }
            } else {
                setShowRefreshButton(true)
            }
        },
    });
    return (
        <div className="bg-slate-900 w-full h-screen flex justify-center " >
            <div className="h-full w-full flex flex-col justify-start m-10 max-w-lg" >
                <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} />
                <br />
                <button onClick={() => {
                    if (prompt == "") return;
                    getReccomendation.mutate({ prompt })
                }} className="bg-[#0072C6] px-4 py-2 rounded-full text-white font-semibold" >Submit</button>
                {showRefreshButton && <button onClick={() => {
                    if (prompt == "") return;
                    getReccomendation.mutate({ prompt })
                }} className="bg-[#0072C6] px-4 py-2 rounded-full text-white font-semibold" >Refresh</button>}
                <h1 className="text-white" >Recommendation</h1>

                <ul>
                    {
                        getReccomendation.isLoading ? <Spinner /> :

                            recommendations?.map((e, i) => {
                                return <li key={i} className="text-white" >
                                    <img className="h-24 w-24" src={e.image} alt="" />
                                    {
                                        e.name
                                    } | {
                                        e.artist
                                    }| <a href={e.url}>Open</a>
                                </li>
                            })
                    }
                </ul>
            </div>
        </div>
    );
};





export default Recommendation;
