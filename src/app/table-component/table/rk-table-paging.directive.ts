import {Directive, EventEmitter, Input, Output, HostListener} from '@angular/core';

@Directive({selector: 'rkTablePaging'})
export class RkTablePagingDirective {
  @Input() public rkTablePaging:boolean = true;
  @Output() public tableChanged:EventEmitter<any> = new EventEmitter();

  @Input()
  public get config():any {
    return this.rkTablePaging;
  }

  public set config(value:any) {
    this.rkTablePaging = value;
  }

  @HostListener('pagechanged', ['$event'])
  public onChangePage(event:any):void {
    // Object.assign(this.config, event);
    if (this.rkTablePaging) {
      this.tableChanged.emit({paging: event});
    }
  }
}
