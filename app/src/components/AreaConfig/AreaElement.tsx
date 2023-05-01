import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { type Area } from "~/utils/types";

export const AreaElement = ({ area, idx }: { area: Area; idx: number }) => {
  const utils = api.useContext();
  const saveArea = api.areas.save.useMutation();
  const deleteArea = api.areas.delete.useMutation();
  const [loading, setLoading] = useState(false);
  const number = idx + 1;

  const refX1 = useRef<HTMLInputElement>(null);
  const refY1 = useRef<HTMLInputElement>(null);
  const refZ1 = useRef<HTMLInputElement>(null);
  const refX2 = useRef<HTMLInputElement>(null);
  const refY2 = useRef<HTMLInputElement>(null);
  const refZ2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!area) return;
    if (refX1.current) {
      refX1.current.value = String(area.x1);
    }
    if (refY1.current) {
      refY1.current.value = String(area.y1);
    }
    if (refZ1.current) {
      refZ1.current.value = String(area.z1);
    }
    if (refX2.current) {
      refX2.current.value = String(area.x2);
    }
    if (refY2.current) {
      refY2.current.value = String(area.y2);
    }
    if (refZ2.current) {
      refZ2.current.value = String(area.z2);
    }
  }, [area]);

  const onSave = async () => {
    {
      try {
        setLoading(true);
        await saveArea.mutateAsync({
          id: area.id,
          ...area,
          x1: Number(refX1.current?.value),
          y1: Number(refY1.current?.value),
          z1: Number(refZ1.current?.value),
          x2: Number(refX2.current?.value),
          y2: Number(refY2.current?.value),
          z2: Number(refZ2.current?.value),
        });
        await utils.areas.getAll.invalidate();
      } catch (err) {
        console.log("err saving area..", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (!area || !area.id) return;
      await deleteArea.mutateAsync(area.id);
      await utils.areas.getAll.invalidate();
    } catch (err) {
      console.log("err deleting area..", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="bg-white">
      <td className="px-4 py-2">Area {number}</td>
      <td className="px-4 py-2 text-center">
        <input
          type="number"
          id="number-input"
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          ref={refX1}
        />
      </td>
      <td className="px-4 py-2 text-center">
        <input
          type="number"
          id="number-input"
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          ref={refY1}
        />
      </td>
      <td className="px-4 py-2 text-center">
        <input
          type="number"
          id="number-input"
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          ref={refZ1}
        />
      </td>
      <td className="px-4 py-2 text-center"></td>
      <td className="px-4 py-2 text-center">
        <input
          type="number"
          id="number-input"
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          ref={refX2}
        />
      </td>
      <td className="px-4 py-2 text-center">
        <input
          type="number"
          id="number-input"
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          ref={refY2}
        />
      </td>
      <td className="px-4 py-2 text-center">
        <input
          type="number"
          id="number-input"
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          ref={refZ2}
        />
      </td>
      <td className="px-4 py-2 text-center">
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
      </td>
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
