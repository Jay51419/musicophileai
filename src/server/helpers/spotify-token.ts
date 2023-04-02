import axios from 'axios';
import { env } from '~/env.mjs';

export interface SpotifyTokens {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
}
export interface AlbumSearchResult {
    albums: {
        href: string;
        limit: number;
        next: string | null;
        offset: number;
        previous: string | null;
        total: number;
        items: {
            album_type: string;
            total_tracks: number;
            external_urls: {
                spotify: string;
            };
            href: string;
            id: string;
            images: {
                url: string;
                height: number;
                width: number;
            }[];
            name: string;
            release_date: string;
            release_date_precision: string;
            type: string;
            uri: string;
            album_group: string;
            artists: {
                external_urls: {
                    spotify: string;
                };
                href: string;
                id: string;
                name: string;
                type: string;
                uri: string;
            }[];
            is_playable: boolean;
        }[];
    };
}

export type Track = {
    name: string;
    artist: string;
    image: string;
    url: string;
    year: string;
    market:string;
    album:string;
};

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

export async function searchSpotifyAlbum(query: string,market:string,token: string): Promise<AlbumSearchResult> {
    const response = await axios({
        method: 'GET',
        url: `${SPOTIFY_API}/search`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: query,
            type: 'album',
            limit: 1,
            market: market.trim(),
        }
    });

    return response.data as AlbumSearchResult;
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

