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
    const res = await this.HttpClient.post(
      `http://${this.hostname}:${5555}/message`,
      body
    ).toPromise();
    return res;
  }
  
  public async SendQuery(message: string) {
    const body = new FormData();
    body.append('message', message);
    const res = await this.HttpClient.post(
      `http://${this.hostname}:${5555}/query`,
      body
    ).toPromise();
    return res;
  }

  public async sendAudio(audio: Blob) {
    const body = new FormData();

    body.append('audio', audio);

    this.HttpClient.post(`http://${this.hostname}:${5555}/audio`, body)
      .toPromise()
      .then(() => {
        console.log('audio send');
      });
  }

  public async startAudioBack() {
    const body = new FormData();
    body.append('mensage', JSON.stringify({ audio: true }));
    return new Promise((res, rej) => {
      this.HttpClient.post(`http://${this.hostname}:${5555}/start-audio`, body)
        .toPromise()
        .then((resolve) => {
          res(resolve);
        });
    });
  }
}
