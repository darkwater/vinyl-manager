import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Repository } from "./repository";

@Injectable({
    providedIn: "root"
})
export class ManagerService {

    private api = "http://localhost:4201";

    constructor(private http: HttpClient) { }

    getRepositories(): Observable<Repository[]> {
        const url = `${this.api}/repositories`;

        return this.http.get<Repository[]>(url).pipe(
            catchError(this.handleError("getRepositories", []))
        );
    }

    updateRepository(repo: Repository): Observable<any> {
        const url = `${this.api}/repositories/${repo.id}`;

        return this.http.put(url, repo).pipe(
            catchError(this.handleError("updateRepository"))
        );
    }

    private handleError<T>(method = "<unspecified>", result?: T) {
        return (error: any): Observable<T> => {
            console.error(`${method} failed:`, error);
            return of(result);
        }
    }

}
