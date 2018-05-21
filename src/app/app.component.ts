import { Component, OnInit, TemplateRef } from '@angular/core';
import { TableData } from './json-data/data-table';
import { IntitalFinanceList } from './json-data/finance-object';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public rows: Array<any> = [];
  private modalData: any;
  modalRef: BsModalRef;
  private editable: boolean = false;
  private radioValue: any;
  private addClicked: boolean = false;
  private saveDisabled: boolean = true;

  //TODO: Hard coded Values to be moved to Constants
  public columns: Array<any> = [
    { title: 'Company Name', name: 'company_name', filtering: { filterString: '', placeholder: 'Filter by Company' } },
    {
      title: 'Status',
      name: 'status',
      sort: 'asc'
    },
    { title: 'Company Info', className: ['office-header', 'text-success'], name: 'company_info' },
    { title: 'Contacts', name: 'contacts', sort: '', filtering: { filterString: '', placeholder: 'Filter by extn.' } },
    { title: 'Revenue', className: 'text-warning', name: 'net_revenue' },
  ];

  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };
  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;
  private copy: any;
  private finArr: Array<any> = IntitalFinanceList;
  private finArrCopy = JSON.parse(JSON.stringify(this.finArr))
  private data: Array<any> = TableData;
  public barChartLabels: string[];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: any[];
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: false
  };

  public constructor(private modalService: BsModalService) {
    this.length = this.data.length;
  }

  public ngOnInit(): void {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].contacts = this.data[i].contacts.join();
    }
    this.onChangeTable(this.config);
  }

  public changePage(page: any, data: Array<any> = this.data): Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  public changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  //Filtering
  public changeFilter(data: any, config: any): any {
    let filteredData: Array<any> = data;
    this.columns.forEach((column: any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => {
          return item[column.name].match(column.filtering.filterString);
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(this.config.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
      let flag = false;
      this.columns.forEach((column: any) => {
        if (item[column.name].toString().match(this.config.filtering.filterString)) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  //On Change in Info
  public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }

  //Viewing Records
  public onCellClick(data: any, template: TemplateRef<any>): any {
    //Maintain a copy incase user clicks on cancels
    this.copy = JSON.parse(JSON.stringify(this.data))
    this.editable = false;
    let yearList: Array<string> = [];
    let revenueList: Array<string> = [];

    for (let i = 0; i < data.financial_information.length; i++) {
      yearList.push(data.financial_information[i].year);
      revenueList.push(data.financial_information[i].revenue);
    }
    this.barChartLabels = yearList;
    this.barChartData = [
      { data: revenueList, label: 'Revenue' }
    ];
    this.modalRef = this.modalService.show(template);
    this.modalData = data;
    console.log(data);
  }

  //Edit a Record
  public onEditClick(data: any, template: TemplateRef<any>): any {
    this.addClicked = false;
    this.copy = JSON.parse(JSON.stringify(this.data))
    this.editable = true;
    this.finArr = data.financial_information;
    this.modalRef = this.modalService.show(template);
    this.modalData = data;
    console.log(data);
  }

  //Adding a Record
  public onAddClick(data: any, template: TemplateRef<any>): any {
    this.addClicked = true;
    this.finArr = this.finArrCopy;
    this.copy = JSON.parse(JSON.stringify(this.data))
    this.editable = true;
    this.modalRef = this.modalService.show(template);
    this.modalData = {};
    this.modalData.id = Math.random() * 100;
    this.modalData.status = "";
    this.modalData.company_info = "";
    this.modalData.contacts = "";
    this.modalData.status = "";
    this.modalData.company_name = "";
    this.modalData.net_revenue = "";
    this.modalData.financial_information = this.finArr;
    console.log(data);
  }

  //Deleting a Record
  public onDeleteClick(data: any): any {
    let newData: any;
    newData = this.data.filter(x => x.id != data.id);
    this.data = newData;
    this.onChangeTable(this.config);
  }

  //On Click of Save in Modal Popup
  saveData(data: any) {
    //TODO: Due to time limitation- Just displaying and error alert- A proper error Validation Approach can be Implemented
    if (this.modalData.status == "" || this.modalData.company_info == "" || this.modalData.contacts == "" || this.modalData.company_name == "" || this.modalData.net_revenue == "") {
      alert("Mandatory Fields are Not Filled, Please fill");
      return;
    }

    // this.modalData.status = this.radioValue;
    if (this.addClicked) {
      this.data.push(this.modalData);
    }
    // data.status = this.radioValue;
    this.onChangeTable(this.config);
    this.modalRef.hide()
    this.finArr = this.finArrCopy
  }

  //On Closing Modal Popup
  cancel() {
    this.data = this.copy;
    this.onChangeTable(this.config);
    this.modalRef.hide()
  }

}

