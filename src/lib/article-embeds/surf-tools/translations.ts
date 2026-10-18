/**
 * Svenska texter för SurfToolsEmbed. Nyckeln är den engelska originaltexten i
 * coast-data.ts; saknas en nyckel visas engelskan (fallback), så inget kan
 * gå sönder om en text läggs till i coast-data.ts utan översättning.
 * Egennamn (Surfline, Windguru, CDIP ...) och länkar är oförändrade.
 */

export type EmbedLocale = 'sv' | 'en';

export const SV_TEXT: Record<string, string> = {
  // Grupper
  Americas: 'Amerika',
  Europe: 'Europa',
  'Asia-Pacific and Africa': 'Asien-Stillahavsregionen och Afrika',
  Elsewhere: 'Övriga världen',

  // Kustnamn
  'US West Coast': 'USA:s västkust',
  'US East Coast and Gulf': 'USA:s ostkust och Mexikanska golfen',
  Hawaii: 'Hawaii',
  'United Kingdom': 'Storbritannien',
  Ireland: 'Irland',
  France: 'Frankrike',
  Spain: 'Spanien',
  Portugal: 'Portugal',
  Sweden: 'Sverige',
  Norway: 'Norge',
  Australia: 'Australien',
  'South Africa': 'Sydafrika',
  'New Zealand': 'Nya Zeeland',
  'Everywhere else (tropics, Indonesia, Brazil, Japan)': 'Överallt annars (tropikerna, Indonesien, Brasilien, Japan)',

  // Sammanfattningar
  'CDIP buoys were built for directional height, period and direction. Pair them with a forecast site that has a human forecaster.':
    'CDIP:s bojar byggdes för riktningsmätning av höjd, period och riktning. Para ihop dem med en prognossajt som har en mänsklig prognosmakare.',
  'NDBC has the broadest buoy network. We found no source ranking one forecast site over another here.':
    'NDBC har det bredaste bojnätverket. Vi hittade ingen källa som rankar en prognossajt över en annan här.',
  'A well-documented case of buoy-driven forecasting: NOAA buoys far to the northwest and northeast give early warning, and a University of Hawaii buoy off Waimea Bay shows what is about to arrive.':
    'Ett väldokumenterat fall av bojdriven prognosmakning: NOAA:s bojar långt i nordväst och nordost ger tidig varning, och en boj från University of Hawaii utanför Waimea Bay visar vad som är på väg in.',
  'Cefas WaveNet is a good free source of real-time wave data around the UK.':
    'Cefas WaveNet är en bra gratiskälla för vågdata i realtid runt Storbritannien.',
  'The public buoy data covers only two sites (Galway Bay and off Belmullet), so lean more on forecast models and local cams.':
    'De offentliga bojdatan täcker bara två platser (Galway Bay och utanför Belmullet), så förlita dig mer på prognosmodeller och lokala kameror.',
  'Candhis publishes wave data from about 99 measurement campaigns under an open licence. Two lighthouse buoys probably underestimate wave height.':
    'Candhis publicerar vågdata från ungefär 99 mätkampanjer under öppen licens. Två fyrbojar underskattar sannolikt våghöjden.',
  'Puertos del Estado runs 15 outer and 12 coastal buoys. Compare them with the forecast on Windguru or Surf-Forecast.':
    'Puertos del Estado driver 15 bojar utomskärs och 12 kustbojar. Jämför dem med prognosen på Windguru eller Surf-Forecast.',
  'The Hydrographic Institute runs two buoys at Nazaré, one oceanic and one coastal, and publicises their maintenance ahead of the big-wave season.':
    'Hydrografiska institutet driver två bojar vid Nazaré, en oceanisk och en kustnära, och kungör deras underhåll inför storvågssäsongen.',
  'SMHI buoys at Väderöarna and Brofjorden are in the Skagerrak. None of the five SMHI positions we could read is in the Kattegat, so for Kattegat surf rely on models and the nearest Skagerrak buoys.':
    'SMHI:s bojar vid Väderöarna och Brofjorden ligger i Skagerrak. Ingen av de fem SMHI-positioner vi kunde läsa ligger i Kattegatt, så för surf i Kattegatt får du förlita dig på modeller och de närmaste bojarna i Skagerrak.',
  'MET Norway publishes model wave forecasts, including a high-resolution coastal model (WAM-800m). We did not find a public Norwegian buoy network to pair it with.':
    'MET Norway publicerar vågprognoser från modeller, bland annat en högupplöst kustmodell (WAM-800m). Vi hittade inget offentligt norskt bojnätverk att para ihop den med.',
  'Swellnet is a local specialist with forecaster notes, and buoy data from several agencies is published through the Australian Ocean Data Network.':
    'Swellnet är en lokal specialist med anteckningar från prognosmakare, och bojdata från flera myndigheter publiceras via Australian Ocean Data Network.',
  'Thin evidence. Stormsurf lists the Wavescape surf report and a NOAA Wavewatch III bulletin for the Agulhas area, but that list is old and some links may not be current.':
    'Tunt underlag. Stormsurf listar surfrapporten från Wavescape och ett NOAA Wavewatch III-bulletin för Agulhas-området, men listan är gammal och vissa länkar kan vara inaktuella.',
  'Thin evidence. MetService has surf location pages, but we could not read their content and did not confirm a buoy source.':
    'Tunt underlag. MetService har sidor för surfplatser, men vi kunde inte läsa deras innehåll och bekräftade ingen bojkälla.',
  'We found no source on public buoy coverage here. You are mostly reading models, so check whether a Sofar Spotter buoy happens to be nearby.':
    'Vi hittade ingen källa om offentlig bojtäckning här. Du läser mest modeller, så kolla om det råkar finnas en Sofar Spotter-boj i närheten.',

  // Länknamn som bör översättas
  'Surfline cams': 'Surflines kameror',
  'Surf-Forecast cam pages': 'Surf-Forecasts kamerasidor',
  'Windy webcams map': 'Windys kamerakarta',
  'Windfinder webcams': 'Windfinders webbkameror',
  'NWS Honolulu surf forecast': 'NWS Honolulu, surfprognos',
  'Hawaii Magazine webcam list': 'Hawaii Magazines kameralista',
  'Marine Institute wave buoy network': 'Marine Institutes vågbojsnätverk',
  'Windfinder, Conil de la Frontera': 'Windfinder, Conil de la Frontera',
  'SMHI wave buoys': 'SMHI:s vågbojar',
  'MET Norway ocean forecasts': 'MET Norways havsprognoser',
  'Australian Ocean Data Network wave buoys': 'Australian Ocean Data Networks vågbojar',
  'Swellnet Pro cams': 'Swellnet Pro-kameror',
  'Stormsurf South Africa links': 'Stormsurf, länkar för Sydafrika',
  'MetService surf pages': 'MetServices surfsidor',
  'Sofar Spotter archive': 'Sofar Spotter-arkivet',

  // Länkanteckningar
  'Human forecasters; Premium $119.99/yr on renewal': 'Mänskliga prognosmakare; Premium 119,99 USD/år vid förnyelse',
  '100+ Premium-only cams; rewind and Multi-Cam on Premium': '100+ kameror bara för Premium; rewind och Multi-Cam i Premium',
  '7,000+ breaks; free tier, Premium $4.99/mo in US App Store': 'Över 7 000 breaks; gratisnivå, Premium 4,99 USD/mån i amerikanska App Store',
  'Links to cams owned by locals, nearby cams by distance': 'Länkar till lokalt ägda kameror, närliggande efter avstånd',
  'Free plus PRO; many models': 'Gratis plus PRO; många modeller',
  'Free maps; free, ad-free webcams map': 'Gratis kartor; gratis och reklamfri kamerakarta',
  'Free and ad-free': 'Gratis och reklamfri',
  'Image pages with a last-update time': 'Bildsidor med tid för senaste uppdatering',
  'About 90 buoys plus coastal stations; free': 'Ungefär 90 bojar plus kuststationer; gratis',
  'Free basic; Lite AUD 49.80/yr; Pro AUD 87.95/yr': 'Gratis basnivå; Lite 49,80 AUD/år; Pro 87,95 AUD/år',
  'Since 1975; directional buoys': 'Sedan 1975; bojar med riktningsmätning',
  'Buoys 51001, 51000 and 51100 watch for northern swell': 'Bojarna 51001, 51000 och 51100 bevakar nordlig dyning',
  'Text forecast product (example issue)': 'Textprognos (exempelutgåva)',
  'Includes a Banzai Pipeline cam': 'Inkluderar en kamera vid Banzai Pipeline',
  'Since 2002; directional Waverider buoys; free to view': 'Sedan 2002; Waverider-bojar med riktningsmätning; gratis att se',
  'Two test sites; data from 2008': 'Två teststationer; data från 2008',
  'Open licence; 30 min to 3 h intervals': 'Öppen licens; intervall från 30 min till 3 h',
  'French surf site with webcam content; coverage not verified': 'Fransk surfsajt med kamerainnehåll; täckning ej verifierad',
  '15 outer buoys plus 12 coastal buoys': '15 bojar utomskärs plus 12 kustbojar',
  'Example of Windfinder webcam pages in Spain': 'Exempel på Windfinders kamerasidor i Spanien',
  'Two buoys; waves, currents, temperature': 'Två bojar; vågor, strömmar, temperatur',
  'Cams listed on Surf-Forecast near Lisbon': 'Kameror listade på Surf-Forecast nära Lissabon',
  'Cams near Lisbon and Ericeira': 'Kameror nära Lissabon och Ericeira',
  'Väderöarna, Brofjorden, Knolls grund, Finngrundet, Huvudskär Ost': 'Väderöarna, Brofjorden, Knolls grund, Finngrundet, Huvudskär Ost',
  'Models only: WAM-800m, Nordic Seas WaveWatch III': 'Bara modeller: WAM-800m, WaveWatch III för Nordiska havet',
  'Manly Hydraulics Lab, BoM, state agencies; mostly hourly': 'Manly Hydraulics Lab, BoM, delstatliga myndigheter; mest timdata',
  'No-timeout cams, replays, ad-free': 'Kameror utan tidsgräns, återspelning, reklamfritt',
  'Local surf report and forecast, per Stormsurf list': 'Lokal surfrapport och prognos, enligt Stormsurfs lista',
  'Wavewatch III bulletin for the Agulhas area; list is old': 'Wavewatch III-bulletin för Agulhas-området; listan är gammal',
  'Example surf location page; content not verified': 'Exempel på surfplatssida; innehåll ej verifierat',
  'Network of about 400-500 buoys; free archive 2019 to March 2022': 'Nätverk på ungefär 400–500 bojar; gratis arkiv 2019 till mars 2022'
};

