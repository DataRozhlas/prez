import React from "react";

const Table = (props: any) => {
  return (
    <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Obec
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
            >
              Okres
            </th>

            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Výsledek
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {props.data.map((item: any) => (
            <tr key={item.CIS_OBEC}>
              <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                {item.NAZ_OBEC}
                <dl className="font-normal lg:hidden">
                  <dt className="sr-only">Okres</dt>
                  <dd className="mt-1 truncate text-gray-700">{item.OKRES}</dd>
                </dl>
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                {item.OKRES}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 lg:table-cell">
                {" "}
                {`${Math.round(item.pct * 10000) / 100} %`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { Table };
