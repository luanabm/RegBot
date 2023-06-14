import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class ChatService {
  constructor(private HttpClient: HttpClient) {}
  private hostname = 'localhost';
  private PORT = 5555;
  private answer: string;

  public async SendMessage(message: string) {
    const body = new FormData();
    body.append('message', message);
    console.log(message)
    const res = await this.HttpClient.post(
      `http://${this.hostname}:${5555}/message`,
      body
    ).toPromise();
    return res;
  }
  
  public async SendQuery(message: string) {
    const body = new FormData();
    body.append('message', message);
    console.log(message)
    const res = await this.HttpClient.post(
      `http://${this.hostname}:${5555}/query`,
      body
    ).toPromise();
    return res;
  }

  public startAudioBack() {
    const body = new FormData();
    body.append('message', JSON.stringify({ audio: true }));
    const res = this.HttpClient.post(`http://${this.hostname}:${5555}/`, body)
        .toPromise()
        console.log(res)
    return res;
  }

  
}
