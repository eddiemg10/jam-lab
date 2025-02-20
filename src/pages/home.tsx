import { useEffect, useState } from "react";
import { getUserProfile, UserProfile } from "../spotify/profile";
import { useSpotifyAPI } from "../hooks/useSpotifyApi";
import { Artist, fetchTopArtistForMonth, fetchTopArtistsForYear, fetchTopTracksForMonth, fetchTopTracksForYear, getTopItemsForUser, Track } from "../spotify/top";
import ArtistCard from "../components/ArtistCard";
import SongCard from "../components/SongCard";
import Divider from "../components/Divider";

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [topArtistLastMonth, settopArtistLastMonth] = useState<Artist | null>(null);
  const [topArtistsLastYear, settopArtistsLastYear] = useState<[Artist] | null>(null);
  const [topSongsLastMonth, settopSongsLastMonth] = useState<[Track] | null>(null);
  const [topSongsLastYear, settopSongsLastYear] = useState<[Track] | null>(null);

  const userProfileP = useSpotifyAPI(getUserProfile);
  const topArtistLastMonthP = useSpotifyAPI(fetchTopArtistForMonth);
  const topArtistsLastYearP = useSpotifyAPI(fetchTopArtistsForYear);
  const topSongsLastMonthP = useSpotifyAPI(fetchTopTracksForMonth);
  const topSongsLastYearP = useSpotifyAPI(fetchTopTracksForYear);

  // FIXME: Early return

  // TODO: Refresh the access token if it has expired
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Get the user profile
      userProfileP
        .then((res) => {  
          setUserProfile(res);
        })
        .catch((_) => {});

      // Get the top artist for the last month
      topArtistLastMonthP
        .then((res) => {
          settopArtistLastMonth(res[0]);
          console.log(res);
        })
        .catch((_) => {});
      
      // Get the top artists for the last year
      topArtistsLastYearP
        .then((res) => {
          settopArtistsLastYear(res);
        })
        .catch((_) => {});
      
      // Get the top songs for the last month
      topSongsLastMonthP
        .then((res) => {
          settopSongsLastMonth(res);
        })
        .catch((_) => {});

      // Get the top songs for the last year
      topSongsLastYearP
        .then((res) => {
          settopSongsLastYear(res);
        })
        .catch((_) => {});
      
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

          <div className="flex md:flex-nowrap flex-wrap text-white gap-5 justify-center items-stretch min-h-[60vh] mt-20 w-full">
            <div className="flex p-8 flex-col md:w-[30%] w-full bg-jam-surface/20 rounded-md">
              <h2 className="text-white text-xl text-center mb-5"> Your top Artists</h2>
              <h3 className="text-yellow-100 font-medium text-sm">Last Month</h3>
              <div className="pl-2 my-3">
                {topArtistLastMonth && <ArtistCard artist={topArtistLastMonth} />}
              </div>
              <h3 className="text-yellow-100 font-medium text-sm">Last Year</h3>
              
              <div className="pl-2 my-3 flex flex-col gap-1">
                {topArtistsLastYear &&
                  topArtistsLastYear.map((artist) => (
                    <ArtistCard artist={artist} key={artist.id} />
                  ))}
              </div>
            </div>
            <div className="flex flex-col p-8 md:w-[70%] w-full items-center bg-jam-surface/20 rounded-md">
              <h2 className="text-white text-xl text-center mb-5"> Your top Songs</h2>
              <div className="flex sm:flex-row flex-col w-full gap-3">
                
                <div className="flex flex-1 flex-col">
                  <h3 className="ml-4 text-yellow-100 font-medium text-sm">Last Month</h3>
                  <div className="my-3 flex flex-col gap-3">
                    <Divider />
                    {topSongsLastMonth &&
                      topSongsLastMonth.map((track) => (
                        <>
                          <SongCard track={track} key={track.id} />
                          <Divider />
                        </>
                      ))}
                  </div>  
                </div>

                <div className="flex flex-1 flex-col">
                  <h3 className="ml-4 text-yellow-100 font-medium text-sm">Last Year</h3>
                  <div className="my-3 flex flex-col gap-3">
                  <Divider />
                    {topSongsLastYear &&
                      topSongsLastYear.map((track) => (
                        <>
                          <SongCard track={track} key={track.id} />
                          <Divider />
                        </>
                      ))}
                  </div>
                </div>
              </div> 
            </div>
          </div>
        </div>
      )}
    </>
  );
}
