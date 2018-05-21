import {Directive, EventEmitter, Input, Output, HostListener} from '@angular/core';

@Directive({selector: 'rkTableSorting'})
export class RkTableSortingDirective {
  @Input() public rkTableSorting:any;
  @Input() public column:any;
  @Output() public sortChanged:EventEmitter<any> = new EventEmitter();

  @Input()
  public get config():any {
    return this.rkTableSorting;
  }

  public set config(value:any) {
    this.rkTableSorting = value;
  }

  @HostListener('click', ['$event', '$target'])
  public onToggleSort(event:any):void {
    if (event) {
      event.preventDefault();
    }

    if (this.rkTableSorting && this.column && this.column.sort !== false) {
      switch (this.column.sort) {
        case 'asc':
          this.column.sort = 'desc';
          break;
        case 'desc':
          this.column.sort = '';
          break;
        default:
          this.column.sort = 'asc';
          break;
      }

      this.sortChanged.emit(this.column);
    }
  }
}
