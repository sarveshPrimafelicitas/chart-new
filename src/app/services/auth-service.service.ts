import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor() {}
  http = inject(HttpClient);

  findOldVirtualId(id: any): Observable<{ status: any; data: any }> {
    const url = `${environment.domain}/auth/v1/find_old_virtual_id`;

    // console.log("id",id)

    return this.http.get<{ status: any; data: any }>(url, {
      headers: { someid: id },
    });
  }

  findVirtualId(
    id: any,
    _awareid: any,
    po_id: any
  ): Observable<{ status: any; data: any }> {
    const url = `${environment.domain}/auth/v1/find_virtual_id`;

    // console.log("url", id, _awareid, po_id)
    return this.http.get<{ status: any; data: any }>(url, {
      headers: { someid: id, _awareid: _awareid, po_id: po_id },
    });
  }

  anotherUselessData(id: any): Observable<{ status: any; data: any }> {
    const url = `${environment.domain}/auth/v1/another_useless_data`;

    return this.http.get<{ status: any; data: any }>(url, {
      headers: { someid: id },
    });
  }

  someUselessData(id: any): Observable<{ status: any; data: any }> {
    const url = `${environment.domain}/auth/v1/some_useless_data`;
    return this.http.get<{ status: any; data: any }>(url, {
      headers: { someid: id },
    });
  }

  getMetarialData(): Observable<{ status: any; data: any }> {
    const url = `${environment.domain}/auth/v1/get_metarial_data`;

    return this.http.get<{ status: any; data: any }>(url);
  }

  getAwareAssetDataRequest(data: any): Observable<{ status: any; data: any }> {
    const url = `${environment.domain}/auth/v1/awareAssetData`;
    return this.http.post<{ status: any; data: any }>(url, { data });
  }
}
