import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../_services/student.service';
import { HttpErrorResponse } from '@angular/common/http';

import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  public Students = [];

  constructor(private _studentService: StudentService) { }

  ngOnInit(): void {
    this._studentService.getStudents()
      .subscribe((data) => {
        this.Students = data;
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

  @ViewChild('myModalClose') modalClose;

  closeModel() {
    this.modalClose.nativeElement.click();
  }

  exportGrid(e) {
    const workbook = new Workbook(); 
    const worksheet = workbook.addWorksheet('Students'); 
    exportDataGrid({ 
        worksheet: worksheet, 
        component: e.component
    }).then(function() {
        workbook.xlsx.writeBuffer().then(function(buffer: BlobPart) { 
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Students.xlsx"); 
        }); 
    }); 
    e.cancel = true; 
}

}
