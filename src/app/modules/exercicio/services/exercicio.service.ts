import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IExercicio } from '../../shared/interfaces/exercicio.interface';
// import { IExercicio } from 'src/app/modules/shared/interfaces/exercicio.interface';

@Injectable({
  providedIn: 'root'
})
export class ExercicioService {

  private exerciciosSubject = new BehaviorSubject<IExercicio[]>([]);
  private exercicioSelcionadoSubject = new BehaviorSubject<IExercicio | null>(null);

  private exercicios: any[]  = [ { "id": 3, "titulo": "Cria uma funcao ehPalindromo", "descricao": "Desenvolva uma função chamada ehPalindromo que verifica se uma palavra ou frase é um palíndromo (ou seja, pode ser lida da mesma forma de trás para frente, desconsiderando espaços, pontuações e maiúsculas).", "nomeFuncao": "calculadora", "exemplos": [ { "saida": "8", "entrada": "(5, 3, '+')" }, { "saida": "2", "entrada": "(5, 3, '-')" }, { "saida": "15", "entrada": "(5, 3, '*')" }, { "saida": "1.6666666666666667", "entrada": "(5, 3, '/')" } ], "notas": "Lembre-se de tratar a divisão por zero retornando alguma mensagem apropriada.", "createdAt": "2024-06-18T21:23:00.955697+00:00", "nivelDificuldade": "fácil" }, { "id": 2, "titulo": "Cria uma calculadora", "descricao": "Crie uma função chamada calculadora que recebe dois números e uma operação aritmética (como +, -, *, /) e retorna o resultado dessa operação.", "nomeFuncao": "calculadora", "exemplos": [ { "saida": "8", "entrada": "(5, 3, '+')" }, { "saida": "2", "entrada": "(5, 3, '-')" }, { "saida": "15", "entrada": "(5, 3, '*')" }, { "saida": "1.6666666666666667", "entrada": "(5, 3, '/')" } ], "notas": "Lembre-se de tratar a divisão por zero retornando alguma mensagem apropriada.", "createdAt": "2024-06-11T11:56:29.652629+00:00", "nivelDificuldade": "fácil" }, { "id": 1, "titulo": "Cria uma calculadora", "descricao": "Crie uma função chamada calculadora que recebe dois números e uma operação aritmética (como +, -, *, /) e retorna o resultado dessa operação.", "nomeFuncao": "calculadora", "exemplos": [ { "saida": "8", "entrada": "(5, 3, '+')" }, { "saida": "2", "entrada": "(5, 3, '-')" }, { "saida": "15", "entrada": "(5, 3, '*')" }, { "saida": "1.6666666666666667", "entrada": "(5, 3, '/')" } ], "notas": "Lembre-se de tratar a divisão por zero retornando alguma mensagem apropriada.", "createdAt": "2024-06-11T11:56:13.353172+00:00", "nivelDificuldade": "fácil" } ]

  obterExemploPorId(id: number): IExercicio | undefined{
    const exercicios =  this.exerciciosSubject.getValue();
    // const exercicios = this.exercicios;
    return exercicios.find( exercicio => exercicio.id == id);
  }

  constructor(private http: HttpClient) {}

  consultarDesafios(): Observable<IExercicio[]> {

    return this.http.get<IExercicio[]>("https://xnehkhimqjsgufnryize.supabase.co/rest/v1/rpc/buscar_desafios", {headers: {
      apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZWhraGltcWpzZ3VmbnJ5aXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwNTE0ODUsImV4cCI6MjAzMzYyNzQ4NX0.Int6HvQpxACneAwwfkgbZrDcARj50LUxzfdclg35wJQ',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZWhraGltcWpzZ3VmbnJ5aXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwNTE0ODUsImV4cCI6MjAzMzYyNzQ4NX0.Int6HvQpxACneAwwfkgbZrDcARj50LUxzfdclg35wJQ',
      accept: '*/*',
    }}).pipe(switchMap((result) => {

        const exerciciosModificados = result.map((exercicio: any) => {
          const {nome_funcao: nomeFuncao, nivel_dificuldade: nivelDificuldade, ...restoDoExercicio} = exercicio;
          return { ...restoDoExercicio, nomeFuncao, nivelDificuldade}
        })

        this.exerciciosSubject.next(exerciciosModificados);
        return this.exerciciosSubject.asObservable();

    }))

  }

  obterExercicioAnterior(idExercicioAtual: number) {
    let exercicios =  this.exerciciosSubject.getValue();
    let index = exercicios.findIndex( exercicio => exercicio.id == idExercicioAtual);
    if(index > 0)
      this.selecionarExercicio(exercicios[index - 1]);
    else
      this.limparExercicioSelecionado();

  }
  obterProximoExercicio(idExercicioAtual: number) {
    let exercicios =  this.exerciciosSubject.getValue();
    let index = exercicios.findIndex( exercicio => exercicio.id == idExercicioAtual);
    if(index < exercicios.length - 1)
      this.selecionarExercicio(exercicios[index + 1]);
    else
      this.limparExercicioSelecionado();
  }

  obterExercicioSelecionado(): Observable<IExercicio | null> {
    return this.exercicioSelcionadoSubject.asObservable();
  }

  selecionarExercicio(exercicio: IExercicio){
    this.exercicioSelcionadoSubject.next(exercicio);
  }
  limparExercicioSelecionado(){
    this.exercicioSelcionadoSubject.next(null);
  }
}
