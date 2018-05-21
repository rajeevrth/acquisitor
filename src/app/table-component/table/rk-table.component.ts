import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
// import {CORE_DIRECTIVES, NgClass} from '@angular/common';
import { RkTableSortingDirective } from './rk-table-sorting.directive';

@Component({
  selector: 'rk-table',
  templateUrl: './rk-table.component.html',
  styleUrls: ['./rk-table.component.css']
})
export class RkTableComponent implements OnInit {
  // Table values
  @Input() public rows: Array<any> = [];
  @Input() public config: any = {};
  public years: string[];
  public revenues: string[];

  // Outputs (Events)
  @Output() public tableChanged: EventEmitter<any> = new EventEmitter();
  @Output() public cellClicked: EventEmitter<any> = new EventEmitter();
  @Output() public editClicked: EventEmitter<any> = new EventEmitter();
  @Output() public deleteClicked: EventEmitter<any> = new EventEmitter();
  @Output() public addClicked: EventEmitter<any> = new EventEmitter();
  ngOnInit() {
  }
  @Input()
  public set columns(values: Array<any>) {
    values.forEach((value: any) => {
      let column = this._columns.find((col: any) => col.name === value.name);
      if (column) {
        Object.assign(column, value);
      }
      if (!column) {
        this._columns.push(value);
      }
    });
  }

  public get columns(): Array<any> {
    return this._columns;
  }

  public get configColumns(): any {
    let sortColumns: Array<any> = [];

    this.columns.forEach((column: any) => {
      if (column.sort) {
        sortColumns.push(column);
      }
    });

    return { columns: sortColumns };
  }

  private _columns: Array<any> = [];


  public onChangeTable(column: any): void {
    this._columns.forEach((col: any) => {
      if (col.name !== column.name) {
        col.sort = '';
      }
    });
    this.tableChanged.emit({ sorting: this.configColumns });
  }

  public getData(row: any, propertyName: string): string {
    debugger;
    return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
  }
  public getBarChartData(row: any) {
  }
  selectCompany(row: any) {
    this.cellClicked.emit(row);
  }
  editCompany(row: any) {
    this.editClicked.emit(row);
  }
  deleteCompany(row: any) {
    this.deleteClicked.emit(row);
  }

  addCompany(row:any){
    this.addClicked.emit(row);
  }


}
