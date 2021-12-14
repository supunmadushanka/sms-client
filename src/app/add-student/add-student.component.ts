import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { StudentService } from '../_services/student.service'
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  public Families = [];

  constructor(private fb: FormBuilder, private router: Router, private _studentService: StudentService) { }

  ngOnInit(): void {
    this._studentService.getFamilies()
      .subscribe((data) => {
        this.Families = data;
        console.log(data);
      },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              //this.router.navigate(['/home'])
            }
          }
        }
      );
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

  studentSubmit() {

  }

}
