import axios from 'axios';
import { env } from '~/env.mjs';

export interface SpotifyTokens {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
}

const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "https://musicophileai.vercel.app/";
const BASE64_ENCODED_AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const SPOTIFY_API = 'https://api.spotify.com/v1';



export async function getSpotifyAccessToken(code: string): Promise<SpotifyTokens> {
    let tokens: SpotifyTokens = {
        access_token: '',
        token_type: '',
        expires_in: 0,
        refresh_token: ''
    };
    const response = await axios({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: `Basic ${BASE64_ENCODED_AUTH}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`
    });

    tokens.access_token = response.data.access_token;
    tokens.token_type = response.data.token_type;
    tokens.expires_in = response.data.expires_in;
    tokens.refresh_token = response.data.refresh_token;
    return tokens
}

export async function searchSpotifyTrack(trackName: string, token: string): Promise<any> {
    const response = await axios({
        method: 'GET',
        url: `${SPOTIFY_API}/search`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: trackName,
            type: 'track',
            limit: 1
        }
    });

    return response.data;
}

export const refreshAccessToken = async (refreshToken: string): Promise<SpotifyTokens | null> => {
    try {
        const response = await axios({
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            params: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: env.SPOTIFY_CLIENT_ID,
                client_secret: env.SPOTIFY_CLIENT_SECRET,
            },
        });

        console.log('New Access Token:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return null
    }
};

