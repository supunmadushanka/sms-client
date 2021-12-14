import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
//import { RegistrationService } from '../../registration.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  public Families = [];

  constructor(private fb: FormBuilder,private router: Router) { }

  ngOnInit(): void {
  }

  get firstName() {
    return this.addStudent.get('firstName');
  }
  get secondName() {
    return this.addStudent.get('secondName');
  }

  addStudent = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    secondName: ['', [Validators.required, Validators.minLength(3)]],
    Address: ['', [Validators.required]],
    School: ['', [Validators.required]],
    Family: ['', [Validators.required]]
  })

  studentSubmit(){

  }

}
