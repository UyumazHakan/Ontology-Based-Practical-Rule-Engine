import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { User } from "./user";
import { environment } from "../environments/environment";
import { map } from "rxjs/operators";

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}
  get currentUser(): User {
    return JSON.parse(localStorage.getItem("currentUser"));
  }
  getAll() {
    return this.http.get<User[]>(environment.hal.url + "/users");
  }

  getById(id: string) {
    return this.http.get(environment.hal.url + "/users/" + id);
  }

  create(user: User) {
    return this.http.post(environment.hal.url + "/users/register", user);
  }

  update(user: User) {
    return this.http.put(environment.hal.url + "/users/" + user.id, user);
  }

  delete(id: string) {
    return this.http.delete(environment.hal.url + "/users/" + id);
  }
  login(username: string, password: string) {
    return this.http
      .post<any>(environment.hal.url + "/users/authenticate", {
        username: username,
        password: password
      })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
          }

          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
  }
}
