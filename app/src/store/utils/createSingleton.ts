const createSingleton = <T>(Class: new (p: []) => T): (() => T) => {
  let singleton: T;

  return function findOrCreateSingleton() {
    if (!singleton) singleton = new Class([]);

    return singleton;
  };
};

export default createSingleton;
