interface ISetMappingsResult {
	deviceCount: number;
}

interface IMappingsFieldObject {
	fieldType: number;
	value: string;
	optionType: number;
}

interface ISetMappingsBodyObject {
	importFileId: number;
	mappings: IMappingsFieldObject[];
}

export { 
	ISetMappingsResult,
	IMappingsFieldObject,
	ISetMappingsBodyObject
};
