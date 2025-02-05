// @ts-check

import { Dependencies } from "daproj";
import { generateConfigs } from "daproj/eslint";

const generatedConfigs = generateConfigs( {
  [Dependencies.Jest]: true,
  [Dependencies.Eslint]: true,
  [Dependencies.Prettier]: true,
  [Dependencies.TypeScript]: true,
  [Dependencies.Node]: true,
} );
const infrastructureConfig = [
  {
    files: ["**/*.ts"],
    rules: {
      "import/no-internal-modules": "off",
    },
  },
];

export default [
  ...generatedConfigs,
  ...infrastructureConfig,
];
