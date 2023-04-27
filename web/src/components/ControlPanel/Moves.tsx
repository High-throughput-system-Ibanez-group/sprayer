export const Moves = () => (
  <div className=" border- flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
    <div className="mb-2 text-xl font-bold">Moves</div>
    <div className="flex flex-col py-6">
      <div className="h-4" />
      <div className="flex items-center space-x-4">
        <label htmlFor="number-input" className="font-medium">
          x:
        </label>
        <div className="relative">
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
          />
          <div className="absolute -top-8 left-0 flex w-full justify-center">
            Position (mm)
          </div>
        </div>
        <div className="relative">
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
          />
          <div className="absolute -top-8 left-0 flex w-full justify-center">
            Move (mm)
          </div>
        </div>
        <button
          type="button"
          className="rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            //TODO: move x
          }}
        >
          -
        </button>
        <input
          type="number"
          id="number-input"
          className="w-16 rounded-md border border-gray-300 px-3 py-2"
        />
        <button
          type="button"
          className="rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            //TODO: move y
          }}
        >
          +
        </button>
      </div>
      <div className="h-4" />
      <div className="flex items-center space-x-4">
        <label htmlFor="number-input" className="font-medium">
          y:
        </label>
        <input
          type="number"
          id="number-input"
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
        />
        <input
          type="number"
          id="number-input"
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
        />
        <button
          type="button"
          className="rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            //TODO: move y
          }}
        >
          -
        </button>
        <input
          type="number"
          id="number-input"
          className="w-16 rounded-md border border-gray-300 px-3 py-2"
        />
        <button
          type="button"
          className="rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            //TODO: move x
          }}
        >
          +
        </button>
      </div>
      <div className="h-4" />
      <div className="flex items-center space-x-4">
        <label htmlFor="number-input" className="font-medium">
          z:
        </label>
        <input
          type="number"
          id="number-input"
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
        />
        <input
          type="number"
          id="number-input"
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
        />
        <button
          type="button"
          className="rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            //TODO: move x
          }}
        >
          -
        </button>
        <input
          type="number"
          id="number-input"
          className="w-16 rounded-md border border-gray-300 px-3 py-2"
        />
        <button
          type="button"
          className="rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            //TODO: move x
          }}
        >
          +
        </button>
      </div>
      <div className="h-6" />
      <button
        type="button"
        className="rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
        onClick={() => {
          //TODO: update all
        }}
      >
        Move
      </button>
    </div>
  </div>
);
