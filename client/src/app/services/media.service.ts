import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    url: string = "http://localhost:5001/media";

    constructor(private client: HttpClient) {
    }


    getProfilePicture(name: string): Observable<File> {
        return this.client.post<File>(`${this.url}/users`, { picture: name });
    }

    getSubjectPicture(name: string): Observable<File> {
        return this.client.post<File>(`${this.url}/subjects`, { picture: name });
    }

    getLessonPicture(name: string): Observable<File> {
        return this.client.post<File>(`${this.url}/lessons`, { picture: name });
    }
}