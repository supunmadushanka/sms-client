import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from 'devextreme-angular';

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

  constructor(private http: HttpClient) {

    this.refreshMode = 'full';
    this.refreshModes = ['full', 'reshape', 'repaint'];

    this.dataSource = new CustomStore({
      key: 'id',
      load: () => this.sendRequest(`${environment.baseURL}students/getall`),
      insert: (values) => this.sendRequest(`${environment.baseURL}students/add`, 'POST',
        JSON.parse(JSON.stringify(values))
      ),
      update: (key, values) => this.sendRequest(`${environment.baseURL}students/update`, 'PUT', {
        key,
        values: JSON.stringify(values),
      }),
      remove: (key) => this.sendRequest(`${environment.baseURL}students/delete`, 'DELETE', {
        key,
      }),
    });

    this.FamilyData = {
      paginate: true,
      store: new CustomStore({
        key: 'id',
        loadMode: 'raw',
        load: () => this.sendRequest(`${environment.baseURL}families/getall`),
      }),
    };
  }

  sendRequest(url: string, method = 'GET', data: any = {}): any {
    const httpParams = new HttpParams({ fromObject: data });
    const httpOptions = { withCredentials: false, body: httpParams };
    let result;

    switch (method) {
      case 'GET':
        result = this.http.get<any>(url,httpOptions);
        break;
      case 'PUT':
        result = this.http.put(url, httpParams, httpOptions);
        break;
      case 'POST':
        result = this.http.post(url, httpParams, httpOptions);
        break;
      case 'DELETE':
        result = this.http.delete(url, httpOptions);
        break;
    }

    return result
      .toPromise()
      .then((data: any) => (method === 'GET' ? data : data))
      .catch((e) => {
        throw e && e.error && e.error.Message;
      });
  }


  ngOnInit(): void {
  }

  @ViewChild('myModalClose') modalClose;

  closeModel() {
    this.modalClose.nativeElement.click();
    setTimeout(() => this.dataGrid.instance.refresh(),2500);
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

}
