import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCarAlt, faChair, faDoorOpen, faImage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.css'
})
export class VehicleFormComponent implements OnInit {
  vehicleForm!: FormGroup;

  //icons
  faCar: IconDefinition = faCarAlt;
  faDoor: IconDefinition = faDoorOpen;
  faImage: IconDefinition = faImage;
  faPositions: IconDefinition = faChair;

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
      this.loadForm();
  }

  loadForm(){
    this.vehicleForm = this.fb.group({
      name: ['',  [Validators.required, Validators.maxLength(50)]],
      doors: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.max(20)]],
      positions: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      generic_image: ['', [Validators.required], [this.fileSizeValidator(3064)]],
      large_suitcases: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.max(1000)]],
      small_suitcases: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.max(1000)]],
      cylinder_capacity: ['', [Validators.required]]
    });
  }

  fileSizeValidator(maxSizeKB: number) {
    return (control: AbstractControl) => {
      const file = control.value;
      if (file) {
        const fileSizeKB = Math.round(file.size / 1024);
        if (fileSizeKB > maxSizeKB) {
          return { fileSize: true };
        }
      }
      return null;
    };
  }

  get genericImage() {
    return this.vehicleForm.get('generic_image');
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.genericImage?.setValue(input.files[0]);
    }
  }
}
