import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Cleaning } from "~/components/pattern-config/Cleaning";
import { PatternArea } from "~/components/pattern-config/PatternArea";
import { Sidebar } from "~/components/pattern-config/Sidebar";
import { Settings } from "~/components/pattern-config/SpraySettings";
import { patternConfigStore } from "~/stores/patternConfig";
import { api } from "~/utils/api";

const PatternConfig = () => {
  const { data: fetchedAreas, isLoading } = api.areas.getAll.useQuery();
  const patternConfigState = patternConfigStore();

  useEffect(() => {
    if (fetchedAreas && fetchedAreas[0]) {
      if (!patternConfigState.selectedAreaId)
        patternConfigState.setSelectedAreaId(fetchedAreas[0].id);
    }
  }, [fetchedAreas, patternConfigState]);

  if (isLoading) return <div>Loading...</div>;

  const areaId = patternConfigState.selectedAreaId;

  return (
    <div className="flex flex-1 flex-row">
      <Sidebar areas={fetchedAreas} />
      <div className="h-8" />
      <div className="flex flex-1 flex-col items-center justify-start p-8">
        <Settings />
        <div className="h-8" />
        <Cleaning />
        <div className="h-8" />
        {areaId && <PatternArea areaId={areaId} />}
      </div>
    </div>
  );
};
export default observer(PatternConfig);
