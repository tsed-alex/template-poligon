import { OnInit, DoCheck, Directive } from "@angular/core";
import { FormControl, ValidatorFn, RequiredValidator, ControlValueAccessor } from "@angular/forms";
import { filter, map, pairwise, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { isArray } from "util";
import { isEmptyNullOrUndefined } from "src/app/shared/utils/string";

@Directive()
export class DasBaseFieldDirective implements OnInit, DoCheck, ControlValueAccessor {

	public destroy$ = new Subject();
	public valueControl: FormControl = new FormControl("");

	validators: ValidatorFn[] = [];
	isRequired = false;

	propagateChange = (_: any) => {};
	propagateBlur = (_: any) => {};

	constructor(validators: Array<any> = []) {
		this.valueControl.setValidators(validators);
		this.validators = validators;
	}

	ngOnInit() {
		this.valueControl.valueChanges.pipe(
			takeUntil(this.destroy$),
			pairwise(),
			filter(([oldValue, newValue]) => oldValue !== newValue),
			map(([oldValue, newValue]) => newValue)
		).subscribe((newValue) => {
			this.propagateChange(newValue);
		});
	}

	ngDoCheck(): void {
		if (isArray(this.validators)) {
			const reqValidator: any = this.validators.find((val) => val.constructor === RequiredValidator);
			if (!isEmptyNullOrUndefined(reqValidator)) {
				this.isRequired = reqValidator.required;
			}
		}
	}

	writeValue(value: any): void {
		if (!isEmptyNullOrUndefined(value)) {
			this.valueControl.setValue(value);
		}
	}

	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.propagateBlur = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		isDisabled ? this.valueControl.disable() : this.valueControl.enable();
	}

	onBlurEvent() {
		this.propagateBlur(this.valueControl.value);
	}

	onDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
