import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatFormFieldModule} from '@angular/material/form-field'
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';

import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { ExperimentFormComponent } from './components/experiment-form/experiment-form.component';
import { ExperimentFormUpdateComponent } from './components/experiment-form-update/experiment-form-update.component';
import { ExperimentFormContentComponent } from './components/experiment-form-content/experiment-form-content.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropdownComponent } from './components/experiment-form/dropdown/dropdown.component';
import { CustomOptionComponent } from './components/experiment-form/custom-option/custom-option.component';
import { DropdownUpdateComponent } from './components/experiment-form-update/dropdown-update/dropdown-update.component';
import { DropdownContentComponent } from './components/experiment-form-content/dropdown-content/dropdown-content.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from "@angular/material/divider";
import { MatErrorMessagesDirective } from '../app/components/experiment-form/matErrorMessages.directive'
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    ExperimentFormComponent,
    DropdownComponent,
    MatErrorMessagesDirective,
    
    ExperimentFormUpdateComponent,
    DropdownUpdateComponent,

    DropdownContentComponent,
    ExperimentFormContentComponent,

    CustomOptionComponent
  ],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatIconModule,

    FormsModule, ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    NoopAnimationsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
