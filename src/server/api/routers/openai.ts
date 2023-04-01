import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const capitalize = (str: String) => {
    return str.charAt(0).toUpperCase() + str.substring(1);
}
export const openAiRouter = createTRPCRouter({
    getReccomendation: publicProcedure
        .input(z.object({
            language: z.string().default("hindi"),
            genre: z.string().default(""),
            mood: z.string().default("happy"),
            tempo: z.string().default("Moderato "),
        }))
        .query(async ({ input }) => {
            const prompt = `suggest ${input.language} ${input.genre} music  with ${input.mood} mood and ${input.tempo} tempo`
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 200,
                temperature: 0.7,
            });

            if (response.data) {
                const musicString = response.data?.choices[0]?.text || ""
                const musicList: (string | undefined)[] = musicString.split('\n').filter(music => music.trim() !== '').map(el => el.substring(el.indexOf('"') + 1))
                return musicList
            } else {
                return null;

            }
        }),
    validateGenre: publicProcedure.input(z.object({ name: z.string().min(1) })).query(async ({ input }) => {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `is ${capitalize(input.name)} a music genre?only yes or no?`,
            max_tokens: 200,
            temperature: 0.7,
        });
        const text = response.data?.choices[0]?.text?.trim().replace(/\./g, '')
        return text == "Yes" ? true : false

    }),
    validateMood: publicProcedure.input(z.object({ name: z.string().min(1) })).query(async ({ input }) => {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `is ${capitalize(input.name)} a mood?only yes or no?`,
            max_tokens: 200,
            temperature: 0.7,
        });
        const text = response.data?.choices[0]?.text?.trim().replace(/\./g, '')
        console.log(text, text == "Yes")
        return text == "Yes" ? true : false

    })
});
