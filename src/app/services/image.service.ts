import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ImageDTO } from "../../model/image/image-dto";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = `${environment.apiUrl}/image`;

  constructor(private http: HttpClient) {}

  getImageFile(url: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/file/${url}`, { responseType: 'blob', withCredentials: true });
  }

  getImageMetadata(url: string): Observable<ImageDTO> {
    return this.http.get<ImageDTO>(`${this.baseUrl}/db/${url}`, { withCredentials: true });
  }

  getAllImages(): Observable<ImageDTO[]> {
    return this.http.get<ImageDTO[]>(`${this.baseUrl}`, { withCredentials: true });
  }

  uploadImage(file: File): Observable<ImageDTO> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImageDTO>(`${this.baseUrl}`, formData, { withCredentials: true });
  }

  deleteImage(url: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${url}`, { withCredentials: true });
  }
}
