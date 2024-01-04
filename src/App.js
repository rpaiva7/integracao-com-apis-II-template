import React, { useEffect, useState } from "react";
import axios from "axios";
import { EditarUsuario } from "./components/EditarUsuario/Editar";
import AddUsuario from "./components/CadastraUsuario/AddUsuario";
import { Header } from "./components/Header/Header";
import {
  ContainerPrincipal,
  ContainerBarra,
  ButtonCadastro,
  BoxCadastro,
} from "./Appstyle";
import { BASE_URL } from "./constants/BASE_URL";
import { AUTH_TOKEN } from "./constants/AUTH_TOKEN";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [pageFlow, setPageFlow] = useState(1);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [pesquisa, setPesquisa] = useState({ nome: "", email: "" });

  useEffect(() => {
    getUsuarios();
  }, []);

  const getUsuarios = async () => {

    try{
      const result = await axios.get(BASE_URL,
        {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        }
      );
      //console.log(result.data);
      setUsuarios(result.data);

      }catch(error){
        console.log(error.response);
      };
  };

  //Pesquisa usuário específico através do nome ou e-mail com função de callback
  const pesquisaUsuario = async () => {

    try{
      const result = await axios.get(`https://labenusers.onrender.com/labenusers/users/search?name=${nome}&email=${email}`, 
        {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        }
      ); 
       //Verifica usuário inexistente ou pesquisa em branco
      /* if(!result.data.lenght){
        alert(`Não existe usuário com esse nome = ${nome} ou email = ${email}`);
      } */

      console.log(result.data);
      setUsuarios(result.data);

      }catch(error){
        console.log(error.response);
      };
  };

  /* const pesquisaUsuario = (pesquisa) => {
   
  }; */

  // Pesquisando usuário específico através do nome ou e-mail usando function, e não função de callback (chamou no console mas não na tela)

