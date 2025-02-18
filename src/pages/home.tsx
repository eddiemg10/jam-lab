import { useEffect, useState } from "react";
import { getUserProfile, UserProfile } from "../spotify/profile";
import { useSpotifyAPI } from "../hooks/useSpotifyApi";

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const userProfileP = useSpotifyAPI(getUserProfile);

  // FIXME: Early return

  // TODO: Refresh the access token if it has expired
  useEffect(() => {
    const fetchUserProfile = async () => {
      userProfileP
        .then((res) => {
          setUserProfile(res);
        })
        .catch((_) => {
          //TODO: Figure out how to handle this
        });
    };
    fetchUserProfile();
  }, []);
  //TODO: Add a way to log out via UI
  return (
    <>
      {userProfile && (
        <div>
          <div className="flex w-full py-5 items-center justify-between">
            <h1 className="md:text-5xl text-3xl font-medium text-yellow-100 motion-preset-oscillate-sm">
              Jam Lab
            </h1>
            <a
              href={userProfile.uri}
              target="_blank"
              className="hover:motion-translate-y-loop-25 motion-loop-once flex items-center gap-x-3 bg-jam-surface/25 hover:bg-jam-surface/20 duration-200 rounded-md py-1 px-10"
            >
              <img
                className="w-11 rounded-full"
                src={userProfile.images[0].url}
                alt="user"
              />
              <h1 className="text-white">{userProfile.display_name}</h1>
            </a>
          </div>

          <div className="flex items-center justify-center h-[40vh] mt-20 bg-jam-surface/20 rounded-md">
            <div className="text-white motion-preset-typewriter-[11]">
              coming soon
            </div>
          </div>
        </div>
      )}
    </>
  );
}
