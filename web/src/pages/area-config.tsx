import React from "react";

const AreaConfig = () => {
  const [areas, setAreas] = React.useState([1]);
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <table className="max-[600px] border-collapse">
        <thead>
          <tr className="text-gray-700">
            <th className="py-2 px-4"></th>
            <th className="py-2 px-4" colSpan={3}>
              Starting Point
            </th>
            <th className="py-2 px-4"></th>
            <th className="py-2 px-4" colSpan={3}>
              Ending Point
            </th>
            <th className="py-2 px-4"></th>
            <th className="py-2 px-4"></th>
          </tr>
          <tr className="text-gray-700">
            <th className="py-2 px-4"></th>
            <th className="py-2 px-4">X</th>
            <th className="pX-4 py-2">Y</th>
            <th className="py-2 px-4">Z</th>
            <th className="py-2 px-4"></th>
            <th className="py-2 px-4">X</th>
            <th className="py-2 px-4">Y</th>
            <th className="py-2 px-4">Z</th>
            <th className="py-2 px-4"></th>
            <th className="py-2 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {areas.map((_, idx) => (
            <tr className="bg-white" key={idx}>
              <td className="py-2 px-4">Area {idx + 1}</td>
              <td className="py-2 px-4 text-center">
                <input
                  type="number"
                  id="number-input"
                  className="w-24 rounded-md border border-gray-300 px-3 py-2"
                />
              </td>
              <td className="py-2 px-4 text-center">
                <input
                  type="number"
                  id="number-input"
                  className="w-24 rounded-md border border-gray-300 px-3 py-2"
                />
              </td>
              <td className="py-2 px-4 text-center">
                <input
                  type="number"
                  id="number-input"
                  className="w-24 rounded-md border border-gray-300 px-3 py-2"
                />
              </td>
              <td className="py-2 px-4 text-center"></td>
              <td className="py-2 px-4 text-center">
                <input
                  type="number"
                  id="number-input"
                  className="w-24 rounded-md border border-gray-300 px-3 py-2"
                />
              </td>
              <td className="py-2 px-4 text-center">
                <input
                  type="number"
                  id="number-input"
                  className="w-24 rounded-md border border-gray-300 px-3 py-2"
                />
              </td>
              <td className="py-2 px-4 text-center">
                <input
                  type="number"
                  id="number-input"
                  className="w-24 rounded-md border border-gray-300 px-3 py-2"
                />
              </td>
              <td className="py-2 px-4 text-center">
                <button
                  type="button"
                  className="w-24 rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
                  onClick={() => {
                    //TODO: save
                  }}
                >
                  Save
                </button>
              </td>
              <td className="py-2 px-4 text-center">
                <button
                  type="button"
                  className="w-24 rounded-md bg-red-500 py-2 px-4 font-medium text-white hover:bg-red-600"
                  onClick={() => {
                    //TODO: delete area
                    setAreas(areas.filter((_, i) => i !== idx));
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-12" />
      <button
        type="button"
        className="w-32 rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
        onClick={() => {
          //TODO: add new area
          setAreas([...areas, areas.length + 1]);
        }}
      >
        Add area +
      </button>
    </div>
  );
};
export default AreaConfig;
