import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TagDTO } from "../../model/tag/tag-dto";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private baseUrl = `${environment.apiUrl}/recipes/tag`;

  constructor(private http: HttpClient) {}

  getAllTags(): Observable<TagDTO[]> {
    return this.http.get<TagDTO[]>(`${this.baseUrl}`, { withCredentials: true });
  }

  createTag(tag: TagDTO): Observable<TagDTO> {
    return this.http.post<TagDTO>(`${this.baseUrl}`, tag, { withCredentials: true });
  }

  updateTag(tag: TagDTO): Observable<TagDTO> {
    return this.http.patch<TagDTO>(`${this.baseUrl}`, tag, { withCredentials: true });
  }

  deleteTag(tagId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${tagId}`, { withCredentials: true });
  }
}
