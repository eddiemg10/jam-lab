import { useEffect } from 'react'
import { getAccessToken } from '../../auth/spotify';
import { useNavigate } from 'react-router';

export default function Authenticate() {
    const navigate = useNavigate();

    useEffect(() => {
        (async() => { 
            // This assumes the url already contains the authorization code from Spotify auth
            const urlParams = new URLSearchParams(window.location.search);
            const authCode = urlParams.get('code');

            // Now, we need to request for an access token and save it to local storage
            const codeVerifier = window.localStorage.getItem('code_verifier'); 

            if(authCode && codeVerifier){
                const accessToken = await getAccessToken(authCode, codeVerifier)
                localStorage.setItem('access_token', accessToken.access_token);
                localStorage.setItem('refresh_token', accessToken.refresh_token);
            }
        })().then(() => {      
            navigate('/', {replace: true})
        })
    }
    , [])

  return (
   <>
   </>
  )
}
