import { addPackagejsonConfigTo } from "daproj/prettier/plugins";
import { addSortJsonConfigTo } from "daproj/prettier/plugins";

const config = {
};

addSortJsonConfigTo(config);
addPackagejsonConfigTo(config);

export default config;
