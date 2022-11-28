import xml2js from "https://esm.sh/xml2js@0.4.23";
import { dsvFormat, tsvFormat } from "https://esm.sh/d3-dsv@3.0.1";

const kolo = Deno.args[1];
const rok = Deno.args[2];

const decoder = new TextDecoder("utf-8");

const nutsRaw = await Deno.readFile(`./data/${rok}/cnumnuts.csv`);
const nuts = dsvFormat(";").parse(decoder.decode(nutsRaw));
const krajeNuts = nuts.filter(item => item.NUTS?.length === 5);

if (Deno.args[0] === "obce") {
  const urlBase = `http://www.volby.cz/pls/prez${rok}/vysledky_kraj?kolo=${kolo}&nuts=`;
  let result: any[] = [];

  for (const kraj of krajeNuts) {
    const url = `${urlBase}${kraj.NUTS}`;
    console.log(url);
    const res = await fetch(url);
    const body = await res.text();
    xml2js.parseString(body, (error, krajData) => {
      if (error) {
        console.log(error);
      }
      result = [...result, ...krajData.VYSLEDKY_KRAJ.KRAJ[0].OKRES];
      console.log(kraj.NAZEVNUTS);
    });
  }
  //   await Deno.writeTextFile(
  //     `./data/${rok}/okresy-${kolo}.json`,
  //     JSON.stringify(result)
  //   );

  const cleanData = result
    .map((okres: any) => {
      return okres.OBEC.map((obec: any) => {
        const kandidati = obec.HODN_KAND.reduce((object, kandidat) => {
          return {
            ...object,
            [`kand-${kandidat.$.PORADOVE_CISLO}`]: kandidat.$.HLASY,
          };
        }, {});

        return {
          OKRES: okres["$"].NAZ_OKRES,
          NUTS_OKRES: okres["$"].NUTS_OKRES,
          CIS_OBEC: obec["$"].CIS_OBEC,
          NAZ_OBEC: obec["$"].NAZ_OBEC,
          TYP_OBEC: obec["$"].TYP_OBEC,
          ...obec.UCAST[0]["$"],
          ...kandidati,
        };
      });
    })
    .flat();

  await Deno.writeTextFile(
    `./public/${rok}/obce-${kolo}.tsv`,
    tsvFormat(cleanData)
  );
}

export {};
