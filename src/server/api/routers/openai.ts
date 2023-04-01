import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

// const searchTrack = async (trackName: string, artist: string) => {
//     const searchUrl = `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(trackName)}%20artist:${artist}&type=track&limit=2`;
//     const response = await fetch(searchUrl, {
//         headers: {
//             Authorization: `Bearer ${env.SPOTIFY_ACCESS_TOKEN}`,
//         },
//     });

//     return response.json()
// };


// interface SpotifyAlbum {
//     album: {
//         album_group: string;
//         album_type: string;
//         artists: {
//             external_urls: { [key: string]: string };
//             href: string;
//             id: string;
//             name: string;
//             type: string;
//             uri: string;
//         }[];
//         available_markets: string[];
//         external_urls: { [key: string]: string };
//         href: string;
//         id: string;
//         images: { [key: string]: string }[];
//         is_playable: boolean;
//         name: string;
//         release_date: string;
//         release_date_precision: string;
//         total_tracks: number;
//         type: string;
//         uri: string;
//     };
//     artists: {
//         external_urls: { [key: string]: string };
//         href: string;
//         id: string;
//         name: string;
//         type: string;
//         uri: string;
//     }[];
//     available_markets: string[];
// }


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

function convertStringToArrayOfObjects(str: string): { name: string; artist: string | undefined }[] {
    const lines = str.split('\n');
    const songs = [];
    for (const line of lines) {
        const parts = line.split(' - ');
        if (parts.length < 2) continue;
        const name = (parts?.[0] || "").replace(/^\d+\.\s*/, '');
        const artist = parts[1];
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

            if (response.data) {
                const musicString = response.data?.choices[0]?.text || ""
                return (convertStringToArrayOfObjects(musicString))
            } else {
                return null;
            }
        }),
});
