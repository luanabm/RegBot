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
  imagemSrc = '../../../assets/img/microphoneoutlinedcircularbutton_104664.svg';
  

  isOpen = false;

  mensagens: Chat[] = [];
  valor: string;
  usuario = true;
  chunks: Blob[] = [];
  mediaRecorder: any;
  canRecord = true;
  resp: any

  sliceOptions = {
    start: 0,
    end: 300,
    default: 300
  }

  constructor(private service: ChatService, private dom: DomSanitizer,
    private cd: ChangeDetectorRef) {
    this.mensagens.push({
      mensagem: String('Oi, sou seu RegBot. Me diga o que deseja?'),
      usuario: false,
      error: true,
      audio: false,
    }); 
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
        });
        const audioFiles = []
        audioFiles.push(this.dom.bypassSecurityTrustUrl(audioURL));
        console.log('recorder stopped');
        this.cd.detectChanges();
        this.mensagens.push({
          mensagem: String(this.resp.pergunta),
          usuario: true,
          error: false,
          audio: false,
        });
        
        if (this.resp.tag != 'indefinido'){
          this.preencherMensagem(this.resp.data);
        } else {
          for(const message of this.resp.data){
            console.log(message)
            this.mensagens.push({
              mensagem: `Num: ${message.num}, Artigo: ${message.regulation}, Parágrafo: ${message.paragraph}`,
              usuario: false,
              error: false,
              audio: false,
            });
          }
        }
        
      };
      
      this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
        this.chunks.push(e.data);
      };

      this.resp = ""
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

  async preencherMensagem(response: any) {
    this.mensagens.push({
      mensagem: response,
      usuario: false,
      error: false,
      audio: false,
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
      });
      console.log(this.blocked)
      if (!this.blocked){
        const response: any = await this.service.SendMessage(this.valor);
        this.valor = ""
        this.preencherMensagem(response.data);
        element!.scrollIntoView(false);
        if(response.tag == "query"){
          this.blocked = true;
        }
        console.log(this.blocked)
      }else{
        const response: any = await this.service.SendQuery(this.valor);
        console.log(this.valor)
        this.valor = ""        
        for(const message of response.data){
          console.log(message)
          this.mensagens.push({
            mensagem: `Num: ${message.num}, Artigo: ${message.regulation}, Parágrafo: ${message.paragraph}`,
            usuario: false,
            error: false,
            audio: false,
          });
        }
        this.blocked = false;
      }
    } else {
      this.preencherMensagemVazia();
    }
  }
  preencherMensagemVazia() {
    this.mensagens.push({
      mensagem: String('Mensagem vazia. Em que posso ajudar?'),
      usuario: false,
      error: true,
      audio: false,
    });
  }

  pararAudio() {
    this.mediaRecorder.stop();
    console.log(this.mediaRecorder.state);
    console.log('recorder stopped');
    this.imagemSrc = '../../../assets/img/microphoneoutlinedcircularbutton_104664.svg'
  }

  comecarAudio() {
    this.mediaRecorder.start();
    console.log(this.mediaRecorder.state);
    console.log('recorder started');
    this.imagemSrc = '../../../assets/img/microphonevoicetoolcircularblackbutton_104779.svg'
    
    this.service.startAudioBack().then((res: any) => {
      console.log(res)
        this.resp = res;
        this.pararAudio()
      
    });
    setInterval(() => {
      this.canRecord = true;
    }, 1000);
  }
}
