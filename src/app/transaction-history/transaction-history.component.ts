import { Component, OnInit } from '@angular/core';
import { TransactionHistoryService } from '../services/transaction-history.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  transactions: any[] = [];
  filterForm: FormGroup;
  sortBy: string | null = null;
  sortOrder: 'asc' | 'desc' | null = null;
  currentPage: number = 1;
  totalCount: number = 0;
  itemsPerPage: number = 10;
  startDate!:string
  constructor(
    private transactionHistoryService: TransactionHistoryService,
    private formBuilder: FormBuilder
  ) {
    this.filterForm = this.formBuilder.group({
      transaction_type: [''],
      start_date: [''],
      end_date: ['']
    });
  }

  ngOnInit(): void {
    this.getTransactionHistory(this.currentPage);
  }

  getTransactionHistory(page: number): void {
    this.currentPage = page;

    const filters = this.formatFilterDates(this.filterForm.value);
    this.transactionHistoryService.getTransactionHistory({
      ...filters,
      sort_by: this.sortBy,
      order: this.sortOrder,
      page: this.currentPage,
      limit: this.itemsPerPage
    }).subscribe(
      (response) => {
        this.transactions = response.transactions;
        this.totalCount = response.total_count;
      },
      (error) => {
        console.error('Error fetching transaction history:', error);
      }
    );
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  formatFilterDates(filters: any) {
    const formattedFilters = { ...filters };

    if (filters.start_date) {
      formattedFilters.start_date = new Date(filters.start_date).toISOString().replace('T', ' ').slice(0, 19);
    }

    if (filters.end_date) {
      formattedFilters.end_date = new Date(filters.end_date).toISOString().replace('T', ' ').slice(0, 19);
    }

    return formattedFilters;
  }

  applyFilters(): void {
    this.getTransactionHistory(1);
  }

  resetFilters(): void {
    this.filterForm.reset({
      transaction_type: '',
      start_date: '',
      end_date: ''
    });
    this.sortBy = null;
    this.sortOrder = null;
    this.getTransactionHistory(1);
  }

  toggleSort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : this.sortOrder === 'desc' ? null : 'asc';
      if (this.sortOrder === null) {
        this.sortBy = null;
      }
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.getTransactionHistory(1);
  }

  goToFirstPage(): void {
    this.getTransactionHistory(1);
  }

  goToLastPage(): void {
    this.getTransactionHistory(this.totalPages);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.getTransactionHistory(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.getTransactionHistory(this.currentPage + 1);
    }
  }
  isValid() {
    const startDate = new Date(this.filterForm.value.start_date);
    const endDate = new Date(this.filterForm.value.end_date);
    if (startDate > endDate) {
      alert('Incorrect Data: Start date cannot be after end date');
      (document.getElementById('start_date') as HTMLInputElement).value='';
      (document.getElementById('end_date') as HTMLInputElement).value=''
    }
  }
  
  
}
