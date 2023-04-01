import { youtube_v3 } from "googleapis";
import { atom, useAtom } from "jotai";
import { type NextPage } from "next";
import { useEffect, useState } from "react";
import Spinner from "~/components/spinner";
import { api } from "~/utils/api";
import { Languages } from "~/utils/constants";

const Recommendation: NextPage = () => {
    const [recommendations, setReccommendations] = useState<(string | undefined)[] | null>()
    const [language] = useAtom(languageAtom)
    const getReccomendation = api.openai.getReccomendation.useMutation({
        onSuccess(data, variables, context) {
            setReccommendations(data)
        },
    });
    return (
        <div className="bg-slate-900 w-full h-screen flex justify-center " >
            <div className="h-full w-full flex flex-col justify-start m-10 max-w-lg" >
                <LanguageDropdown />

                <button onClick={() => getReccomendation.mutate({ language })} className="bg-[#0072C6] px-4 py-2 rounded-full text-white font-semibold" >Submit</button>

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

const languageAtom = atom(Languages[0])

const LanguageDropdown = () => {
    const [language, setLanguage] = useAtom(languageAtom)
    const [showDropDown, setShowDropDown] = useState(false)
    return (
        <div>
            <span className="text-slate-200 text-xl font-semibold " >Language : </span>
            <button onClick={() => setShowDropDown(!showDropDown)} className="text-white  hover:text-blue-800 font-semibold rounded-lg text-lg px-4 py-2.5 text-center inline-flex items-center" type="button">
                {language}  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div id="dropdownHover" className={`z-10 ${showDropDown ? "" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                    {
                        Languages.map((name, i) => {
                            return (
                                <li key={i} >
                                    <button onClick={() => { setLanguage(name); setShowDropDown(false); }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{name}</button>
                                </li>)
                        })
                    }

                </ul>
            </div>
        </div>
    )
}

export default Recommendation;
