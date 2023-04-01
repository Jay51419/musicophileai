import { type NextPage } from "next";
import { useState } from "react";
import Spinner from "~/components/spinner";
import { api } from "~/utils/api";

const Recommendation: NextPage = () => {
    const [recommendations, setReccommendations] = useState<{
        name: string;
        artist: string | undefined;
    }[] | null>()
    const [prompt, setPrompt] = useState("Old hindi classic lata mangeskar")
    const getReccomendation = api.openai.getReccomendation.useMutation({
        onSuccess(data, _, __) {
            setReccommendations(data)
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

                <h1 className="text-white" >Recommendation</h1>

                <ul>
                    {
                        getReccomendation.isLoading ? <Spinner /> :

                            recommendations?.map((e, i) => {
                                return <li key={i} className="text-white" >
                                    {e.name} | {e.artist} 
                                </li>
                            })
                    }
                </ul>
            </div>
        </div>
    );
};





export default Recommendation;
