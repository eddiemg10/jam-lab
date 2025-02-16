import axios from 'axios';
import {z} from 'zod';

const UserProfile = z.object({
    display_name: z.string(),
    followers: z.object({
        href: z.string().nullable(),
        total: z.number(),
    }),
    href: z.string(),
    id: z.string(),
    images: z.array(z.object({
        height: z.number(),
        url: z.string(),
        width: z.number(),
    })),
    uri: z.string(),
});

export type UserProfile = z.infer<typeof UserProfile>;

const getUserProfile = async (accessToken: string): Promise<UserProfile> => {
    const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if(response.status === 200){
        try{
            UserProfile.parse(response.data);
        } catch(e){
            console.error(e);
        }
        return response.data;
    }
    else{
        throw new Error("Got error with token: " + accessToken);
    }
}

export {
    getUserProfile,
};