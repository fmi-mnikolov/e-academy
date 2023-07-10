import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentType, ContentComponent } from 'src/app/models/lesson';

@Component({
  selector: 'app-content-component',
  templateUrl: './content-component.component.html',
  styleUrls: ['./content-component.component.css']
})
export default class ContentComponentComponent {
  componentForm!: FormGroup;
  file!: File;

  constructor(fb: FormBuilder) {
    this.componentForm = fb.group({
      type: ["TITLE", Validators.required],
      value: ["", Validators.required]
    });
  }


  @Output()
  saveEmitter: EventEmitter<ContentComponent> = new EventEmitter();

  @Output()
  filesEmitter: EventEmitter<File> = new EventEmitter();

  save() {
    this.saveEmitter.emit(this.componentForm.value);
    this.filesEmitter.emit(this.file);
    this.componentForm.reset();
  }

  uploadFile(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
  }

  getTypes() {
    return Object.keys(ComponentType).filter(l => isNaN(Number(l)));
  }

  get Ftype() {
    return this.componentForm.get('type')!.value;
  }

  set type(event: string) {
    this.componentForm.get("type")?.setValue(event);
  }

  updateType(event: Event) {
    this.componentForm.get("type")?.setValue((event.target as HTMLSelectElement).value);
  }
}
