/**
 * Data för SurfToolsEmbed (artikeln "surf-forecast-sites-and-buoys-guide").
 *
 * Allt här kommer från artikelns egna källor — inget är påhittat. Länkarna
 * går till respektive organisations/sajts egen sida (startsida eller den
 * sida som artikeln citerar). `evidence: 'thin'` betyder att artikeln själv
 * markerar underlaget som tunt; verktyget visar det öppet för läsaren.
 */

export interface ToolLink {
  name: string;
  url: string;
  note: string;
}

export interface CoastEntry {
  id: string;
  name: string;
  group: 'Americas' | 'Europe' | 'Asia-Pacific and Africa' | 'Elsewhere';
  evidence: 'solid' | 'thin';
  summary: string;
  forecasts: ToolLink[];
  buoys: ToolLink[];
  cams: ToolLink[];
}

const SURFLINE: ToolLink = {
  name: 'Surfline',
  url: 'https://www.surfline.com',
  note: 'Human forecasters; Premium $119.99/yr on renewal'
};
const SURFLINE_CAMS: ToolLink = {
  name: 'Surfline cams',
  url: 'https://www.surfline.com/lp/feature-focus/surfline-cameras',
  note: '100+ Premium-only cams; rewind and Multi-Cam on Premium'
};
const SURF_FORECAST: ToolLink = {
  name: 'Surf-Forecast',
  url: 'https://www.surf-forecast.com',
  note: '7,000+ breaks; free tier, Premium $4.99/mo in US App Store'
};
const SURF_FORECAST_CAMS: ToolLink = {
  name: 'Surf-Forecast cam pages',
  url: 'https://www.surf-forecast.com',
  note: 'Links to cams owned by locals, nearby cams by distance'
};
const WINDGURU: ToolLink = {
  name: 'Windguru',
  url: 'https://www.windguru.cz',
  note: 'Free plus PRO; many models'
};
const WINDY: ToolLink = {
  name: 'Windy',
  url: 'https://www.windy.com',
  note: 'Free maps; free, ad-free webcams map'
};
const WINDY_CAMS: ToolLink = {
  name: 'Windy webcams map',
  url: 'https://www.windy.com',
  note: 'Free and ad-free'
};
const WINDFINDER_CAMS: ToolLink = {
  name: 'Windfinder webcams',
  url: 'https://www.windfinder.com',
  note: 'Image pages with a last-update time'
};
const NDBC: ToolLink = {
  name: 'NOAA NDBC',
  url: 'https://www.ndbc.noaa.gov',
  note: 'About 90 buoys plus coastal stations; free'
};
const SWELLNET: ToolLink = {
  name: 'Swellnet',
  url: 'https://www.swellnet.com',
  note: 'Free basic; Lite AUD 49.80/yr; Pro AUD 87.95/yr'
};

