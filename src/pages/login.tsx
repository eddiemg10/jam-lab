import { generateCodeVerifierChallengePair, getAuthorizationUrl } from '../auth/spotify'
import spotify_logo from '../assets/spotify_logo_white.svg'

export default function Login() {
    const handleClick = async () => {
        const {code_verifier, code_challenge} = await generateCodeVerifierChallengePair()
        // Store code verifier in local storage, for use in token check?
        window.localStorage.setItem('code_verifier', code_verifier);

        const authURL = getAuthorizationUrl(code_challenge)
        window.location.href = authURL;
    }

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
      <div className="md:w-[60%] w-[80%] bg-white rounded-md p-10 flex justify-center items-center">
        <button onClick={handleClick} className="drop-shadow-lg flex items-center justify-center gap-6 w-full bg-green-500 p-4 rounded-md hover:cursor-pointer text-white font-medium">
        <img src={spotify_logo} alt="spotify logo" className="w-12" />
          <span>Sign in with spotify</span></button>
      </div>
    </div>
  )
}
