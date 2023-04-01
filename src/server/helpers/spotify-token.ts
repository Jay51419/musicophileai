import axios from 'axios';
import { env } from '~/env.mjs';

export interface SpotifyTokens {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
}
interface SpotifyTrackSearchResult {
    tracks: {
        href: string;
        items: Array<{
            album: {
                id: string;
                name: string;
                images: Array<{
                    url: string;
                }>;
            };
            artists: Array<{
                id: string;
                name: string;
            }>;
            id: string;
            name: string;
            preview_url: string;
            uri: string;
        }>;
        limit: number;
        next: string | null;
        offset: number;
        previous: string | null;
        total: number;
    };
}

const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "https://musicophileai.vercel.app/";
const BASE64_ENCODED_AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const SPOTIFY_API = 'https://api.spotify.com/v1';



export async function getSpotifyAccessToken(code: string): Promise<SpotifyTokens> {
    const response = await axios({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: `Basic ${BASE64_ENCODED_AUTH}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`
    });
    return response.data as SpotifyTokens
}

export async function searchSpotifyTrack(trackName: string, token: string): Promise<SpotifyTrackSearchResult> {
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

    return response.data as SpotifyTrackSearchResult;
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
        return response.data as SpotifyTokens;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return null
    }
};

