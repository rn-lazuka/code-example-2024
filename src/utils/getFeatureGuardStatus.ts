type EnvironmentVariables = { [key: string]: any };

export const getFeatureGuardStatus = (flag: string, variables: EnvironmentVariables = ENVIRONMENT_VARIABLES) => {
  return !(variables?.[flag] && variables[flag] === 'true');
};
