import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { type Area } from "~/utils/types";

export const AreaElement = ({ area, idx }: { area: Area; idx: number }) => {
  const utils = api.useContext();
  const saveArea = api.areas.save.useMutation();
  const deleteArea = api.areas.delete.useMutation();
  const number = idx + 1;

  const [x1, setX1] = useState(area.x1);
  const [y1, setY1] = useState(area.y1);
  const [z1, setZ1] = useState(area.z1);
  const [x2, setX2] = useState(area.x2);
  const [y2, setY2] = useState(area.y2);
  const [z2, setZ2] = useState(area.z2);

  useEffect(() => {
    if (!area) return;
    const updateArea = async () => {
      try {
        // if any value has changed
        if (
          area.x1 === x1 &&
          area.y1 === y1 &&
          area.z1 === z1 &&
          area.x2 === x2 &&
          area.y2 === y2 &&
          area.z2 === z2
        ) {
          console.log("no changes in area..");
          return;
        }
        console.log("saving area..", area);
        await saveArea.mutateAsync({
          ...area,
          x1,
          y1,
          z1,
          x2,
          y2,
          z2,
        });
        await utils.areas.getAll.invalidate();
      } catch (err) {
        console.log("err saving area..", err);
      }
    };
    void updateArea();
  }, [area, saveArea, utils.areas.getAll, x1, y1, z1, x2, y2, z2]);

  const onDelete = async () => {
    try {
      await deleteArea.mutateAsync(area.id);
      await utils.areas.getAll.invalidate();
    } catch (err) {
      console.log("err deleting area..", err);
    }
  };

  return (
    <tr className="bg-white">
      <td className="px-4 py-2">Sample {number}</td>
      <td className="px-4 py-2 text-center">
        <input
          type="number"
          id="number-input"
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          value={x1}
          onChange={(e) => setX1(Number(e.target.value))}
        />
      </td>
      <td className="px-4 py-2 text-center">
        <input
          type="number"
          id="number-input"
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          value={y1}
          onChange={(e) => setY1(Number(e.target.value))}
        />
      </td>
      <td className="px-4 py-2 text-center">
        <input
          type="number"
          id="number-input"
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          value={z1}
          onChange={(e) => setZ1(Number(e.target.value))}
        />
      </td>
      <td className="px-4 py-2 text-center"></td>
      <td className="px-4 py-2 text-center">
        <input
          type="number"
          id="number-input"
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          value={x2}
          onChange={(e) => setX2(Number(e.target.value))}
        />
      </td>
      <td className="px-4 py-2 text-center">
        <input
          type="number"
          id="number-input"
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          value={y2}
          onChange={(e) => setY2(Number(e.target.value))}
        />
      </td>
      <td className="px-4 py-2 text-center">
        <input
          type="number"
          id="number-input"
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          value={z2}
          onChange={(e) => setZ2(Number(e.target.value))}
        />
      </td>
      {/* <td className="px-4 py-2 text-center">
        <button
          type="button"
          className="w-24 rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            void onSave();
          }}
          disabled={loading}
        >
          {loading ? "Loading.." : "Save"}
        </button>
      </td> */}
      <td className="px-4 py-2 text-center">
        <button
          type="button"
          className="w-24 rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
          onClick={() => {
            void onDelete();
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