export function tr(text: string, locale: EmbedLocale): string {
  return locale === 'sv' ? SV_TEXT[text] ?? text : text;
}

export interface EmbedUi {
  sectionLabel: string;
  tryIt: string;
  intro: string;
  findTitle: string;
  findIntro: string;
  chooseCoastSr: string;
  chooseCoast: string;
  thin: string;
  forecasts: string;
  buoys: string;
  webcams: string;
  none: string;
  calcTitle: string;
  calcIntro: string;
  presets: [string, string, string];
  period: string;
  distance: string;
  unit: string;
  unitNm: string;
  unitKm: string;
  unitMi: string;
  readingTime: string;
  about: string;
  speed: string;
  knots: string;
  over: string;
  nauticalMiles: string;
  eta: string;
  sameDay: string;
  nextDay: string;
  plusDays: (n: number) => string;
  invalid: string;
  otherPeriods: string;
  longerFirst: string;
  rule: string;
  hour: string;
  minute: string;
}

export const UI: Record<EmbedLocale, EmbedUi> = {
  en: {
    sectionLabel: 'Surf forecast tools',
    tryIt: 'Try it',
    intro:
      'Two small tools built from the data in this article. They do not fetch live buoy readings, so they cannot show out-of-date numbers.',
    findTitle: 'Find your tools',
    findIntro: 'Pick your coast and get a forecast site, a buoy source and a webcam source from this article.',
    chooseCoastSr: 'Choose a coast',
    chooseCoast: 'Choose a coast…',
    thin: 'Thinner evidence: treat this as a starting point, not a recommendation we tested.',
    forecasts: 'Forecast sites',
    buoys: 'Buoy data',
    webcams: 'Webcams',
    none: 'None confirmed.',
    calcTitle: 'When does the swell arrive?',
    calcIntro:
      'Enter the swell period on an upstream buoy and the distance from that buoy to your coast. Group speed is 1.5 × period, in knots (deep water).',
    presets: ['Hawaii: NOAA 51001, 17 s', 'Hawaii: NOAA 51001, 20 s', '400 nm out, 12 s'],
    period: 'Swell period (s)',
    distance: 'Distance to coast',
    unit: 'Unit',
    unitNm: 'nautical miles',
    unitKm: 'kilometres',
    unitMi: 'miles',
    readingTime: 'Buoy reading time (optional, your local time)',
    about: 'About',
    speed: 'Speed',
    knots: 'knots',
    over: 'over',
    nauticalMiles: 'nautical miles',
    eta: 'Estimated arrival',
    sameDay: 'same day',
    nextDay: 'next day',
    plusDays: (n) => `+${n} days`,
    invalid: 'Enter a period and a distance above zero.',
    otherPeriods: 'Same distance, other periods',
    longerFirst:
      'Longer periods arrive first, so the longest-period energy shows up on your coast before the rest of the swell.',
    rule: 'Rule of thumb for deep water (SurferToday, Wikipedia). Real arrival depends on swell direction, shelter and where the buoy sits.',
    hour: 'h',
    minute: 'min'
  },
  sv: {
    sectionLabel: 'Verktyg för surfprognoser',
    tryIt: 'Testa själv',
    intro:
      'Två små verktyg byggda på uppgifterna i den här artikeln. De hämtar inga bojavläsningar i realtid, så de kan inte visa inaktuella siffror.',
    findTitle: 'Hitta dina verktyg',
    findIntro: 'Välj din kust och få en prognossajt, en bojkälla och en kamerakälla från den här artikeln.',
    chooseCoastSr: 'Välj en kust',
    chooseCoast: 'Välj en kust…',
    thin: 'Tunnare underlag: se det som en startpunkt, inte en rekommendation vi har testat.',
    forecasts: 'Prognossajter',
    buoys: 'Bojdata',
    webcams: 'Webbkameror',
    none: 'Inget bekräftat.',
    calcTitle: 'När kommer dyningen?',
    calcIntro:
      'Ange dyningens period på en uppströmsboj och avståndet från den bojen till din kust. Gruppens hastighet är 1,5 × period, i knop (djupt vatten).',
    presets: ['Hawaii: NOAA 51001, 17 s', 'Hawaii: NOAA 51001, 20 s', '400 nm ut, 12 s'],
    period: 'Dyningsperiod (s)',
    distance: 'Avstånd till kusten',
    unit: 'Enhet',
    unitNm: 'nautiska mil',
    unitKm: 'kilometer',
    unitMi: 'engelska mil',
    readingTime: 'Tid för bojavläsningen (valfritt, din lokala tid)',
    about: 'Ungefär',
    speed: 'Hastighet',
    knots: 'knop',
    over: 'över',
    nauticalMiles: 'nautiska mil',
    eta: 'Beräknad ankomst',
    sameDay: 'samma dag',
    nextDay: 'nästa dag',
    plusDays: (n) => `+${n} dygn`,
    invalid: 'Ange en period och ett avstånd över noll.',
    otherPeriods: 'Samma avstånd, andra perioder',
    longerFirst:
      'Längre perioder kommer först, så energin med längst period dyker upp på din kust före resten av dyningen.',
    rule: 'Tumregel för djupt vatten (SurferToday, Wikipedia). Verklig ankomst beror på dyningens riktning, skydd och var bojen ligger.',
    hour: 'h',
    minute: 'min'
  }
};
