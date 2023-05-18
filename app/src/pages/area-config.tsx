import React, { useEffect } from "react";
import { AreaElement } from "~/components/AreaConfig/AreaElement";
import { api } from "~/utils/api";
import { type Area } from "~/utils/types";

const AreaConfig = () => {
  const [areas, setAreas] = React.useState<Area[]>([]);
  const { data: fetchedAreas, isLoading } = api.areas.getAll.useQuery();
  const utils = api.useContext();

  const { mutate: saveArea } = api.areas.save.useMutation({
    onSuccess: async () => {
      await utils.areas.getAll.invalidate();
    },
  });

  useEffect(() => {
    fetchedAreas && setAreas(fetchedAreas);
  }, [fetchedAreas]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-start p-8">
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
            <AreaElement key={area.id || idx + 10000} area={area} idx={idx} />
          ))}
        </tbody>
      </table>
      <div className="h-12" />
      <button
        type="button"
        className="w-40 rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        onClick={() => {
          saveArea({ x1: 0, y1: 0, z1: 0, x2: 0, y2: 0, z2: 0 });
        }}
        disabled={isLoading || areas.length >= 9}
      >
        Add sample +
      </button>
    </div>
  );
};
export default AreaConfig;
