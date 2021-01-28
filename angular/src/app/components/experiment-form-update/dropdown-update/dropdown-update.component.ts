import {
	Component,
	OnDestroy,
	OnInit,
	Input,
	forwardRef,
	ChangeDetectionStrategy,
	Optional,
	Inject,
	ChangeDetectorRef,
	ViewChild,
	TemplateRef,
	ViewContainerRef, 
	ViewRef,
	ComponentFactoryResolver,
	ContentChild,
	ContentChildren,
	QueryList
} from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS } from "@angular/forms";
import { startWith, takeUntil } from "rxjs/operators";
import { DasBaseFieldDirective } from "../../base-field/base-field.component";
import { isEqual } from "lodash";
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatOption } from "@angular/material/core";
import { isEmptyNullOrUndefined } from "src/app/shared/utils/string";

@Component({
	selector: "das-dropdown-update",
	templateUrl: "dropdown-update.component.html",
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => DropdownUpdateComponent),
		multi: true
	}],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownUpdateComponent extends DasBaseFieldDirective
	implements OnDestroy, OnInit, ControlValueAccessor  {

	private _items: object[] = [];
	@Input() set items(items) {
		this._items = items || [];
		this.userInputControl.setValue("");
	}
	get items() {
		return this._items;
	}

	@Input() displayedProperty = "name"; // item[displayedProperty] should be a string with option name.
	@Input() itemIdProperty = "id"; // item[itemIdProperty] should be an option identifier.
	@Input() maxInputLength = 500;
	@Input() placeholder = "";
	@Input() defaultValue = ""; // Should already be translated!
	@Input() defaultValueStyle = "";
	@Input() dividerNeeded = false; // Should be "true" if the devider needed after the defaultValue.
	@Input() hintLabel = "";
	@Input() hintLabelColor = "#7b7b7b";
	@Input() hintErrorLabel = "";
	@Input() textAreaInput = false;
	@Input() automationLabel = "";
	@Input() autocompletePagination = false;
	@Input() autocompletePaginationSize = 50;
	@Input() floatLabel = "";

	public userInputControl: FormControl = new FormControl("");
	public filteredOptions: object[];
	public selectedItem = null;
	public filterOptionsQuantity = 0;

	public templateCtx = {
        estimate: 77
    };

	// @ViewChild('testBox', {static: false}) testBox;
	// @ViewChild('customOption', {static: true}) customOption;
	// @ViewChild('place', {read: ViewContainerRef}) place: ViewContainerRef;	

	// @ContentChildren(MatOption) queryOptions: QueryList<MatOption>;
	@ContentChild('customOption',{static: false}) customOptionTemplateRef: TemplateRef<any>;
	@ViewChild('defaultOption',{static: true}) defaultOptionTemplateRef: TemplateRef<any>;

	@ViewChild(MatAutocompleteTrigger) autoTrigger: MatAutocompleteTrigger;
	// @ContentChild('currentOption',{static: false}) currentOptionTemplateRef: TemplateRef<any>;

	public showCustomOption = false;
	public showHeading = true;
	// @ViewChild('customOption', { read: TemplateRef, static: false }) customOption:TemplateRef<any>;

	constructor(
		@Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
		private resolver: ComponentFactoryResolver,
		private cdRef:ChangeDetectorRef
	) {
		super(validators);
	}

	ngOnInit(): void {
		super.ngOnInit();
		this.valueControl.setValue(null);

		this.userInputControl.valueChanges
			.pipe(startWith(""),
				takeUntil(this.destroy$)
			)
			.subscribe(res => this.filteredOptions = this.getFilteredOptions(this.items, res));
		this.valueControl.valueChanges
			.pipe(
				takeUntil(this.destroy$)
			).subscribe((value) => {
				console.log('valueControl valueChanges');
				if (!isEqual(value, this.selectedItem)) {
					this.selectedItem = value;
					this.userInputControl.setValue(this.selectedItem, { emitEvent: false });
				}
			});
	}

	public onAutocompleteOptionSelected(evt: MatAutocompleteSelectedEvent): void {
		console.log('onAutocompleteOptionSelected');
		const item = evt.option.value;

		this.selectedItem = item;
		this.propagateChange(item);
	}

	public displayFn = (item?: object): string => {
		const showedValue = item ? item[this.displayedProperty] : this.defaultValue;

		return !isEmptyNullOrUndefined(showedValue) ? showedValue : "";
	}

	public restoreSelectedOption(isBlurEvent: boolean): void {
		debugger
		console.log('isBlurEvent', isBlurEvent);
		if (!isEqual(this.userInputControl.value, this.selectedItem) && (!isBlurEvent || this.filteredOptions.length === 0)) {
			this.userInputControl.setValue(this.selectedItem, { emitEvent: false });
			this.filteredOptions = this.getFilteredOptions(this.items, this.selectedItem);
		}
	}

	public getFilteredOptions(items: object[], value: any): object[] {
		let text = "";
		if (typeof value === "string") {
			text = value;
		} else {
			text = value != null ? value[this.displayedProperty] : "";
		}

		let result = items.filter(item => {
			const optionValue: string = item[this.displayedProperty];
			return optionValue && optionValue.toLowerCase().includes(text.toLowerCase());
		});

		this.filterOptionsQuantity = result.length;
		if (this.autocompletePagination) {
			result = result.slice(0, Math.min(result.length, this.autocompletePaginationSize));
		}
		return result;
	}

	public writeValue(value: any): void {
		this.valueControl.setValue(value);
	}

	public getAutomationLabel(): string {
		return !isEmptyNullOrUndefined(this.placeholder) ? this.placeholder : this.automationLabel;
	}

	public showInputDefaultValueStyle(): boolean {
		return !isEmptyNullOrUndefined(this.defaultValue) && !this.selectedItem
			&& !isEmptyNullOrUndefined(this.defaultValueStyle);
	}

	public get showErrorHint(): boolean {
		return !!this.hintErrorLabel && this.hintErrorLabel !== "";
	}

	public isCustomOption(): boolean {
		return false;
	}	

	public strongClick(item) {
		this.selectedItem = item;
		this.propagateChange(item);

		this.autoTrigger.closePanel();	
	}

	ngAfterViewInit() {		
		if(!this.customOptionTemplateRef){
			this.customOptionTemplateRef = this.defaultOptionTemplateRef;
		}
	}

	ngOnDestroy(): void {
		super.onDestroy();
	}
}
