import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { isNullOrUndefined } from 'util';
import { find } from "lodash";

import { ICSVColumn, IMappingField } from '../../shared/entities/mapping-field.entity'
import { fieldsSetItems, columnsSet } from './config'

  
@Component({
  selector: 'experiment-form-content',
  templateUrl: './experiment-form-content.component.html',
  styleUrls: ['./experiment-form-content.component.scss']
})
export class ExperimentFormContentComponent implements OnInit {

  public csvColumnItems: ICSVColumn[] = [];
  public mappingFieldsItems: IMappingField[] = [];

  public mappingFieldsFormGroup: FormGroup = this.fb.group({});  

  constructor(private readonly fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.initMappingFields();
  }
  
  public getErrorMessage(formControlName) {
		let result = this.mappingFieldsFormGroup.get(formControlName + "")?.hasError("duplicateMapFieldError");

		return !!result ? 'mistake' : null;
	}

  private initMappingFields(): void {

		combineLatest([
			of(fieldsSetItems),
			of(columnsSet)
		]).subscribe(
				([fieldsItems, columns]: [IMappingField[], ICSVColumn[]]) => {
					this.mappingFieldsItems = fieldsItems;
					this.csvColumnItems = columns;
					this.mappingFieldsFormGroup = this.generateMappingFieldsFormGroup();
					this.afterFormInited();
				}
			);
  }

  private updateViewValues() {
		// this.isFormEmpty = !Object.values(this.mappingFieldsFormGroup.value).some(value => !!value);
		// this.uniqueIdentifierMappedNumber = this.getUniqueIdentifierMappedNumber();
		// this.setNextButtonTooltip();
		// this.changeDetectorRef.detectChanges();
	}

  private afterFormInited(): void {
		this.updateViewValues();
		this.mappingFieldsFormGroup.setValidators(this.baseCommonValidator());

		this.mappingFieldsFormGroup.valueChanges
			.subscribe(value => {
					this.updateViewValues();
					console.log("-----group----");
					console.log(this.mappingFieldsFormGroup);
					this.mappingFieldsFormGroup.markAllAsTouched();
				});
	}
  
  private generateMappingFieldsFormGroup(): FormGroup {
		return this.fb.group(
			this.csvColumnItems.reduce((group, { id: csvColumnItemId }) => ({
				...group,
				[csvColumnItemId.toString()]: // Then the field has already pre-matching.
					[this.mappingFieldsItems.find(item => csvColumnItemId.toString() === item.value) || null]
			}), {})
		);
  }
  
  private baseCommonValidator(): ValidatorFn {
		return (group: FormGroup): ValidationErrors | null => {
			const groupsErrors = [];
			
			const groupDuplicateMapErrors = this.validateDuplicateMapField(group.controls);
			const groupUniqueIdentifierErrors = this.validateUniqueIdentifierMapRequired(group);

			if(!!groupDuplicateMapErrors){
				groupsErrors.push(groupDuplicateMapErrors);
			}
			if(!!groupUniqueIdentifierErrors){
				groupsErrors.push(groupUniqueIdentifierErrors);
			}

			return groupsErrors.length > 0 ? groupsErrors: null;
		};
  }
  
  private validateDuplicateMapField(controls: { [key: string]: AbstractControl }) {	
	let resultError = null;
	
	const controlsArr = Object.entries(controls);
	controlsArr.forEach(([nameControl, control])=>{
		const fieldType = control.value?.fieldType;
		let isSetError = false;

		if(isNullOrUndefined(fieldType)) { return }
		isSetError = this.checkSetError(controls, nameControl, fieldType );		

		if(isSetError) {
			control.setErrors({ duplicateMapFieldError: true });
			resultError = { duplicateMapFieldError: true };
			// control.markAsDirty();
		} else{
			// control.clearValidators();
			control.setErrors(null);
			// control.markAsTouched();
		}		
	});
	return resultError;

	// for (const [nameControl, control] of Object.entries(controls)) {
	// 	const fieldType = control.value?.fieldType;
	// 	let isSetError = false;

	// 	if(isNullOrUndefined(fieldType)) { continue; }

	// 	for (const [nameControlS, controlS] of Object.entries(controls)) {
	// 		if(nameControl !== nameControlS && fieldType === controlS.value?.fieldType) {
	// 			controlS.setErrors({ duplicateMapFieldError: true });
	// 			//controlS.markAsDirty();
	// 			isSetError = !isSetError;
	// 		}
	// 	}

	// 	if(isSetError) {
	// 		control.setErrors({ duplicateMapFieldError: true });
	// 		return { duplicateMapFieldError: true };
	// 		// control.markAsDirty();
	// 	} else{
	// 		// control.clearValidators();
	// 		control.setErrors(null);
	// 		// control.markAsTouched();
	// 	}
	// 	return null;
	// }
}
	private checkSetError(controls: { [key: string]: AbstractControl }, nameControl, fieldType ){
		let isSetError = false;
		const controlsArr = Object.entries(controls);

		controlsArr.forEach(([nameControlS, controlS])=>{
			if(nameControl !== nameControlS && fieldType === controlS.value?.fieldType) {
				controlS.setErrors({ duplicateMapFieldError: true });
				//controlS.markAsDirty();
				isSetError = !isSetError;
			}
		});
		// for (const [nameControlS, controlS] of Object.entries(controls)) {
		// 	if(nameControl !== nameControlS && fieldType === controlS.value?.fieldType) {
		// 		controlS.setErrors({ duplicateMapFieldError: true });
		// 		//controlS.markAsDirty();
		// 		isSetError = !isSetError;
		// 	}
		// }
		return isSetError;
	} 

	private validateUniqueIdentifierMapRequired(group: FormGroup): { [key: string]: boolean } | null {
		const finedIsUniqControl = find(group.controls, (elem) => {
			return elem.value?.isUniqueIdentifier;
		});

		return isNullOrUndefined(finedIsUniqControl) ? { uniqueIdentifierRequireMapError: true } : null;
	}

	public isShowIcon(item: IMappingField){
		return item.isUniqueIdentifier
	}

}
