import { isNullOrUndefined } from "util";
import { AbstractControl } from '@angular/forms';

export function validateDuplicateMapField(controls: { [key: string]: AbstractControl }): void {
    for (const [nameControl, control] of Object.entries(controls)) {
        console.dir( control);
        console.dir( control.value);
        const fieldType = control.value?.fieldType;
        let count = 0;

        if(isNullOrUndefined(fieldType)) { continue; }

        for (const [nameControlS, controlS] of Object.entries(controls)) {
            if(nameControl !== nameControlS && fieldType === controlS.value?.fieldType) {
                controlS.setErrors({ duplicateMapFieldError: true });
                controlS.markAsDirty();
                count++;
            }
        }

        if(count > 0) {
            control.setErrors({ duplicateMapFieldError: true });
            control.markAsDirty();
        }
    }
}