/* async function pesquisaUsuario(){
   try{
    const resultado = await axios.get(`https://labenusers.onrender.com/labenusers/users/search?name=${nome}&email=${email}`,{ 
     headers:{
      Authorization:"renan-paiva-barbosab"
    }
    });
    console.log(resultado.data);
    SetUsuarios(resultado.data);
    }catch(error){
  console.log(error)
}
}; */

  const onChangeName = (e) => {
    setNome(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const enviarDados = () => {
      pesquisaUsuario();
      setNome("");
      setEmail("");
    };

    /* setPesquisa(novaPesquisa);
   
    setNome("")
    setEmail("")  */
    

  const onClickVoltar = () => {
    getUsuarios();
    setPageFlow(1)
  }

  return (
    <div>
      <Header />
      <ContainerPrincipal>
        {pageFlow === 2 ? (
          <BoxCadastro>
            <button onClick={() => setPageFlow(1)}>Voltar</button>
            <AddUsuario getUsuarios={getUsuarios} />
          </BoxCadastro>
        ) : (
          <>
            <ContainerBarra>
              <div>
                <input
                  value={nome}
                  onChange={onChangeName}
                  placeholder="Nome"
                />
                <input
                  value={email}
                  onChange={onChangeEmail}
                  placeholder="Email"
                />
                <button 
                  type="submit" 
                  onClick={enviarDados}>
                  Pesquisar
                </button>
              </div>
              {pageFlow === 3 ? (
                <ButtonCadastro onClick={onClickVoltar}>Voltar</ButtonCadastro>
              ) : (
                <ButtonCadastro onClick={() => setPageFlow(2)}>
                  Cadastrar
                </ButtonCadastro>
              )}
              
            </ContainerBarra>
            {usuarios.map((usuario) => {
              return (
                <EditarUsuario
                  key={usuario.id}
                  id={usuario.id}
                  getUsuarios={getUsuarios}
                  setPageFlow={setPageFlow}
                  pageFlow={pageFlow}
                />
              );
            })}
          </>
        )}
        
      </ContainerPrincipal>
    </div>
  );
}

export default App;


/* Integração com APIs II - async e await

Funções Assíncronas

Na aula anterior, aprendemos que para realizar requisições, é necessário utilizar funções assíncronas. Felizmente, as Promises foram criadas para facilitar essa tarefa, permitindo o uso dos métodos .then() e .catch().
Aqui está um exemplo de como utilizar a função axios.get()com Promises:

1.
2. const getUsers = () => {
3.  axios.get('http://...', { 
4.			headers: {
5.				Authorization: 'nome-sobrenome-turma'
6.			}
7.		})
8.     .then(response => console.log(response.data))
9.     .catch(error => console.log(error.message))
10. 

Nesse código, a função axios.get()é utilizada para fazer uma requisição GET para a URL especificada. Se a requisição for bem-sucedida, o método .then()é executado, e a resposta é impressa no console. Caso ocorra algum erro na requisição, o método .catch()é executado, e a mensagem de erro é impressa no console.

# Jeito novo: async e await

Uma outra forma para lidar com requisições assíncronas é utilizando as palavras-chave async e await. Com essas palavras, é possível fazer com que o código aguarde a execução da requisição antes de continuar.

Para utilizar o await, é necessário que a função seja marcada como async. Assim, o resultado da Promise é passado diretamente para uma variável, facilitando o acesso e manipulação dos dados recebidos.

Veja um exemplo de como utilizar async e await com a biblioteca axios:

1. import axios from 'axios'
2.
3. const getUsers = async () => {
4.  const response = await axios.get('http://minha-api.com', { 
5.			headers: {
6.				Authorization: 'nome-sobrenome-turma'
7.			}
8.		})
9.	console.log(response.data)
10.	}

No exemplo acima, observe na linha 3 que getUsers não é mais a função em si, mas uma variável que guarda a função, agora sem nome. Note também que logo após o sinal de igual, antes do início da nossa função, temos o uso da palavra-chave async.

Na linha 4, observe que a chamada do axios está dentro da constante response, e logo após a sua declaração, temos o uso da palavra-chave await para aguardar a resposta da requisição antes de prosseguir com a execução do código

# Atenção
No react, não podemos transformar métodos de ciclo de vida como useEffect em funções assíncronas. Comportamentos inesperados podem acontecer.

1. function App () {
2.
3.	useEffect( async ()=> { //não adicione async aqui!
4.		funcaoAuxiliar()
5.	}, [])
6.	
7.	const funcaoAuxiliar = () => {
8.		await axios...
9.	}
10.	
11.	return (
12.		<>
13.			<h1>Meu componente!</h1>
14.		</>
15.	 )
16. }

Para isso, crie uma função auxiliar, como na linha 7 e a invoque dentro do método de ciclo de vida, na linha 4.

Exemplo:

1. function App () {
2.
3.	useEffect(()=> {
4.		funcaoAuxiliar()
5.	}, [])
6.	
7.	const funcaoAuxiliar = async () => {
8.		await axios...
9.	}
10.	
11.	return (
12.		<>
13.			<h1>Meu componente!</h1>
14.		</>
15.	 )
16. }

## Tratando erros com async e await

### try/catch

O try/catch é uma sintaxe que permite tentar executar um bloco de código (try) e define uma resposta caso ocorra algum erro ou falha (catch).

### try

A declaração try consiste em um bloco que contém uma ou mais declarações, além de ao menos uma cláusula catch ou finally, ou ambas. Existem três formas de declarações try:

1. try{}catch(){}
2. try{}finally{}
3. try{}catch(){}finally{}

No curso, utilizaremos principalmente a primeira forma (try{}catch(){}).

### catch

Uma cláusula catch contém declarações que especificam o que fazer caso ocorra uma falha no bloco try. Em outras palavras, se você deseja que o bloco try funcione e, caso contrário, que o controle passe para o bloco catch.

Se qualquer declaração dentro do bloco try (ou em uma função chamada no interior do bloco try) gerar uma falha, o controle imediatamente muda para a cláusula catch. Se nenhum erro ocorrer no bloco try, a cláusula catch será ignorada.

A cláusula catch recebe um parâmetro que armazena a falha que foi capturada. Normalmente, esse parâmetro é nomeado como error, err ou e.

Exemplo
Para tratar erros, usamos a sintaxe try/catch, como mostrado abaixo nas linhas 3 e 11:

1.
2. const getUsers = async () => {
3.	try {
4.  const response = await axios.get('http://...', { 
5.			headers: {
6.				Authorization: 'nome-sobrenome-turma'
7.			}
8.		})
9.
10.	    console.log(response.data)
11.			} catch(error) {
12.			console.log(error.response)
13.		}
14.	}

Se a solicitação dentro try na linha 4 for bem-sucedida , a resposta será armazenada na variável response e o conteúdo dos dados da resposta será impresso no console por meio do método console.log().

Caso ocorra um erro na solicitação, o controle é transferido para o bloco catch, onde o erro é capturado e o conteúdo da resposta de erro é impresso no console usando o console.log().

### finally

A cláusula finally é executada após a execução do bloco try e da(s) cláusula(s) catch, porém antes das declarações que vêm depois do try. Ela sempre é executada, independentemente de o código cair ou não no catch.

Você pode aninhar uma ou mais declarações try. Caso uma declaração try interior não tenha uma cláusula catch, o catch da declaração try que a envolve é introduzido.

try {
  // bloco de código a ser executado
} catch (error) {
  // bloco de código que trata o erro
} finally {
  // bloco de código que sempre é executado,
  // independente de ter havido erro ou não
}

Como o uso do try/catch pode ajudar a lidar com erros no desenvolvimento de software?

Imagine que você é dono de uma loja online e precisa processar pagamentos de clientes. Você usa uma biblioteca de processamento de pagamentos para lidar com as transações. Às vezes, quando um cliente tenta fazer um pagamento, a biblioteca retorna um erro dizendo que o pagamento falhou.

Para lidar com essa situação, você usa um bloco try/catch ao chamar a função da biblioteca de processamento de pagamentos. Dentro do bloco try, você tenta processar o pagamento. Se ocorrer um erro, o bloco catch é acionado e você pode tratar o erro adequadamente, por exemplo, notificando o cliente de que o pagamento falhou e dando a eles a opção de tentar novamente ou usar um método de pagamento diferente. 😉

# Resumo

1. Em react, métodos de ciclo de vida como useEffect não devem ser transformados em funções assíncronas, mas podem invocar uma função auxiliar async.
2. A utilização das palavras-chave async e await é outra forma de lidar com requisições assíncronas com axios. Para utilizar o await, a função deve ser marcada como async.
3. O try/catch é uma sintaxe que permite tentar executar um bloco de código (try) e definir uma resposta caso ocorra algum erro ou falha (catch).
4. O finally sempre é executado, independentemente de o código cair ou não no catch.


# Constantes: BASE_URL e AUTH_TOKEN

Constantes são variáveis que possuem valores fixos e são usadas em vários lugares do código, como URLs de API, nomes de classes CSS e token de autenticação. As principais razões para usar constantes são:

- Legibilidade do código: é possível dar nomes descritivos aos valores em vez de usá-los diretamente em vários lugares do código.
- Facilidade de manutenção: ao atualizar o valor em um único lugar, todas as outras referências serão atualizadas automaticamente.
- Reutilização de código: constantes podem ser usadas em várias partes do projeto, evitando a duplicação de código.
- Prevenção de erros: ao usar constantes, é possível evitar erros de digitação.

## BASE_URL

Em requisições, o BASE_URL é uma constante que representa a URL base da API que você está acessando. Isso significa que, em vez de digitar a URL completa para cada solicitação, você pode definir a BASE_URL uma vez e usá-la em todas as suas solicitações.

Por exemplo, se você estiver fazendo solicitações para uma API hospedada em https://us-central1-labenu-apis.cloudfunctions.net/labenusers, você pode definir a BASE_URL como:

const BASE_URL = "labenu-apis.cloudfunctions.net/labenusers"

A partir daí, você pode fazer solicitações para endpoints específicos da API, adicionando o caminho relativo a partir da BASE_URL. Por exemplo:

axios.get(`${BASE_URL}/users`)
  .then(response => {
    console.log(response.data);
  });

Isso fará uma solicitação GET para:

https://us-central1-labenu-apis.cloudfunctions.net/labenusers/users

## AUTH_TOKEN

Para a autorização enviada o header da requisição nós usamos o AUTH_TOKEN.

 const AUTH_TOKEN = "nome-sobrenome-turma"

 Observe que AUTH_TOKEN é uma constante que utilizaremos para armazenar o token de autenticação, podendo ser utilizada em  todas as solicitações que serão feitas usando o Axios e que necessitem desse tipo de dado. 

Nos nossos endpoints, podemos fazer a junção dessas constantes como demonstrado à seguir:

Por exemplo:

    axios
      .get(
        `${BASE_URL}/users`,
        {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        }
      )
      .then((res) => {
        setUsuarios(res.data);
      })

IMPORTANTE: O AUTH_TOKEN é como uma senha para acessar recursos protegidos na API, portanto, assim como você cuida da sua senha, é importante tomar cuidado ao guardar o AUTH_TOKEN, pois ele contém informações sensíveis e pode ser usado indevidamente por terceiros.

## Resumo

1. Use constantes para tornar o código mais legível e fácil de entender.
2. Utilize constantes para facilitar a manutenção do código.
3. Reutilize código através do uso de constantes em várias partes do projeto.
4. Use constantes para prevenir erros de digitação.
5. Defina a BASE_URL para a url base da  API e o AUTH_TOKEN para a autorização e utilize-os nas solicitações para endpoints.
6. AUTH_TOKEN contém dados sensíveis, portanto cuidado com o compartilhamento.

*/


