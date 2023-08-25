import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { VALVE_STATE } from "~/lib/types";
import { appStore } from "~/stores/app";
import { Card, Title, LineChart } from "@tremor/react";

type ActiveButtonType = "Recharge" | "Spray" | "Flux nozzle";

export const Settings = observer(() => {
  const {
    stepperStartS,
    stepperEndS,
    stepperStopS,
    setValveState,
    setPressure,
    getPressure,
  } = appStore();

  const refInputSharpeningPressure = useRef<HTMLInputElement>(null);
  const [valve, setValve] = useState(false);
  const [valve2, setValve2] = useState(false);
  const [pumping, setPumping] = useState(false);
  const [pressureInput, setPressureInput] = useState("");
  const [sharpeningPressure, setSharpeningPressure] = useState(0.07);
  const [activeButton, setActiveButton] = useState<ActiveButtonType>("Spray");

  const handleButtonClick = (buttonName: ActiveButtonType) => {
    setActiveButton(buttonName);
  };

  const onTogglePumping = () => {
    const command = pumping
      ? stepperStopS
      : activeButton === "Spray" || activeButton === "Flux nozzle"
      ? stepperStartS
      : stepperEndS;
    void command();
    setPumping(!pumping);
  };

  const wrongPressure = (pressure: number) => {
    return pressure < 0.005 || pressure > 1;
  };

  const onSetSharpeningPressure = () => {
    const pressure = refInputSharpeningPressure.current?.valueAsNumber;
    if (pressure && !wrongPressure(pressure)) {
      const value = Math.round((pressure - 0.005) * (255 / (1 - 0.005)));
      void setPressure(value);
    }
  };

  const onClickSetValve = () => {
    void setValveState(1, valve ? VALVE_STATE.CLOSED : VALVE_STATE.OPEN);
    setValve(!valve);
  };

  const onClickSetValve2 = () => {
    void setValveState(2, valve ? VALVE_STATE.CLOSED : VALVE_STATE.OPEN);
    setValve2(!valve2);
  };

  const onSyringeStart = () => {
    void stepperStartS();
  };

  const onSyringeEnd = () => {
    void stepperEndS();
  };

  const onGetPressure = async () => {
    const pressureRes = await getPressure();
    if (!pressureRes) return;
    const val = pressureRes[pressureRes.length - 1];
    if (!val) return;
    setPressureInput(val);
  };

  const onStopStyringe = () => {
    void stepperStopS();
  };

  const [chartdata, setChartData] = useState([
    {
      time: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      Pressure: 0,
    },
  ]);

  const [pause, setPause] = useState(false);

  const dataFormatter = (number: number) =>
    `${Intl.NumberFormat("es").format(number).toString()} Bar`;

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // new pressure between 0,005 and 1 Bar
      const newPressure = Math.random() * (1 - 0.005) + 0.005;

      setChartData((prev) => {
        if (pause) return prev;
        if (prev.length > 4) {
          prev.shift();
        }
        return [
          ...prev,
          {
            time: newTime,
            Pressure: newPressure,
          },
        ];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [chartdata, pause]);

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Spray Settings</div>
      <div className="flex flex-1 flex-col py-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="number"
              step="0.005"
              min="0.005"
              max="1"
              className="w-32 rounded-md border border-gray-300 px-3 py-2"
              ref={refInputSharpeningPressure}
              value={sharpeningPressure}
              onChange={(e) => {
                setSharpeningPressure(e.target.valueAsNumber);
              }}
            />
          </div>
          <span>Bar</span>
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              onSetSharpeningPressure();
            }}
          >
            Set sharpening pressure
          </button>
        </div>
        <div className="h-4" />
        <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            void onGetPressure();
          }}
        >
          Get sharpening pressure
        </button>
        <div className="h-4" />
        {wrongPressure(sharpeningPressure) && (
          <div className="text-red-400">
            Wrong pressure, please enter a value between 0.005 and 1 Bar
          </div>
        )}
        <div className="text-gray-400">
          Recommended pressure between 0.06 to 0.5 Bar
        </div>
        <div className="h-4" />
        <Card>
          <Title>Timeline pressure</Title>
          <LineChart
            className="mt-6"
            data={chartdata}
            index="time"
            categories={["Pressure"]}
            colors={["emerald"]}
            valueFormatter={dataFormatter}
            yAxisWidth={40}
            minValue={0}
            maxValue={1}
          />
        </Card>
        <div className="h-4" />
        {/* Pause button */}
        <button
          type="button"
          className={
            !pause
              ? "rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
              : "rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
          }
          onClick={() => {
            setPause(!pause);
          }}
        >
          {pause ? "Resume" : "Pause"}
        </button>
        <div className="h-4" />
        <div>
          Real Pressure reading: {pressureInput ? pressureInput : "NaN"} Bar
        </div>
        <div className="h-4" />
        <button
          type="button"
          className={
            valve
              ? "rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
              : "rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
          }
          onClick={() => {
            onClickSetValve();
          }}
        >
          {valve ? "Activate Spray channel" : "Recharge/Clean channel"}
        </button>
        <div className="h-4" />
        <button
          type="button"
          className={
            valve2
              ? "rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
              : "rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
          }
          onClick={() => {
            onClickSetValve2();
          }}
        >
          {valve2 ? "Stop Solenoid Syringe 2" : "Start Solenoid Syringe 2"}
        </button>
        <div className="h-4" />
        <div className="flex overflow-hidden rounded-md">
          <button
            className={`btn flex-1 ${
              activeButton === "Recharge"
                ? "bg-blue-500 px-4 py-2 text-white"
                : "bg-gray-200 px-4 py-2 text-gray-700 hover:bg-blue-300 hover:text-white focus:outline-none"
            }`}
            onClick={() => handleButtonClick("Recharge")}
          >
            Recharge
          </button>
          <button
            className={`btn flex-1 ${
              activeButton === "Spray"
                ? "bg-blue-500 px-4 py-2 text-white"
                : "bg-gray-200 px-4 py-2 text-gray-700 hover:bg-blue-300 hover:text-white focus:outline-none"
            }`}
            onClick={() => handleButtonClick("Spray")}
          >
            Spray
          </button>
          <button
            className={`btn flex-1 ${
              activeButton === "Flux nozzle"
                ? "bg-blue-500 px-4 py-2 text-white"
                : "bg-gray-200 px-4 py-2 text-gray-700 hover:bg-blue-300 hover:text-white focus:outline-none"
            }`}
            onClick={() => handleButtonClick("Flux nozzle")}
          >
            Flux nozzle
          </button>
        </div>
        <div className="h-4" />
        <div className="flex flex-1 items-center space-x-4">
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
          />
          <span>mm</span>
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            Set Radius syringe
          </button>
        </div>
        <div className="h-4" />
        <div className="flex flex-1 items-center space-x-4">
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
          />
          <span>ml/min</span>
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            Set Flow rate
          </button>
        </div>
        <div className="h-4" />
        <button
          type="button"
          className={
            !pumping
              ? "rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
              : "rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
          }
          onClick={onTogglePumping}
        >
          {pumping ? "Stop Pumping" : "Start Pumping"}
        </button>
        <div className="h-4" />
        <button
          type="button"
          className={
            "rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          }
          onClick={onSyringeStart}
        >
          Inject
        </button>
        <div className="h-4" />
        <button
          type="button"
          className={
            "rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          }
          onClick={onSyringeEnd}
        >
          Recharge
        </button>
        <div className="h-4" />
        <button
          type="button"
          className={
            "rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
          }
          onClick={onStopStyringe}
        >
          Stop syringe motor
        </button>
      </div>
    </div>
  );
});