export const COASTS: CoastEntry[] = [
  {
    id: 'us-west',
    name: 'US West Coast',
    group: 'Americas',
    evidence: 'solid',
    summary:
      'CDIP buoys were built for directional height, period and direction. Pair them with a forecast site that has a human forecaster.',
    forecasts: [SURFLINE, SURF_FORECAST],
    buoys: [
      { name: 'CDIP (Scripps)', url: 'https://cdip.ucsd.edu', note: 'Since 1975; directional buoys' },
      NDBC
    ],
    cams: [SURFLINE_CAMS, WINDY_CAMS]
  },
  {
    id: 'us-east',
    name: 'US East Coast and Gulf',
    group: 'Americas',
    evidence: 'solid',
    summary:
      'NDBC has the broadest buoy network. We found no source ranking one forecast site over another here.',
    forecasts: [SURFLINE, SURF_FORECAST],
    buoys: [NDBC],
    cams: [SURFLINE_CAMS, WINDY_CAMS]
  },
  {
    id: 'hawaii',
    name: 'Hawaii',
    group: 'Americas',
    evidence: 'solid',
    summary:
      'A well-documented case of buoy-driven forecasting: NOAA buoys far to the northwest and northeast give early warning, and a University of Hawaii buoy off Waimea Bay shows what is about to arrive.',
    forecasts: [SURFLINE, SURF_FORECAST],
    buoys: [
      { ...NDBC, note: 'Buoys 51001, 51000 and 51100 watch for northern swell' },
      {
        name: 'NWS Honolulu surf forecast',
        url: 'https://mesonet.agron.iastate.edu/api/1/nwstext/201910290052-PHFO-FXHW52-SRDHFO',
        note: 'Text forecast product (example issue)'
      }
    ],
    cams: [
      {
        name: 'Hawaii Magazine webcam list',
        url: 'https://www.hawaiimagazine.com/?p=46202',
        note: 'Includes a Banzai Pipeline cam'
      },
      SURFLINE_CAMS
    ]
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    group: 'Europe',
    evidence: 'solid',
    summary: 'Cefas WaveNet is a good free source of real-time wave data around the UK.',
    forecasts: [SURFLINE, SURF_FORECAST, WINDGURU],
    buoys: [
      {
        name: 'Cefas WaveNet',
        url: 'https://www.cefas.co.uk/wavenet',
        note: 'Since 2002; directional Waverider buoys; free to view'
      }
    ],
    cams: [SURFLINE_CAMS, SURF_FORECAST_CAMS]
  },
  {
    id: 'ireland',
    name: 'Ireland',
    group: 'Europe',
    evidence: 'thin',
    summary:
      'The public buoy data covers only two sites (Galway Bay and off Belmullet), so lean more on forecast models and local cams.',
    forecasts: [SURF_FORECAST, WINDGURU],
    buoys: [
      {
        name: 'Marine Institute wave buoy network',
        url: 'https://data.gov.ie/dataset/wave-buoy-network',
        note: 'Two test sites; data from 2008'
      }
    ],
    cams: [SURF_FORECAST_CAMS, WINDFINDER_CAMS]
  },
  {
    id: 'france',
    name: 'France',
    group: 'Europe',
    evidence: 'solid',
    summary:
      'Candhis publishes wave data from about 99 measurement campaigns under an open licence. Two lighthouse buoys probably underestimate wave height.',
    forecasts: [WINDGURU, SURF_FORECAST],
    buoys: [
      {
        name: 'Candhis (Cerema)',
        url: 'https://candhis.cerema.fr',
        note: 'Open licence; 30 min to 3 h intervals'
      }
    ],
    cams: [
      {
        name: 'Surf-report.com',
        url: 'https://www.surf-report.com',
        note: 'French surf site with webcam content; coverage not verified'
      },
      SURF_FORECAST_CAMS
    ]
  },
  {
    id: 'spain',
    name: 'Spain',
    group: 'Europe',
    evidence: 'solid',
    summary:
      'Puertos del Estado runs 15 outer and 12 coastal buoys. Compare them with the forecast on Windguru or Surf-Forecast.',
    forecasts: [WINDGURU, SURF_FORECAST],
    buoys: [
      {
        name: 'Puertos del Estado',
        url: 'https://www.puertos.es',
        note: '15 outer buoys plus 12 coastal buoys'
      }
    ],
    cams: [
      {
        name: 'Windfinder, Conil de la Frontera',
        url: 'https://www.windfinder.com/webcams/conil_de_la_frontera',
        note: 'Example of Windfinder webcam pages in Spain'
      },
      SURF_FORECAST_CAMS
    ]
  },
  {
    id: 'portugal',
    name: 'Portugal',
    group: 'Europe',
    evidence: 'solid',
    summary:
      'The Hydrographic Institute runs two buoys at Nazaré, one oceanic and one coastal, and publicises their maintenance ahead of the big-wave season.',
    forecasts: [SURF_FORECAST, WINDGURU],
    buoys: [
      {
        name: 'Instituto Hidrográfico (Nazaré)',
        url: 'https://www.hidrografico.pt/en/news/noticias-do-antigo-site/multiparametric-buoys-of-nazare-ready-for-the-bigwave/',
        note: 'Two buoys; waves, currents, temperature'
      }
    ],
    cams: [
      {
        name: 'Playocean',
        url: 'https://www.playocean.net/en/cameras/praia-de-sao-torpes-beach',
        note: 'Cams listed on Surf-Forecast near Lisbon'
      },
      { name: 'Surf Total', url: 'https://surftotal.com', note: 'Cams near Lisbon and Ericeira' },
      SURF_FORECAST_CAMS
    ]
  },
  {
    id: 'sweden',
    name: 'Sweden',
    group: 'Europe',
    evidence: 'solid',
    summary:
      'SMHI buoys at Väderöarna and Brofjorden are in the Skagerrak. None of the five SMHI positions we could read is in the Kattegat, so for Kattegat surf rely on models and the nearest Skagerrak buoys.',
    forecasts: [WINDGURU, SURF_FORECAST],
    buoys: [
      {
        name: 'SMHI wave buoys',
        url: 'https://www.smhi.se/kunskapsbanken/oceanografi/matningar-i-havet/vagbojar',
        note: 'Väderöarna, Brofjorden, Knolls grund, Finngrundet, Huvudskär Ost'
      }
    ],
    cams: [SURF_FORECAST_CAMS, WINDFINDER_CAMS]
  },
  {
    id: 'norway',
    name: 'Norway',
    group: 'Europe',
    evidence: 'thin',
    summary:
      'MET Norway publishes model wave forecasts, including a high-resolution coastal model (WAM-800m). We did not find a public Norwegian buoy network to pair it with.',
    forecasts: [WINDGURU, SURF_FORECAST],
    buoys: [
      {
        name: 'MET Norway ocean forecasts',
        url: 'https://ocean.met.no/',
        note: 'Models only: WAM-800m, Nordic Seas WaveWatch III'
      }
    ],
    cams: [SURF_FORECAST_CAMS, WINDFINDER_CAMS]
  },
  {
    id: 'australia',
    name: 'Australia',
    group: 'Asia-Pacific and Africa',
    evidence: 'solid',
    summary:
      'Swellnet is a local specialist with forecaster notes, and buoy data from several agencies is published through the Australian Ocean Data Network.',
    forecasts: [SWELLNET, SURFLINE],
    buoys: [
      {
        name: 'Australian Ocean Data Network wave buoys',
        url: 'https://registry.opendata.aws/aodn_wave_buoy_realtime_nonqc/',
        note: 'Manly Hydraulics Lab, BoM, state agencies; mostly hourly'
      }
    ],
    cams: [
      { ...SWELLNET, name: 'Swellnet Pro cams', note: 'No-timeout cams, replays, ad-free' },
      SURFLINE_CAMS
    ]
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    group: 'Asia-Pacific and Africa',
    evidence: 'thin',
    summary:
      'Thin evidence. Stormsurf lists the Wavescape surf report and a NOAA Wavewatch III bulletin for the Agulhas area, but that list is old and some links may not be current.',
    forecasts: [
      {
        name: 'Wavescape',
        url: 'https://www.wavescape.co.za',
        note: 'Local surf report and forecast, per Stormsurf list'
      },
      SURF_FORECAST
    ],
    buoys: [
      {
        name: 'Stormsurf South Africa links',
        url: 'https://stormsurf.com/page2/links/safrsrprt.shtml',
        note: 'Wavewatch III bulletin for the Agulhas area; list is old'
      }
    ],
    cams: [SURF_FORECAST_CAMS]
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    group: 'Asia-Pacific and Africa',
    evidence: 'thin',
    summary:
      'Thin evidence. MetService has surf location pages, but we could not read their content and did not confirm a buoy source.',
    forecasts: [
      {
        name: 'MetService surf pages',
        url: 'https://www.metservice.com/marine/regions/northland/surf/locations/sandy-bay',
        note: 'Example surf location page; content not verified'
      },
      SURF_FORECAST
    ],
    buoys: [],
    cams: [SURF_FORECAST_CAMS]
  },
  {
    id: 'other',
    name: 'Everywhere else (tropics, Indonesia, Brazil, Japan)',
    group: 'Elsewhere',
    evidence: 'thin',
    summary:
      'We found no source on public buoy coverage here. You are mostly reading models, so check whether a Sofar Spotter buoy happens to be nearby.',
    forecasts: [SURF_FORECAST, WINDGURU, WINDY],
    buoys: [
      {
        name: 'Sofar Spotter archive',
        url: 'https://www.sofarocean.com/mx/sofar-spotter-archive',
        note: 'Network of about 400-500 buoys; free archive 2019 to March 2022'
      }
    ],
    cams: [SURF_FORECAST_CAMS, WINDY_CAMS]
  }
];
