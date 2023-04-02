import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";
import axios from 'axios';
import { createClient } from 'redis';
import { type Track, getSpotifyAccessToken, refreshAccessToken, searchSpotifyAlbum } from "~/server/helpers/spotify-token";

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

function convertStringToArrayOfObjects(str: string): Track[] {
    const lines = str.split('\n');
    const songs: Track[] = [];
    for (const line of lines) {
        const parts = line.split(' - ');
        if (parts.length < 2) continue;
        const name = (parts?.[0] || "").replace(/^\d+\.\s*/, '');
        const artist = parts[1] || "";
        const year = parts[2] || "";
        const market = (parts[3] || "").charAt(0) + (parts[3] || "").charAt(1);
        const album = parts[4] || "";
        songs.push({ name, artist, image: "", url: "", market, year, album });
    }
    return songs;
}

function createSpotifyLink(uri: string): string {
    const uriParts = uri.split(':');
    const resourceType = uriParts[1] || "";
    const resourceId = uriParts[2] || "";

    return `https://open.spotify.com/${resourceType}/${resourceId}`;
}

interface DalleApiResponse {
    data: DalleApiImageData[];
}

interface DalleApiImageData {
    url: string;
    prompt: string;
    text: string;
}

export const openAiRouter = createTRPCRouter({
    getReccomendation: publicProcedure
        .input(z.object({
            prompt: z.string(),
        }))
        .mutation(async ({ input }) => {
            const prompt = `${input.prompt} list 5 songs (number. songname -artist-year- only country initials-album)`
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 200,
                temperature: 0.7,
            });
            // const token = await getToken()
            // await redisClient.disconnect()
            if (response.data) {
                const musicString = response.data?.choices[0]?.text || ""
                return convertStringToArrayOfObjects(musicString).map((track) => {
                    const q =  encodeURIComponent(`${track.name} ${track.artist}`)
                    const url = (`https://open.spotify.com/search/${q}`)
                    return { ...track, url }
                })
            } else {
                return null;
            }
        }),
});
