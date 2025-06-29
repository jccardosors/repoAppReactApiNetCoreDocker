<p><b>Projeto com CRUD de lançamentos utilizando um app em React conectando com uma api rest em .NET Core e base de dados em SQL Server. O projeto também pode ser containerizado com Docker compose.</b></p>


<h1>Passos para rodar o projeto em container Docker</h1>

1 – Certifique-se de ter Docker Desktop instalado em sua máquina (https://docs.docker.com/desktop/setup/install/windows-install/);

2 – Baixe esse repositório para a sua máquina local e entre na pasta raíz;

3 – Abra o Docker Desktop;

4 – Abra o prompt de comando de sua preferência e entre na pasta raíz onde esta o arquivo Dockerfile;

5 - No prompt aberto digite o comando "Docker-compose up -d";

6 - Espere as imagens serem baixadas e os containers serem carregados no Docker Desktop e então informe a url abaixo no seu navegador;

7 - http://localhost:8080/swagger/index.html (url da Api)

8 - http://localhost:3000 (url do frontend em React)
