import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Temperature } from "~/components/control-panel/Temperature";
import { Cleaning } from "~/components/pattern-config/Cleaning";
import { ExperimentSettings } from "~/components/pattern-config/ExperimentSettings";
import { Sidebar } from "~/components/pattern-config/Sidebar";
import { Settings } from "~/components/pattern-config/SpraySettings";
import { UltrasonicController } from "~/components/pattern-config/UltrasonicController";
import { patternConfigStore } from "~/stores/patternConfig";
import { api } from "~/utils/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignPattern } from "@/components/pattern-config/DesignPattern";

const PatternConfig = () => {
  // const { data: fetchedAreas, isLoading } = api.areas.getAll.useQuery();
  // const patternConfigState = patternConfigStore();

  // useEffect(() => {
  //   if (fetchedAreas && fetchedAreas[0]) {
  //     if (!patternConfigState.selectedAreaId)
  //       patternConfigState.setSelectedAreaId(fetchedAreas[0].id);
  //   }
  // }, [fetchedAreas, patternConfigState]);

  // if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-1 flex-row">
      {/* <Sidebar areas={fetchedAreas} /> */}
      <div className="flex w-full flex-1 flex-col p-4">
        <Tabs defaultValue="experiment">
          <TabsList>
            <TabsTrigger value="experiment">Experiment settings</TabsTrigger>
            <TabsTrigger value="pattern">Pattern settings</TabsTrigger>
          </TabsList>
          <TabsContent value="experiment">
            <div className="h-8" />
            <div className="flex flex-1 flex-col items-center justify-start p-8">
              <Settings />
              <div className="h-8" />
              <UltrasonicController />
              <div className="h-8" />
              <Temperature />
              <div className="h-8" />
              <Cleaning />
              <div className="h-8" />
              <ExperimentSettings />
              {/* {areaId && <PatternArea areaId={areaId} />} */}
            </div>
          </TabsContent>
          <TabsContent value="pattern">
            <div className="flex flex-1 flex-col items-center justify-start p-8">
              <DesignPattern />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default observer(PatternConfig);
