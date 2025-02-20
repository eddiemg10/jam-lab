// User's top artists and songs on Spotify

import axios from "axios";
import { z } from "zod";

type TopItem = "artists" | "tracks";

const Artist = z.object({
  external_urls: z.object({ spotify: z.string() }),
  followers: z.object({ href: z.string().nullable(), total: z.number() }),
  genres: z.array(z.string()),
  href: z.string(),
  id: z.string(),
  images: z.array(
    z.object({ height: z.number(), url: z.string(), width: z.number() }),
  ),
  name: z.string(),
  popularity: z.number(),
  type: z.string(),
  uri: z.string(),
});
export type Artist = z.infer<typeof Artist>;

const Track = z.object({
  album: z.object({
    album_type: z.string(),
    artists: z.array(Artist),
    available_markets: z.array(z.string()),
    external_urls: z.object({ spotify: z.string() }),
    href: z.string(),
    id: z.string(),
    images: z.array(
      z.object({ height: z.number(), url: z.string(), width: z.number() }),
    ),
    name: z.string(),
    release_date: z.string(),
    release_date_precision: z.string(),
    total_tracks: z.number(),
    type: z.string(),
    uri: z.string(),
  }),
  artists: z.array(Artist),
  disc_number: z.number(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_ids: z.object({ isrc: z.string() }),
  external_urls: z.object({ spotify: z.string() }),
  href: z.string(),
  id: z.string(),
  is_local: z.boolean(),
  name: z.string(),
  popularity: z.number(),
  preview_url: z.string().nullable(),
  track_number: z.number(),
  type: z.string(),
  uri: z.string(),
});
export type Track = z.infer<typeof Track>;

const endpointBuilder = (type: TopItem, limit: number, timeRange: string) =>
  `https://api.spotify.com/v1/me/top/${type}?limit=${limit}&time_range=${timeRange}`;

const getTopItemsForUser = async (
  accessToken: string,
  type: TopItem,
  limit: number,
  timeRange: string,
): Promise<[Artist | Track]> => {
  const response = await axios.get(endpointBuilder(type, limit, timeRange), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 200) {
    switch (type) {
      case "artists":
        try {
          Artist.array().parse(response.data.items);
        } catch (_) {
          // console.error("Error parsing artists response")
        }
        break;
      case "tracks":
        try {
          Track.array().parse(response.data.items);
        } catch (_) {
          // console.error("Error parsing tracks response")
        }
        break;
    }
    return response.data.items;
  } else {
    throw new Error("Got error with token: " + accessToken);
  }
};

// Fetch users top artist for the month
const fetchTopArtistForMonth = async (accessToken: string) => {
  return getTopItemsForUser(accessToken, "artists", 1, "short_term");
};

// Fetch top 5 artists for the year
const fetchTopArtistsForYear = async (accessToken: string) => {
  return getTopItemsForUser(accessToken, "artists", 5, "long_term");
};

// Fetch top 5 tracks for the month
const fetchTopTracksForMonth = async (accessToken: string) => {
  return getTopItemsForUser(accessToken, "tracks", 5, "short_term");
};

// Fetcg top 5 tracks for the year
const fetchTopTracksForYear = async (accessToken: string) => {
  return getTopItemsForUser(accessToken, "tracks", 5, "long_term");
};

export {
  getTopItemsForUser,
  fetchTopArtistForMonth,
  fetchTopArtistsForYear,
  fetchTopTracksForMonth,
  fetchTopTracksForYear,
};
