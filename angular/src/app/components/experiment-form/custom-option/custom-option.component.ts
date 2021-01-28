import { Component, Input } from "@angular/core";


@Component({
	selector: "custom-option",
	templateUrl: "custom-option.component.html"
})
export class CustomOptionComponent  {

	@Input() displayValue = "fieldName";
	@Input() item;
	@Input() isShowIcon;
	
	constructor() {
		
	}

	
}
