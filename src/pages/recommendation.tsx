import { useAtom } from "jotai";
import { type NextPage } from "next";
import { useState } from "react";
import { genreAtom, languageAtom, moodAtom, tempoAtom } from "~/atoms";
import GenreDropdown from "~/components/genre-component";
import LanguageDropdown from "~/components/language-dropdown";
import MoodDropdown from "~/components/mood-dropdown";
import Spinner from "~/components/spinner";
import TempoSlider from "~/components/tempo-slider";
import { api } from "~/utils/api";

const Recommendation: NextPage = () => {
    const [recommendations, setReccommendations] = useState<(string | undefined)[] | null>()
    const [language] = useAtom(languageAtom)
    const [mood] = useAtom(moodAtom)
    const [genre] = useAtom(genreAtom)
    const [tempo] = useAtom(tempoAtom)
    const getReccomendation = api.openai.getReccomendation.useMutation({
        onSuccess(data, variables, context) {
            setReccommendations(data)
        },
    });
    return (
        <div className="bg-slate-900 w-full h-screen flex justify-center " >
            <div className="h-full w-full flex flex-col justify-start m-10 max-w-lg" >
                <LanguageDropdown />
                <GenreDropdown />
                <MoodDropdown />
                <TempoSlider />
                <br />
                <button onClick={() => getReccomendation.mutate({ language, genre, mood, tempo })} className="bg-[#0072C6] px-4 py-2 rounded-full text-white font-semibold" >Submit</button>

                <h1 className="text-white" >Recommendation</h1>

                <ul>
                    {
                        getReccomendation.isLoading ? <Spinner /> :

                            recommendations?.map((e, i) => {
                                return <li key={i} className="text-white" >
                                    {e}
                                </li>
                            })
                    }
                </ul>
            </div>
        </div>
    );
};





export default Recommendation;
