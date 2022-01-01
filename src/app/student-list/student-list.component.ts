import { Component, OnInit,ViewChild } from '@angular/core';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('myModalClose') modalClose;

  closeModel(){
    this.modalClose.nativeElement.click();
  }

}
