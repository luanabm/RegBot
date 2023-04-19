import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ChatService } from '../../.../../services/chat.service';
import { Chat } from '../.././models/ChatModel';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {
  private blocked: boolean = false;

  isOpen = false;

  mensagens: Chat[] = [];
  valor: string;
  usuario = true;
  url: string;
  chunks: Blob[] = [];
  mediaRecorder: any;
  canRecord = true;

  sliceOptions = {
    start: 0,
    end: 300,
    default: 300
  }

  constructor(private service: ChatService, private dom: DomSanitizer,
    private cd: ChangeDetectorRef) {
    this.mensagens.push({
      mensagem: String('Hi, I am your support agent. How can I assist you?'),
      usuario: false,
      error: true,
      audio: false,
      url : "",
    }); 
    this.sugestion(); 
  }
  ngOnInit(): void {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const options = {
        audioBitsPerSecond: 48000,
        mimeType: 'audio/webm; codecs=opus',
      };
      this.mediaRecorder = new MediaRecorder(stream, options);
      this.mediaRecorder.onstop = async () => {
        console.log('data available after MediaRecorder.stop() called.');
        const blob = new Blob(this.chunks, {
          type: 'audio/webm; codecs=opus',
        });

        this.chunks = [];
        const audioURL = URL.createObjectURL(blob);
        // audio.src = audioURL;

        this.mensagens.push({
          mensagem: this.dom.bypassSecurityTrustUrl(audioURL),
          usuario: true,
          error: false,
          audio: true,
          url: true
        });
        const audioFiles = []
        audioFiles.push(this.dom.bypassSecurityTrustUrl(audioURL));
        console.log('recorder stopped');
        this.cd.detectChanges();
      };
      
      this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
        this.chunks.push(e.data);
      };
    },).catch();
  }

  onExpandText(evt:any): void{
  
    this.sliceOptions.end = this.sliceOptions.end?undefined!:this.sliceOptions.default;
  }

  openSupportPopup() {
    this.isOpen = !this.isOpen;
  }

  onSubmit() {
    return this.valor != null ? this.valor : null;
  }

  async preencherMensagem(response: any, link: any) {
    this.mensagens.push({
      mensagem: response,
      usuario: false,
      error: false,
      audio: false,
      url: String(link)
    });
  }
  async enviarDado() {
    var element = document.getElementById("target");    
    if (this.valor) {
      this.mensagens.push({
        mensagem: String(this.valor),
        usuario: true,
        error: false,
        audio: false,
        url: "",
      });
      if (!this.blocked){
        const response: any = await this.service.SendMessage(this.valor);
        this.valor = ""
        this.preencherMensagem(response.data,"");
        element!.scrollIntoView(false);
        if(response.tag == "query"){
          this.blocked = true;
        }
      }else{
        const response: any = await this.service.SendQuery(this.valor);
        console.log(this.valor)
        this.valor = ""
        this.preencherMensagem("I found these courses that may suit your query:", "")
        
        for(const message of response.data){
          console.log(message)
          this.preencherMensagem("The course " + message.name + ", rated " + message.rated + 
          " is offered by " + message.host + "and has difficulty level " + message.difficultie + ".\n\n" + 
          message.description + "\n\n In this course you will learn: " + message.skill, message.url);
        }
        this.blocked = false;
      }
    } else {
      this.preencherMensagemVazia();
    }
  }
  async sugestion() {
    var cursos = ["python", "tensorflow", "ia", "ti"];
    var curso = Math.floor(Math.random() * cursos.length);
    var random = cursos[curso] 
    this.blocked = true;
    const response: any = await this.service.SendQuery(random);      
        console.log(curso)
        for(const message of response.data){
          console.log(message)
          console.log(message.url)
          const myDiv = document.createElement('div');
          myDiv.innerHTML = (message.name).link(message.url);
          myDiv.style.color = 'black'
          myDiv.style.overflow = 'auto';
          myDiv.style.fontSize = '10px';
          myDiv.style.padding = '10px';
          myDiv.style.background ='(173, 165, 165, 0.404)';
          document.getElementById('sugestions')?.appendChild(myDiv); // Adiciona myDiv na div com o ID "sugestions"
        } 
        this.blocked = false;
  }
  preencherMensagemVazia() {
    this.mensagens.push({
      mensagem: String('Empty message. How can I help you?'),
      usuario: false,
      error: true,
      audio: false,
      url : "",
    });
  }

  pararAudio() {
    this.mediaRecorder.stop();
    console.log(this.mediaRecorder.state);
    console.log('recorder stopped');
  }

  comecarAudio() {
    this.mediaRecorder.start();
    console.log(this.mediaRecorder.state);
    console.log('recorder started');
    setTimeout(() => {
      this.pararAudio();
    }, 5000);
    this.service.startAudioBack().then((res: any) => {
      this.mensagens.push({
        mensagem: String(res.pergunta),
        usuario: true,
        error: false,
        audio: false,
        url: true,
      });
      this.preencherMensagem(res.data, "");
    });
    setInterval(() => {
      this.canRecord = true;
    }, 1000);
  }
}
