import { useAtom } from "jotai";
import { ChangeEvent, useState } from "react";
import { tempoAtom } from "~/atoms";
import { Tempos } from "~/utils/constants";

const TempoSlider = () => {
    const [_, setTempo] = useAtom(tempoAtom)
    const [value, setValue] = useState(4)
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(e.target.value))
        setTempo(Tempos[parseInt(e.target.value)])
    }
    const tempoTranslations = [
        "Slow and solemn",
        "Very slow and broad",
        "Slow and graceful",
        "Moderate and flowing",
        "Moderate",
        "Fast and lively",
        "Very fast and lively",
        "Very fast",
        "Extremely fast"
      ];
    return (
        <div>
            <label className="text-slate-200 text-xl font-semibold">Tempo : <span>{tempoTranslations[value]}</span> </label>
            <input type="range" min="0"
                max="8" value={value} onChange={onChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
        </div>)
}

export default TempoSlider;