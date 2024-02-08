export const dialysisMachineIsolationGroupFixture = (id: number, name: string, isolations: string[] = []) => {
  return {
    id,
    isolations,
    name,
  };
};
