import {Directive, EventEmitter, ElementRef, Renderer, HostListener, Input, Output} from '@angular/core';

// import {setProperty} from 'angular2/ts/src/core/forms/directives/shared';
function setProperty(renderer:Renderer, elementRef:ElementRef, propName:string, propValue:any):void {
  renderer.setElementProperty(elementRef, propName, propValue);
}

@Directive({selector: 'rkTableFiltering'})
export class RkTableFilteringDirective {
  @Input() public rkTableFiltering:any = {
    filterString: '',
    columnName: 'name'
  };

  @Output() public tableChanged:EventEmitter<any> = new EventEmitter();

  @Input()
  public get config():any {
    return this.rkTableFiltering;
  }

  public set config(value:any) {
    this.rkTableFiltering = value;
  }

  private element:ElementRef;
  private renderer:Renderer;

  @HostListener('input', ['$event.target.value'])
  public onChangeFilter(event:any):void {
    this.rkTableFiltering.filterString = event;
    this.tableChanged.emit({filtering: this.rkTableFiltering});
  }

  public constructor(element:ElementRef, renderer:Renderer) {
    this.element = element;
    this.renderer = renderer;
    // Set default value for filter
    setProperty(this.renderer, this.element, 'value', this.rkTableFiltering.filterString);
  }
}
