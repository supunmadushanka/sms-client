import { Component, OnInit, ViewChild } from '@angular/core';
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

  dataSource: any;
  refreshModes: string[];
  refreshMode: string;
  FamilyData: any;
  imageSrc: any;
  image: any;
  key: any;
  url: any;

  constructor(private _studentService: StudentService) {

    this.refreshMode = 'full';
    this.refreshModes = ['full', 'reshape', 'repaint'];

    this.dataSource = new CustomStore({
      key: 'id',
      load: () =>
        this._studentService.getStudents()
          .toPromise()
          .then(
            (data: any) => (data),
            res => { // Success
              console.log(res);
            }
          )
          .catch((e) => {
            console.error(e.message);
          })
      ,
      insert: (values) =>
        this._studentService.addStudent(JSON.parse(JSON.stringify(values)))
          .toPromise()
          .then(
            res => { // Success
              console.log("Student Added");
              this.key = res.id;
            }
          )
          .catch((e) => {
            console.error(e.message);
          })
      ,
      update: (key, values) =>
        this._studentService.updateStudent({ key, values: JSON.stringify(values) })
          .toPromise()
          .then(
            res => { // Success
              console.log(res.message);
            }
          )
          .catch((e) => {
            console.error(e.message);
          })
      ,
      remove: (key) =>
        this._studentService.deleteStudent({ key })
          .toPromise()
          .then(
            res => { // Success
              console.log(res.message);
            }
          )
          .catch((e) => {
            console.error(e.message);
          })
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
              res => { // Success
                console.log(res.message);
              }
            )
            .catch((e) => {
              console.error(e.message);
            })
      }),
    };
  }

  setKey(key) {
    this.key = key.key;
    this.url = key.data.profile_picture;
  }

  Clear() {
    this.url = '';
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }

  imageSubmit() {
    if (this.image) {
      const formData = new FormData();
      formData.append('file', this.image);
      this.image = null;
      this._studentService.addImage(formData, this.key)
        .subscribe(
          response => {
            console.log(response.message);
            this.dataGrid.instance.refresh()
            this.url = '';
          },
          error => {
            console.error('Error!', error)
          }
        )
    }
  }

  sourceSelect(src) {
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
