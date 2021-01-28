export interface IMappingField {
	controlType: number;
	isUniqueIdentifier: boolean;
	referenceUrl: string;
	optionType: number;
	value: string;
	fieldName: string;
	fieldType: number; // Unique value. Used as the field Id.
	maxLength: number;
}

export interface ICSVColumn {
	id: number; 
	name: string;
}
