import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { StudentService } from '../_services/student.service'
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.js'

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  @Output() close = new EventEmitter<string>();

  public Families = [];
  images: any

  constructor(private fb: FormBuilder, private router: Router, private _studentService: StudentService) { }

  customError = (statusText, statusMessage) => {
    return {
      statusText: statusText,
      message: statusMessage
    }
  }

  ngOnInit(): void {
    this._studentService.getFamilies()
      .subscribe((data) => {
        this.Families = data;
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

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }

  imageSubmit(studentId) {
    const formData = new FormData();
    formData.append('file', this.images);

    this._studentService.addImage(formData, studentId)
      .subscribe(
        response => {
          console.log('Success!', response);
        },
        error => {
          console.error('Error!', error)
        }
      )
  }

  studentSubmit() {
    this.closeParent();
    this._studentService.addStudent(this.addStudent.value)
      .subscribe(
        response => {
          this.imageSubmit(response.id);
          this.closeParent();
          this.showSuccess();
        },
        error => {
          this.showError();
        }
      )
  }

  closeParent(): void {
    this.close.next();
  }

  showSuccess = () => {
    Swal.fire({
      icon: 'success',
      title: 'Student Added successfully',
      html: 'Redirecting to the Students...',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    })
  }

  showError = () => {
    Swal.fire({
      icon: 'error',
      title: 'Somthing Went Wrong',
      //text: 'Please Try Again',
      showConfirmButton: true,
      confirmButtonText: "Try Again",
      confirmButtonColor: '#9c27b0',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
      }
    })
  }

}
