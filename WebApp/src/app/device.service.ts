import { Injectable } from "@angular/core";
import { Device } from "./device";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root"
})
export class DeviceService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Device[]>(environment.hal.url + "/devices");
  }

  getById(id: string) {
    return this.http.get(environment.hal.url + "/devices/" + id);
  }

  create(device: Device) {
    return this.http.post(environment.hal.url + "/devices/create", device);
  }

  update(device: Device) {
    return this.http.put(environment.hal.url + "/devices/" + device.id, device);
  }

  delete(id: string) {
    return this.http.delete(environment.hal.url + "/devices/" + id);
  }

  getApiVersion() {
    return this.http.get(environment.hal.url + "/devices/api");
  }

  getFilePaths(device: Device) {
    return this.http.post<string[]>(
      environment.hal.url + "/devices/getFileNames",
      device
    );
  }
}
