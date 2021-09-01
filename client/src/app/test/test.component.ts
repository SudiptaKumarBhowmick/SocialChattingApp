import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  signUpForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    conPassword: new FormControl('', this.equalPassValidator('password'))
  })

  submitData() {
    // TODO something
  }

  equalPassValidator(appEqualValidator: string): ValidatorFn {
    return (c: AbstractControl): { [key: string]: any | null } => {
        console.log("control object: ", c, appEqualValidator)
        const controlToCompare = c.root.get(appEqualValidator);
        console.log('control to compare: ', controlToCompare);
        if (controlToCompare && controlToCompare.value === c.value) return { "equal": true };
        return { "equal": false }
    }
}

}
