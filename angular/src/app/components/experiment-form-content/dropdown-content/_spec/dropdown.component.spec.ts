import { TranslateModule } from "@ngx-translate/core";
import { TestBed, waitForAsync, ComponentFixture } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/compiler";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";

import { DropdownComponent } from "../dropdown.component";

declare const expect: jest.Expect;

describe("DropdownComponent", () => {
	let component: DropdownComponent;
	let fixture: ComponentFixture<DropdownComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
			declarations: [DropdownComponent],
			imports: [
				TranslateModule.forRoot()
			]
		}).overrideTemplate(DropdownComponent,"<span></span>");
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DropdownComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should compile", () => {
		expect(component).toBeTruthy();
	});

	it("set options should call setValue for userInputControl", () => {
		const setValue = jest.spyOn(component.userInputControl, "setValue");
		component.items = [];

		expect(setValue).toBeCalled();
		expect(setValue).toBeCalledWith("");
	});

	it("set undefined options should set empty array", () => {
		component.items = undefined;

		expect(component.items).toEqual([]);
		expect(component.userInputControl.value).toBe("");
	});

	it("value changing should set selectedItem and set this value for userInputControl", () => {
		const setValue = jest.spyOn(component.userInputControl, "setValue");
		component.valueControl.setValue(null);
		component.valueControl.setValue("SelectedOption");

		expect(setValue).toBeCalled();
		expect(setValue).toBeCalledWith("SelectedOption", {"emitEvent": false});
		expect(component.selectedItem).toBe("SelectedOption");
	});

	describe("[Method]: onAutocompleteOptionSelected", () => {
		it("should set selectedItem and set this value for valueControl", () => {
			const setValue = jest.spyOn(component.valueControl, "setValue");
			component.onAutocompleteOptionSelected({ option: { value: "OldSelectedOption" }} as MatAutocompleteSelectedEvent);
			component.onAutocompleteOptionSelected({ option: { value: "NewSelectedOption" }} as MatAutocompleteSelectedEvent);

			expect(setValue).toBeCalled();
			expect(setValue).toHaveBeenNthCalledWith(1, "OldSelectedOption");
			expect(setValue).toHaveBeenNthCalledWith(2, "NewSelectedOption");
			expect(component.selectedItem).toBe("NewSelectedOption");
		});
	});

	describe("[Method]: writeValue", () => {
		it("should set value for valueControl", () => {
			const setValue = jest.spyOn(component.valueControl, "setValue");
			component.writeValue("test value");

			expect(setValue).toBeCalled();
			expect(setValue).toBeCalledWith("test value");
		});
	});

	describe("[Method]: getFilteredOptions", () => {
		it("should filter options by input value", () => {
			component.items = [
				{ id: 1, name: "1 option" },
				{ id: 2, name: "2 option to find" },
				{ id: 3, name: "3 option" },
				{ id: 4, name: "4 option to find" },
				{ id: 5, name: "5 option to find" }
			];
			const result = component.getFilteredOptions(component.items, "find");

			expect(result.length).toBe(3);
			expect(result).toEqual([component.items[1], component.items[3], component.items[4]]);
		});

		it("should return an array that does not exceed the bounds when autocompletePagination = true", () => {
			component.autocompletePagination = true;
			component.autocompletePaginationSize = 2;
			component.items = [
				{ id: 1, name: "101 option" },
				{ id: 2, name: "102 option to find" },
				{ id: 3, name: "103 option" },
				{ id: 4, name: "104 option to find" },
				{ id: 5, name: "105 option to find" },
				{ id: 6, name: "106 option to find" }
			];
			const result = component.getFilteredOptions(component.items, "find");

			expect(result.length).toBe(2);
			expect(result).toEqual([component.items[1], component.items[3]]);
		});
	});

	describe("[Method]: restoreSelectedOption", () => {
		it("should restore selected option - case userInputControl.value is equal selectedItem", () => {
			component.userInputControl.setValue(null);
			component.selectedItem = null;
			component.restoreSelectedOption(false);

			expect(component.userInputControl.value).toEqual(component.selectedItem);
		});

		it("should not restore selected option when isBlurEvent=true", () => {
			component.userInputControl.setValue("test");
			component.selectedItem = null;
			component.filteredOptions = [
				{ id: 1, name: "1 option" },
				{ id: 2, name: "2 option to find" },
				{ id: 3, name: "3 option" }
			];
			component.restoreSelectedOption(true);

			expect(component.filteredOptions.length).toBe(3);
			expect(component.userInputControl.value).toBe("test");
		});

		it("should restore selected option when isBlurEvent=false", () => {
			const setValue = jest.spyOn(component.userInputControl, "setValue");
			component.userInputControl.setValue(null);
			component.selectedItem = { id: 3, name: "3 option" };
			component.items = [
				{ id: 1, name: "1 option" },
				{ id: 2, name: "2 option to find" },
				{ id: 3, name: "3 option" }
			];
			component.restoreSelectedOption(false);

			expect(component.filteredOptions).toEqual([{ id: 3, name: "3 option" }]);
			expect(setValue).toBeCalled();
			expect(setValue).toBeCalledWith(component.selectedItem, { "emitEvent": false });
		});
	});

	describe("[Method]: getAutomationLabel", () => {
		it("should get label for auto tests based on placeholder or automationLabel if placeholder is empty", () => {
			component.placeholder = "This is placeholder";
			component.automationLabel = "This is automation label";

			expect(component.getAutomationLabel()).toEqual(component.placeholder);

			component.placeholder = "";
			expect(component.getAutomationLabel()).toEqual(component.automationLabel);
		});
	});

	describe("[Method]: showInputDefaultValueStyle", () => {
		it("should return false if selectedItem was chosen or defaultValue, defaultValueStyle are empty", () => {
			component.defaultValue = null;
			expect(component.showInputDefaultValueStyle()).toBeFalsy();

			component.defaultValue = "None";
			component.selectedItem = null;
			expect(component.showInputDefaultValueStyle()).toBeFalsy();

			component.selectedItem = {};
			component.defaultValueStyle = null;
			expect(component.showInputDefaultValueStyle()).toBeFalsy();
		});

		it("should return true if defaultValue, defaultValueStyle were defined and selectedItem was not chosen", () => {
			component.defaultValue = "None";
			component.selectedItem = null;
			component.defaultValueStyle = "{ 'font-style': 'italic' }";

			expect(component.showInputDefaultValueStyle()).toBeTruthy();
		});
	});

	describe("[Method]: displayFn", () => {
		it("should return display value when item exist and not empty", () => {
			component.displayedProperty = "text";
			const item = {
				isDefault: false,
				text: "ProjectForPerformance",
				value: 116
			};
			const result = component.displayFn(item);

			expect(result).toBe("ProjectForPerformance");
		});

		it("should return display value base on defaultValue when item exist and value is empty", () => {
			component.displayedProperty = "text";
			const item = {
				isDefault: false,
				text: "",
				value: 116
			};
			const result = component.displayFn(item);

			expect(result).toBe("");
		});

		it("should return empty string when item is not exist", () => {
			component.defaultValue = "text";
			const result = component.displayFn();

			expect(result).toBe(component.defaultValue);
		});
	});

});
