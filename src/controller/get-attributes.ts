import { getProductTypesWithAttribute } from '../services/ecommerce-api';

import IAttribute from '../types/attribute';

const getAttributes = async (name: string): Promise<IAttribute[]> => {
  const result: IAttribute[] = [];
  const res = await getProductTypesWithAttribute(name);
  const attributesArr = res.map((item) => item.attributes).flat();
  attributesArr.forEach((item) => {
    if (!item || !item.type) {
      return;
    }
    if (item.name !== name) {
      return;
    }
    if (item && item.type && 'elementType' in item.type && 'values' in item.type.elementType) {
      result.push({
        name: item.name,
        values: item.type.elementType.values as { key: string; label: string }[],
      });
      return;
    }
    if ('values' in item.type) {
      result.push({
        name: item.name,
        values: item.type.values as { key: string; label: string }[],
      });
      return;
    }
    result.push({
      name: item.name.trim().toLowerCase(),
      values: [],
    });
  });
  return result;
};

export default getAttributes;
