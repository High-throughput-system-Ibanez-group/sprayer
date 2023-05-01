import React, { useEffect } from "react";
import { AreaElement } from "~/components/AreaConfig/AreaElement";
import { api } from "~/utils/api";
import { type Area } from "~/utils/types";

const AreaConfig = () => {
  const { data: fetchedAreas, isLoading } = api.areas.getAll.useQuery();
  const [areas, setAreas] = React.useState<Area[]>([]);

  useEffect(() => {
    fetchedAreas && setAreas(fetchedAreas);
  }, [fetchedAreas]);

  const removeArea = (idx: number) => {
    const newAreas = [...areas];
    newAreas.splice(idx, 1);
    setAreas(newAreas);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <table className="max-[600px] border-collapse">
        <thead>
          <tr className="text-gray-700">
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2" colSpan={3}>
              Starting Point
            </th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2" colSpan={3}>
              Ending Point
            </th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
          </tr>
          <tr className="text-gray-700">
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">X</th>
            <th className="pX-4 py-2">Y</th>
            <th className="px-4 py-2">Z</th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">X</th>
            <th className="px-4 py-2">Y</th>
            <th className="px-4 py-2">Z</th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {areas?.map((area, idx) => (
            <AreaElement
              key={area.id || idx + 10000}
              area={area}
              idx={idx}
              removeArea={removeArea}
            />
          ))}
        </tbody>
      </table>
      <div className="h-12" />
      <button
        type="button"
        className="w-32 rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        onClick={() => {
          setAreas([
            ...areas,
            {
              x1: 0,
              y1: 0,
              z1: 0,
              x2: 0,
              y2: 0,
              z2: 0,
            },
          ]);
        }}
        disabled={isLoading || areas.length >= 9}
      >
        Add area +
      </button>
    </div>
  );
};
export default AreaConfig;
