import { useEffect, useState } from 'react';
import { API, Dictionaries } from '@utils';
import { AutocompleteFreeSoloOptionType } from '@components/autocompletes/AutocompleteFreeSolo/AutocompleteFreeSolo';
import { useTranslation } from 'react-i18next';

export const useProceduresOptionsList = () => {
  const [procedureOptions, setProcedureOptions] = useState<AutocompleteFreeSoloOptionType[]>([]);
  const { t: tProcedureType } = useTranslation(Dictionaries.ProcedureType);

  useEffect(() => {
    API.get('/pm/procedures')
      .then(({ data }) => {
        const options = data.reduce(
          (acc, option) => {
            if (option.isPackage) {
              acc.packages.push({ label: option.name, value: option.id, group: tProcedureType('Packages') });
            } else {
              acc.single.push({ label: option.name, value: option.id, group: tProcedureType('SingleTests') });
            }
            return acc;
          },
          { packages: [], single: [] },
        );

        setProcedureOptions([...options.packages, ...options.single]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return { procedureOptions };
};
