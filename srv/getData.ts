import xml2js from "https://esm.sh/xml2js@0.4.23";
import { dsvFormat } from "https://esm.sh/d3-dsv@3.0.1";

const decoder = new TextDecoder("utf-8");

const nutsRaw = await Deno.readFile("./data/cnumnuts.csv");
const nuts = dsvFormat(";").parse(decoder.decode(nutsRaw));
const krajeNuts = nuts.filter(item => item.NUTS?.length === 5);

if (Deno.args[0] === "obce") {
  const urlBase = "http://www.volby.cz/pls/prez2018/vysledky_kraj?kolo=1&nuts=";
  let result: any[] = [];

  for (const kraj of krajeNuts) {
    const url = `${urlBase}${kraj.NUTS}`;
    const res = await fetch(url);
    const body = await res.text();
    xml2js.parseString(body, (error, krajData) => {
      if (error) {
        console.log(error);
      }
      result = [...result, krajData.VYSLEDKY_KRAJ.KRAJ[0].OKRES];
      console.log(kraj.NAZEVNUTS);
    });
  }
  await Deno.writeTextFile("./data/okresy.json", JSON.stringify(result));
}
