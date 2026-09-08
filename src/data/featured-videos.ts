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
    id:" https://youtu.be/bV1b_-7zf-s?is=0VmLuIA0YrZxAK1T",
    title: "THE SEARCH FOR ANIMAL CHIN",
    intro: "Join the Bones Brigade – Tony Hawk, Rodney Mullen, Lance Mountain, Steve Caballero and the rest – on a wild quest for the legendary skateboarding master Animal Chin.",
  },
  {
    id: "https://youtube.com/watch?v=MNujEnJCt4E&is=t6vjxLVEtCIjVeSZ",
    title: "Santa Cruz Wheels of Fire",
    intro:"Santa Cruz Wheels of Fire från 1987 – en rå, energifylld skateklassiker med Jeff Kendall, Rob Roskopp och resten av gänget. Full av street, pools, downhill och ren 80-tals-attityd.",
  },
  {
    id: "https://youtu.be/pV98sz8px8I?is=lT7NVb5BGA0tEEeM",
    title: "Flip Extremely Sorry (2009)",
    intro: "Flip Extremely Sorry (2009) – one of the most acclaimed skate videos of all time. Geoff Rowley, Bob Burnquist, Shane Cross, Arto Saari and the rest of the star-studded team deliver pure magic.",
  },
  {
    id: "https://youtu.be/mhSRk4q0cbk?is=l5J_vxFh8hXQqaOE",
    title:" N-Men: The Untold Story",
    intro: "N-Men: The Untold Story (dir. James Sweigert) – the untold story of the underground Northern California crew that kept skateboarding alive. Featuring Tony Hawk, Steve Caballero & Tony Alva.",
  },
  {
    id: "https://youtu.be/DKh_Tf5sRLI?is=SiBsPCEd9a52dWDd",
    title: "Top Skateboarding Moments: 25 Years ",
    intro: "Top Skateboarding Moments: 25 Years of X – the greatest highlights from a quarter-century of X Games skateboarding. From Ryan Sheckler’s breakthrough to Danny Way’s massive Big Air",
  },
  {
    id: "https://youtu.be/7YKPEDayb_U?is=KYEyrzyoPqphHZHG",
    title: "Dogtown & Z-Boys (2001, dir. Stacy Peralta)",
    intro: "Dogtown & Z-Boys (2001, dir. Stacy Peralta) – the legendary documentary about the wild Venice Beach crew that reinvented skateboarding in the 1970s and gave birth to extreme sports.",
  },
  {
    id: "https://youtu.be/XA9q4cmh9j0?is=mHVN7yQtEPWrOdks",
    title: "Skateboard Kings (1978)",
    intro: "Skateboard Kings (1978) – the raw, original Dogtown documentary capturing Tony Alva, Stacy Peralta, Shogo Kubo and the early Z-Boys scene in its purest form.",
  },
  {
    id: "https://youtu.be/-2s_77ZoCHE?is=56sHalfRGCFbIjgN",
    title: "Keegan Palmer wins gold",
    intro: "Keegan Palmer wins gold again! 🇦🇺 Men’s Park Skateboarding highlights from Paris 2024 – the Australian repeats as Olympic champion with a flawless run.",
  },
  {
    id: "https://youtu.be/lHJ-0YOLJ_o?is=LHSPFofRWP5whRFF",
    title: "Arisa Trew becomes Australia’s youngest Olympic gold medallist ",
    intro: "Arisa Trew becomes Australia’s youngest Olympic gold medallist 🛹🥇 – the 14-year-old dominates Women’s Park Skateboarding at Paris 2024.",
  },
  {
    id: "https://youtu.be/mhSRk4q0cbk?is=l5J_vxFh8hXQqaOE",
    title: "H-Street Shackle Me Not (1988)",
    intro: "H-Street Shackle Me Not (1988) – the raw, groundbreaking video that changed skate videos forever. Matt Hensley, Danny Way, Tony Mag and the crew deliver pure 80s style, innovation and attitude.",
  },
];
