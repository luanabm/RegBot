# Chatbot Buscador de cursos

## Como instalar e executar o sistema

- Verifique se seu ambiente já possui as ferramentas a seguir, ou instale as mesmas para execução do projeto
```
- Anaconda (version 1.7.2)
	Link da documentação e processo de instalação no Linux:
	[https://docs.anaconda.com/anaconda/install/linux/]
- Node (version 16.15.1)
	Link para instalação do node no Linux:
	[https://nodejs.org/dist/v16.15.1/node-v16.15.1-linux-x64.tar.xz]
	Os modelos já estão criados e no pacote de arquivos, caso ocorra alteração para re-treinamento do modelo execute os notebook’s

	- chatbot-script.ipynb
	- semantic-search-script.ipynb
	- criação_espaço_vetorial.ipynb
	- entry-processing-script.ipynb
	
	Salve os modelos searchModel.h5 e chatModel.h5 que foram criados na pasta Backend/model

```
**Back-end**

- Certifique-se de ter instalado em sua máquina o Anaconda, NodeJs e npm;
- Caso esteja executando pela primeira vez, certifique-se de ter todos os pacotes necessários instalados na versão correta. Para isto, num terminal execute:
 
```
conda create -n chatbot python=3.9 anaconda
conda activate chatbot

```
- No comando acima, ***chatbot*** é o nome do ambiente virtual. Você pode alterá-lo conforme achar adequado.

- Com o terminal aberto no diretório "Backend", execute:

```
pip install FuzzyTM
pip install -r requirements.txt

```
- Após isto, e em todas as outras execuções, só será necessário rodar, num terminal dentro do diretório do Backend:

```
conda activate chatbot
python main.py

```

**Front-end**

- No diretório Frontend, executar o comando ```npm install``` 
- Executar o frontend, que utiliza angular, por meio do comando ```ng serve``` pelo terminal
- O navegador abrirá automaticamente uma guia com o frontend do projeto, uma vez que ele seja compilado
