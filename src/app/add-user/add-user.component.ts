import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  public addUserForm: any;
  public receivedData: any;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {
    this.addUserForm = FormGroup;
    if(this.router.getCurrentNavigation()?.extras.state) {
      this.receivedData = this.router.getCurrentNavigation()?.extras.state;
    }
  }

  ngOnInit(): void {

    this.addUserForm = this.formBuilder.group({
      name: [this.receivedData ? this.receivedData.user?.name : '', [Validators.required]],
      email: [this.receivedData ? this.receivedData.user?.email : '', [Validators.required, Validators.email]],
      role: [this.receivedData ? this.receivedData.user?.role : '', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.addUserForm.valid) {
      if(this.receivedData.name === 'Edit') {
        this.receivedData.user.name = this.addUserForm.value.name;
        this.receivedData.user.email = this.addUserForm.value.email;
        this.receivedData.user.role = this.addUserForm.value.role;
        this.userService.deleteUser(this.receivedData.user, true);
        this.addUserForm.reset();
        this.router.navigateByUrl('/');
      } else {
        const newUser: User = this.addUserForm.value;
        this.userService.addUser(newUser);
        this.addUserForm.reset();
        this.router.navigateByUrl('/');
      }
    }
  }

  getUser() {
    const users = this.userService.getUsers();
  }

}
