const kolo = Deno.args[0];
const rok = Deno.args[1];

const decoder = new TextDecoder("utf-8");

const data = await JSON.parse(
  decoder.decode(Deno.readFileSync(`./data/${rok}/okresy-${kolo}.json`))
);

const cleanData = data
  .map((okres: any) => {
    return okres.OBEC.map((obec: any) => {
      return {
        okres: okres["$"].NAZ_OKRES,
        CIS_OBEC: obec["$"].CIS_OBEC,
        NAZ_OBEC: obec["$"].NAZ_OBEC,
        TYP_OBEC: obec["$"].TYP_OBEC,
        HODN_KAND: obec.HODN_KAND,
        UCAST: obec.UCAST[0]["$"],
      };
    });
  })
  .flat();

// účasti

const result = cleanData
  // .filter((obec: any) => +obec.UCAST.ZAPSANI_VOLICI > 10000)
  .sort((a: any, b: any) => +a.UCAST.UCAST_PROC - +b.UCAST.UCAST_PROC);

// console.log(result.slice(0, 3));

// nejpodobnější výsledek

const celostatni2018 = [
  {
    CKAND: 1,
    name: "Mirek Topolánek",
    prvni: 4.3,
  },
  {
    CKAND: 2,
    name: "Michal Horáček",
    prvni: 9.18,
  },
  {
    CKAND: 3,
    name: "Pavel Fischer",
    prvni: 10.23,
  },
  {
    CKAND: 4,
    name: "Jiří Hynek",
    prvni: 1.23,
  },
  {
    CKAND: 5,
    name: "Petr Hannig",
    prvni: 0.56,
  },
  {
    CKAND: 6,
    name: "Vratislav Kulhánek",
    prvni: 0.47,
  },
  {
    CKAND: 7,
    name: "Miloš Zeman",
    prvni: 38.56,
  },
  {
    CKAND: 8,
    name: "Marek Hilšer",
    prvni: 8.83,
  },
  {
    CKAND: 9,
    name: "Jiří Drahoš",
    prvni: 26.6,
  },
];

const findSimilar = (obce, sample) => {
  return obce.map(obec => {
    return {
      ...obec,
      difference: computeDifference(
        obec.HODN_KAND,
        obec.UCAST.PLATNE_HLASY,
        sample
      ),
    };
  });
};

type Kandidati = { $: { PORADOVE_CISLO: string; HLASY: string } }[];

type Hlasy = string;

type Sample = { CKAND: number; name: string; prvni: number }[];

const computeDifference = (
  kandidati: Kandidati,
  hlasy: Hlasy,
  sample: Sample
) => {
  const result = sample.reduce((acc, curr) => {
    const zkoumanyKandidat = kandidati.find(
      kandidat => Number(kandidat.$.PORADOVE_CISLO) === curr.CKAND
    );
    const procentoHlasu = zkoumanyKandidat
      ? (Number(zkoumanyKandidat["$"].HLASY) / Number(hlasy)) * 100
      : 0;
    const rozdil = Math.abs(procentoHlasu - curr.prvni);

    return acc + rozdil;
  }, 0);
  return result;
};

const similar = findSimilar(cleanData, celostatni2018)
  .filter(obec => Number(obec.UCAST.ZAPSANI_VOLICI) < 1000)
  .sort((a: any, b: any) => a.difference - b.difference);

console.log(similar.slice(0, 3));

export {};
