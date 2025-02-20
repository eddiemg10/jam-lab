import { Track } from "../spotify/top"

function SongCard({track}:{track: Track}) {
  return (
    <div className="flex items-center gap-3">
        <img className="w-11 rounded-md" src={track.album.images[0].url} />
        <div>
            <p className="text-sm">{track.name}</p>
            <div className="font-thin text-xs">{
                track.artists.map((artist) => artist.name).join(", ")
            }</div>
        </div>
    </div>
  )
}

export default SongCard