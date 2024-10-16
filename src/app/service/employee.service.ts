import { Injectable, inject } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Employee} from "../model/employee";
import { Database, ref, set, push, get} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  private db: Database = inject(Database);
  employees$: BehaviorSubject<readonly Employee[]> = new BehaviorSubject<readonly Employee[]>([]);

  get $(): Observable<readonly Employee[]> {
    return this.employees$;
  }

  addEmployee(employee: Employee) {
    const employeesRef = ref(this.db, 'employees');
    push(employeesRef, employee).then(() => {
      this.employees$.next([...this.employees$.getValue(), employee]);
    });
    return true;
  }
  
  getEmployees(): Observable<readonly Employee[]> {
    return this.employees$.asObservable();
  }
  fetchEmployees() {
    const employeesRef = ref(this.db, 'employees');
    get(employeesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const employees: Employee[] = Object.values(snapshot.val());
        this.employees$.next(employees);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
}
