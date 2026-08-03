# Desafio Jovens Gênios Super Estágio em Desenvolvimento

  
  

<h4  align="center">

  

  

<img src="./src/assets/screenshots/1.png" /><br>

  

  

<b>Show do Milhão Guilda de Dev</b>

  

  

</h4>

  

  

<p  align="center">

  

  

<a  href="https://lucasfinoti.netlify.app">

  

  

<img  alt="Made by Lucas Finoti"  src="https://img.shields.io/badge/made%20by-LucasFinoti-red">

  

  

</a>

  

  

<img alt="License" src="https://img.shields.io/badge/license-MIT-red">
  

  

</p>
 

<br>

## Demonstração online

https://desafioshowdomilhao.netlify.app/
  

## 1) Definição do Desafio :muscle:


Quem não dev não teme

## 2) Tecnologias usadas :rocket:
Este projeto foi desenvolvido com as seguintes tecnologias:
- [VueJS](https://vuejs.org/)
- [Vuex](https://vuex.vuejs.org/)
- [Vuetify](https://vuetifyjs.com/en/)
- [Google Charts](https://developers.google.com/chart/)

## 3) Funcionaliadades implementadas
- Reduzir as alternativas a metade (50/50)
- Pedir ajuda por telefone;
- Ver a opinião da platéia quanto as alternativas.

## 4) Screenshots

<p align="center">
  <img src="./src/assets/screenshots/1.png" />

  <img src="./src/assets/screenshots/2.png"/>

  <img src="./src/assets/screenshots/3.png"/>
</p>


## 5) Vídeo Tutorial

[<img src="https://img.youtube.com/vi/sX5HFy6-8_w/maxresdefault.jpg" width="100%" height="512">](https://youtu.be/sX5HFy6-8_w)



## 6) Como instalar

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### 7) Estrutura do json com as perguntas
``` json
{
  "id": 14,
  "question": "A pergunta valendo 1 milhão de reais é: Em que dia nasceu e em que dia foi registrado o Ex-Presidente Lula? ",
  "difficulty": 0,
  "choices": [
    {
      "answer": "6 e 27 de outubro",
      "isTrue": true,
      "isOnHalf": true,
      "isOnCallHelp": false,
      "probability": 38
    },
    {
      "answer": "8 e 27 de outubro",
      "isTrue": false,
      "isOnHalf": true,
      "isOnCallHelp": true,
      "probability": 35
    },
    {
      "answer": "9 e 26 de outubro",
      "isTrue": false,
      "isOnHalf": false,
      "isOnCallHelp": false,
      "probability": 3
    },
    {
      "answer": "7 e 23 de outubro",
      "isTrue": false,
      "isOnHalf": false,
      "isOnCallHelp": false,
      "probability": 24
    }
  ]
}
```

  

### License
 

----
Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.
  
Copyright (c) 2020 Lucas Finoti
