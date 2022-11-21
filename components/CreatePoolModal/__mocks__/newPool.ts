import { dataType } from "..";
import { OsmosisTokens } from "../../../utils/assets";

export const poolOptionTokens: readonly dataType[] = OsmosisTokens.map(({ name, imgSrc }) => ({
  label: name,
  value: name,
  imgSrc: imgSrc,
}));
