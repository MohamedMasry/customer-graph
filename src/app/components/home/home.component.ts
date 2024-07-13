import { Component, OnInit, ElementRef } from '@angular/core';
import { ApidataService } from 'src/app/core/services/apidata.service';
import Chart from 'chart.js/auto';

interface Transaction {
  id: number;
  customer_id: number;
  date: string;
  amount: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private _ApidataService: ApidataService
  ) { }

  allData: any;
  customersData: any;
  transactions: Transaction[] = [];
  totalChart: any = [];
  detailedChart: any = [];
  customersNames: any = [];
  totalTransactions: any = [];
  viewToggle:string = 'tableView';
  currentCustomer:string = 'Customer';
  totalCurrentAmount:number = 0;

  ngOnInit(): void {

    this.getClientsData();

  }

  getClientsData() {
    this._ApidataService.getCustomers().subscribe({
      next: (response) => {
        this.allData = response.record;
        this.customersData = response.record.customers;
        this.transactions = response.record.transactions;
        this.customersNames = this.customersData?.map((cust: any) => cust.name as string);
        for (let i = 0; i < this.customersData.length; i++) {
          this.totalTransactions.push(this.transactions?.filter((user: Transaction) => user.customer_id === i + 1).reduce((total: number, trans) => total + trans.amount, 0));
        }

        this.totalChart = new Chart('totalCanvas', {
          type: 'line',
          data: {
            labels: this.customersNames,
            datasets: [{
              label: 'Transactions Amount',
              data: this.totalTransactions,
              borderWidth: 1,
              pointStyle: 'circle',
              pointRadius: 10,
              pointHoverRadius: 15
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })

        this.detailedChart = new Chart('detailedChart', {
          type: 'line',
          data: {
            labels: this.customersNames,
            datasets: [{
              label: 'Transactions Amount',
              data: this.totalTransactions,
              borderWidth: 1,
              pointStyle: 'circle',
              pointRadius: 10,
              pointHoverRadius: 15
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })
      },
      error: (error) => {
        console.log(error)
      }
    })



  }
  getTotalTransactions(userId: number): number {
    let Total = this.transactions?.filter((user: Transaction) => user.customer_id === userId).reduce((total: number, trans) => total + trans.amount, 0);
    return Total;
  }


  searchByName(search: HTMLInputElement) {
    if (search.value.length > 0) {
      this.customersData = this.allData?.customers?.filter((user: any) => user.name.toLowerCase().includes(search.value.toLowerCase()));
    }
    else {
      this.getClientsData()
    }

  }

  getCustomerChart(custId: number,custName:string) {
    this.currentCustomer = custName;
    this.totalCurrentAmount = this.getTotalTransactions(custId);
    let userTransactions = this.transactions?.filter((user: Transaction) => user.customer_id === custId);
    this.detailedChart.data.labels = userTransactions?.map((cust: any) => cust.date as string);
    this.detailedChart.data.datasets[0].data = userTransactions?.map((cust: any) => cust.amount as string)
    this.detailedChart.update();
  }

  toggleViewStyle(element:any){

    if(element.target.id === "cardsView"){
      this.viewToggle = "cardsView";
    }
    else{
      this.viewToggle = "tableView";
    }
  }

}


