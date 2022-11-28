import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SelectBox, ButtonSwitch, RangeSlider, Table } from "../components";
import { tsvParse, dsvFormat } from "d3-dsv";

const years = [
  { id: 1, value: "2013" },
  { id: 2, value: "2018" },
];

const fetchData = async (context: { queryKey: any[] }) => {
  if (context.queryKey[0] === "kandidati") {
    const ssv = dsvFormat(";");
    const urlDetail = `${context.queryKey[1].value}/perk.csv`;
    const data = await fetch(`https://data.irozhlas.cz/prez/${urlDetail}`)
      .then(res => res.text())
      .then(res => ssv.parse(res));
    return data;
  }
  if (context.queryKey[0] === "vysledky") {
    const urlDetail = `${context.queryKey[1].value}/obce-${context.queryKey[2]}.tsv`;
    const data = await fetch(`https://data.irozhlas.cz/prez/${urlDetail}`)
      .then(res => res.text())
      .then(res => tsvParse(res));
    return data;
  }
};

const Basty = () => {
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
  const [selectedCandidate, setSelectedCandidate] = useState({
    id: 0,
    value: "",
    secondRound: false,
  });
  const [cleanCandidates, setCleanCandidates] = useState([]);
  const [selectedRound, setSelectedRound] = useState(1);
  const [popLimit, setPopLimit] = useState(1000);
  const [finalResult, setFinalResult] = useState([]);

  const candidates = useQuery({
    queryKey: ["kandidati", selectedYear],
    queryFn: fetchData,
  });

  const results = useQuery({
    queryKey: ["vysledky", selectedYear, selectedRound],
    queryFn: fetchData,
  });

  useEffect(() => {
    if (candidates.data) {
      const result: any = candidates.data.map(candidate => {
        return {
          id: Number(candidate.CKAND),
          value: `${candidate.JMENO} ${candidate.PRIJMENI}`,
          secondRound: Number(candidate.HLASY_K2) > 0,
        };
      });
      setCleanCandidates(result);
      setSelectedCandidate(result[0]);
    }
  }, [candidates.data]);

  useEffect(() => {
    if (!selectedCandidate.secondRound) {
      setSelectedRound(1);
    }
  }, [selectedCandidate]);

  useEffect(() => {
    if (results.data) {
      const basty: any = results.data
        .filter(obec => Number(obec.ZAPSANI_VOLICI) > popLimit)
        .map(obec => {
          return {
            ...obec,
            pct:
              Number(obec[`kand-${selectedCandidate.id}`]) /
              Number(obec.PLATNE_HLASY),
          };
        })
        .sort((a, b) => b.pct - a.pct);

      setFinalResult(basty);
    }
  }, [results.data, selectedCandidate, selectedRound, selectedYear, popLimit]);

  if (results.isLoading || candidates.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">Stahuji data...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl">Volební bašty</h1>
        <h2 className="pb-4">Kde získali kandidáti nejvyšší podíl hlasů</h2>
        <div className="pb-6">
          <SelectBox
            label={"Rok"}
            items={years}
            selected={selectedYear}
            setSelected={setSelectedYear}
          ></SelectBox>
        </div>
        <div className="pb-6">
          <SelectBox
            label={"Kandidát"}
            items={cleanCandidates}
            selected={selectedCandidate}
            setSelected={setSelectedCandidate}
          ></SelectBox>
        </div>
        {selectedCandidate.secondRound && (
          <div className="pb-6">
            <ButtonSwitch
              selected={selectedRound}
              setSelected={setSelectedRound}
            ></ButtonSwitch>
          </div>
        )}
        <div className="pb-6">
          <RangeSlider
            popLimit={popLimit}
            setPopLimit={setPopLimit}
          ></RangeSlider>
        </div>
        <Table data={finalResult} year={selectedYear.value}></Table>
      </div>
    </div>
  );
};

export default Basty;
