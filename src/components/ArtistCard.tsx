import { Artist } from "../spotify/top"

function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <div className="flex items-center gap-3">
        <img className="w-11 rounded-full" src={artist.images[0].url}/>
        <p className="font-thin">{artist.name}</p>
    </div>
  )
}

export default ArtistCard