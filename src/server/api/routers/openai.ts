import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

import { createClient } from 'redis';
import { getSpotifyAccessToken, refreshAccessToken, searchSpotifyTrack } from "~/server/helpers/spotify-token";

const redisClient = createClient({
    username: "default",
    password: env.REDIS_PASSWORD,
    socket: {
        host: env.REDIS_HOST,
        port: 15417
    }
});

const getAccessToken = async () => {
    return await redisClient.get("access-token")
};
const getRefresToken = async () => {
    return await redisClient.get("refresh-token")
};

const setAccessToken = async (token: string, refreshToken: string) => {
    await redisClient.set("access-token", token, { EX: 3600 })
        .then(async () => {
            await redisClient.set("refresh-token", refreshToken)
        })
};


async function getToken(): Promise<string | null | void> {
    return redisClient.connect().then(async () => {
        const refreshToken = await getRefresToken()
        if (refreshToken == null) {
            const spotifyToken = await getSpotifyAccessToken(env.SPOTIFY_CLIENT_CODE)
            console.log("spotifyToken", spotifyToken)
            if (spotifyToken) {
                await setAccessToken(spotifyToken.access_token, spotifyToken.refresh_token).then(async () => {
                    return await getAccessToken().then(_ => redisClient.disconnect())
                })
            }
        } else {
            const accessToken = await getAccessToken()
            console.log()
            if (accessToken) {
                return accessToken
            } else {
                const newToken = await refreshAccessToken(refreshToken)
                if (newToken) {
                    setAccessToken(newToken.access_token, newToken.refresh_token).then(async () => {
                        return await getAccessToken().then(_ => redisClient.disconnect())
                    }).catch(err => { console.log(err) })
                }
            }
        }
    }).catch(err => console.log("connection", err))
}

const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/*

old clasical mild hindi list 10 songs (songname - artist) without number


Kabhi Kabhie Mere Dil Mein - Mukesh
Hum Tumhe Itna Pyar Karenge - Kishore Kumar
Chura Liya Hai Tumne Jo Dil Ko - Asha Bhosle
Chalte Chalte Mere Yeh Geet - Lata Mangeshkar
Tere Bina Zindagi Se - Lata Mangeshkar
Kitna Pyara Wada Hai - Kishore Kumar
Humein Tumse Pyar Kitna - Kishore Kumar
Tum Itna Jo Muskura Rahe Ho - Jagjit Singh
Kya Hua Tera Wada - Mohammad Rafi
Chal Diye Tum Kahan - Lata Mangeshkar

*/

function convertStringToArrayOfObjects(str: string): { name: string; artist: string }[] {
    const lines = str.split('\n');
    const songs: { name: string; artist: string }[] = [];
    for (const line of lines) {
        const parts = line.split(' - ');
        if (parts.length < 2) continue;
        const name = (parts?.[0] || "").replace(/^\d+\.\s*/, '');
        const artist = parts[1] || "";
        songs.push({ name, artist });
    }
    return songs;
}


export const openAiRouter = createTRPCRouter({
    getReccomendation: publicProcedure
        .input(z.object({
            prompt: z.string(),
        }))
        .mutation(async ({ input }) => {
            const prompt = `${input.prompt} list 10 songs (songname - artist)`
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 200,
                temperature: 0.7,
            });
            const token = await getToken()
            if (response.data) {
                const musicString = response.data?.choices[0]?.text || ""
                const data = convertStringToArrayOfObjects(musicString)
                if (token) {
                    // const query = `track:${data[0]?.name.replace(/ /g, '%20')}%20artist:${data[0]?.artist?.replace(/ /g, '%20')}`
                    //const searchData = await searchSpotifyTrack(query, token)
                    //console.log(searchData)
                    return data
                }
                return (data)
            } else {
                return null;
            }
        }),
});
