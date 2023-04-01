import { type NextPage } from "next";
import { api } from "~/utils/api";

const Recommendation: NextPage = () => {
    const getReccomendation = api.openai.getReccomendation.useQuery({});
    const validateGenre = api.openai.validateGenre;
    const validateMood = api.openai.validateMood;
    return (
        <>
            <h1>Recommendation</h1>
            {getReccomendation?.data && (getReccomendation?.data).map((music, i) => {
                return <p key={i} >{music}</p>
            })}
            Classical {(validateGenre.useQuery({ name: "classic" })?.data?.toString())}
            Sad {(validateMood.useQuery({ name: "classic" })?.data?.toString())}
            Sad {(validateMood.useQuery({ name: "sad" })?.data?.toString())}
        </>
    );
};

export default Recommendation;
