import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, FormArray, FormBuilder} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
    selector: 'data-driven',
    templateUrl: 'data-driven.component.html'
})
export class DataDrivenComponent {
  myForm: FormGroup;

  genders = [
    'male',
    'female'
  ];

  constructor(private formBuilder: FormBuilder){
    // this.myForm = new FormGroup({
    //   'userData': new FormGroup({
    //     'username': new FormControl('Andrew', Validators.required),
    //     'email'   : new FormControl('', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")])
    //   }),
    //   'password': new FormControl('', Validators.required),
    //   'gender': new FormControl('male'),
    //   'hobbies': new FormArray([
    //     new FormControl('Cooking', Validators.required),
    //     new FormControl('Gaming', Validators.required)
    //   ])
    //
    // });

    this.myForm = formBuilder.group({
      'userData': formBuilder.group({
        'username': ['Andrey',
          [
            Validators.required,
            this.testCustomValidator
          ]
        ],
        'email' : ['',
          [
            Validators.required,
            Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
          ]
        ]
      }),
      'password': ['', Validators.required],
      'gender': ['male'],
      'hobbies': formBuilder.array(
        [
          ['Cooking', Validators.required, this.testAsyncValidator]
        ]
      )

    });

    // this.myForm.valueChanges.subscribe(
    //   (data: any) => console.log(data)
    // );
    
    this.myForm.statusChanges.subscribe(
      (data: any) => console.log(data)
    );
  }

  onSubmit() {
    console.log(this.myForm)
  }

  onAddHobby(){
    (<FormArray>this.myForm.controls['hobbies']).push(new FormControl('', Validators.required, this.testAsyncValidator))
  }

  testCustomValidator(control: FormControl): {[s: string]: boolean}{
    if(control.value === 'Test'){
      return {test: true};
    }
    return null;
  }

  testAsyncValidator(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>(
      (resolve, reject) => {
        setTimeout(() => {
          if(control.value === 'Test') {
            //any result except null  will tell to angular2 that validation failed
            resolve({'invalid': true})
          }
          else{
            resolve(null)
          }
        }, 1500)
      }
    );
    return promise;
  }
}
