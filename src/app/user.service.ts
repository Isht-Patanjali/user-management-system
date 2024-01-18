import { Injectable } from '@angular/core';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersKey = 'users';

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  }

  addUser(user: User): void {
    const users = this.getUsers();
    user.id = users.length + 1;
    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  deleteUser(user: any, isEdit = false): void {

    const storedArray = this.getUsers();

    const indexToRemove = storedArray.findIndex(
      (element: any) => element.id === user.id
    );

    if (indexToRemove !== -1) {
      if (isEdit) {
        storedArray[indexToRemove] = user;
        localStorage.setItem(this.usersKey, JSON.stringify(storedArray));
      } else {
        storedArray.splice(indexToRemove, 1);
        localStorage.setItem(this.usersKey, JSON.stringify(storedArray));
      }

    } else {
      console.log(`Element not found: ${user}`);
    }
  }

  clearStorage() {
    localStorage.clear();
  }

}
