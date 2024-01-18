import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models/user.model';
import {Sort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { FilterPipe } from '../pipes/filter.pipe';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [FilterPipe],
})
export class UserListComponent implements AfterViewInit {
 
  users: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'action'];
  sortedData: any = [];
  dataSource: any;
  searchText = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService, private router: Router) {
    this.sortedData = this.users.slice(); 
   }

  ngOnInit(): void {
    this.getUsers();
    this.sortedData = new MatTableDataSource<User>(this.users);
  }

  ngAfterViewInit(): void {
    this.sortedData.paginator = this.paginator;
  }

  sortData(sort: Sort) {
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'email':
          return compare(a.email, b.email, isAsc);
        default:
          return 0;
      }
    });
    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }

  getUsers() {
    this.users = this.userService.getUsers();
    this.sortedData = this.users;
    
  }

  addUser(header:string, data?: any) {
    let element; 
    if(header === 'Add') {
      element = {name: header};
    } else {
      element = {name: header, user: data};
    }
    
    const extras = {state: element};
    this.router.navigateByUrl('/add-user', extras);

    // this.userService.clearStorage();
  }

  deleteUser(user: any) {   
    this.userService.deleteUser(user);
    this.getUsers();
  }

  confirmBox(el:any){  
    Swal.fire({  
      title: 'Are you sure want to remove?',  
      text: 'You will not be able to recover this file!',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, delete it!',  
      cancelButtonText: 'No, keep it'  
    }).then((result) => {  
      if (result.value) {  
        this.deleteUser(el);
        Swal.fire(  
          'Deleted!',  
          'Your file has been deleted.',  
          'success'  
        )  
      } else if (result.dismiss === Swal.DismissReason.cancel) {  
        Swal.fire(  
          'Cancelled',  
          'Your file is safe :)',  
          'error'  
        )  
      }  
    })  
  }

}