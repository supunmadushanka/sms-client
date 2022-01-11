import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from 'devextreme-angular';
import { StudentService } from '../_services/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  @ViewChild('dataGridVar', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('myModalClose') modalClose;

  dataSource: any;
  refreshModes: string[];
  refreshMode: string;
  FamilyData: any;
  imageSrc : any;

  constructor(private http: HttpClient,private _studentService: StudentService) {

    this.refreshMode = 'full';
    this.refreshModes = ['full', 'reshape', 'repaint'];

    this.dataSource = new CustomStore({
      key: 'id',
      load: () => 
        this._studentService.getStudents()
          .toPromise()
          .then(
            (data: any) => (data),
          )
      ,
      insert: (values) => 
        this._studentService.addStudent(JSON.parse(JSON.stringify(values)))
          .toPromise()
      ,
      update: (key, values) => 
        this._studentService.updateStudent({key,values: JSON.stringify(values),})
          .toPromise()
      ,
      remove: (key) => 
        this._studentService.deleteStudent({key})
          .toPromise()
    });

    this.FamilyData = {
      paginate: true,
      store: new CustomStore({
        key: 'id',
        loadMode: 'raw',
        load: () => 
          this._studentService.getFamilies()
          .toPromise()
          .then(
            (data: any) => (data),
          )
      }),
    };
  }

  closeModel() {
    this.modalClose.nativeElement.click();
    setTimeout(() => this.dataGrid.instance.refresh(), 2500);
  }

  sourceSelect(src){
    this.imageSrc = src;
  }

  exportGrid(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Students');
    exportDataGrid({
      worksheet: worksheet,
      component: e.component
    }).then(function () {
      workbook.xlsx.writeBuffer().then(function (buffer: BlobPart) {
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Students.xlsx");
      });
    });
    e.cancel = true;
  }

  ngOnInit(): void {
  }

}
