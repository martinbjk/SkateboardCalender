// src/data/featured-videos.ts
//
// This is the ONLY file you need to edit to change videos.
// To swap a video: change `id` (the part after "v=" in the YouTube URL) and `title`.
// To update an intro: edit the `intro` string.
// To add/remove a video: add/remove an object from the array (any length works,
// the grid just reflows — you don't have to keep exactly 10).
//
// Example: for https://www.youtube.com/watch?v=EXeTwQWrcwY the id is "EXeTwQWrcwY"

export interface FeaturedVideo {
  id: string;      // YouTube video ID only (not the full URL)
  title: string;
  intro: string;
}

export const featuredVideos: FeaturedVideo[] = [
  {
    id: "EXeTwQWrcwY",
    title: "Video title 1",
    intro: "One or two sentences about who's in it and where it was filmed.",
  },
  {
    id: "zSWdZVtXT7E",
    title: "Video title 2",
    intro: "One or two sentences about who's in it and where it was filmed.",
  },
  {
    id: "s7EdQ4FqbhY",
    title: "Video title 3",
    intro: "One or two sentences about who's in it and where it was filmed.",
  },
  {
    id: "YoHD9XEInc0",
    title: "Video title 4",
    intro: "One or two sentences about who's in it and where it was filmed.",
  },
  {
    id: "sY1S34973zA",
    title: "Video title 5",
    intro: "One or two sentences about who's in it and where it was filmed.",
  },
  {
    id: "m8e-FF8MsqU",
    title: "Video title 6",
    intro: "One or two sentences about who's in it and where it was filmed.",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Video title 7",
    intro: "One or two sentences about who's in it and where it was filmed.",
  },
  {
    id: "V-_O7nl0Ii0",
    title: "Video title 8",
    intro: "One or two sentences about who's in it and where it was filmed.",
  },
  {
    id: "60ItHLz5WEA",
    title: "Video title 9",
    intro: "One or two sentences about who's in it and where it was filmed.",
  },
  {
    id: "fLexgOxsZu0",
    title: "Video title 10",
    intro: "One or two sentences about who's in it and where it was filmed.",
  },
];
