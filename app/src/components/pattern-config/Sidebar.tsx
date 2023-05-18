import { type Area } from "@prisma/client";
import { observer } from "mobx-react-lite";
import { patternConfigStore } from "~/stores/patternConfig";

const Sidebar = observer(({ areas }: { areas: Area[] | undefined }) => {
  const patternConfigState = patternConfigStore();
  const selectedAreaId = patternConfigState.selectedAreaId;
  if (!areas) return null;

  return (
    <div className="w-48 flex-col justify-between bg-gray-600 text-white">
      <div className="pl-4 pt-6">
        {areas.map((area, idx) => (
          <button
            key={area.id}
            className={`mb-2 block cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none ${
              selectedAreaId === area.id ? "underline" : ""
            }`}
            onClick={() => patternConfigState.setSelectedAreaId(area.id)}
          >
            Sample {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
});

export { Sidebar };
