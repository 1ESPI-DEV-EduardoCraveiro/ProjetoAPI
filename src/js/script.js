//Declarações dos Elementos usando DOM(Document Object Model)
const videoElemento = document.getElementById('video');
const botaoScanear = document.getElementById('btn-texto');
const resultado = document.getElementById('saida');
const canvas = document.getElementById('canvas');

//Função assincrona para habilitar a câmera
async function configurarCamera() {
    //tratamento de erros
    try{
        //chama a api do navegador para solicitar acesso
        const midia= await navigator.mediaDevices.getUserMedia({
            //habilite a câmera traseira do dispositivo
            video: { facingMode: 'environment' },
            //o audio não será capturado
            audio: false
        })
        //recebe a função midia para ser executada
        videoElemento.srcObject = midia;
        //força o vídeo a ser reproduzido
        videoElemento.play();
        
    }catch (erro){
        resultado.innerText = 'Erro ao acessar a câmera: ',erro;
    }
}
//Executa a função de configurar a câmera
configurarCamera();

//Função para capturar o texto da camera
botaoScanear.onclick =async ()=> {
    botaoScanear.disabled=true; //habilitando a camera
    resultado.innerText = 'Fazendo a do texto, aguarde...'; //mensagem de espera

    //Define o canvas para iniciar a leitura
    const contexto = canvas.getContext('2d');

    //Ajusta o tamanho do canvas para o mesmo do vídeo
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    //Aplica o filtro para melhorar o OCR
    contexto.filter = 'contrast(1.2) grayscale(1)';

    //Desenha o video no canvas
    
    contexto.drawImage(videoElemento, 0, 0, canvas.width, canvas.height);

    try{
        const {data:{text}}=await Tesseract.recognize(
            canvas,
            'por' //define o idioma
        )
        //Remove os espaços em branco
        const textoFinal = text.trim();
        //estrutura condicional ternaria ? = if : = else
        resultado.innerText = textoFinal.lenght > 0 ? textoFinal : 'Não foi possível identificar o texto.';

    }catch(erro){
        resultado.innerText = 'Erro no processamento: ',erro;
    }
    finally{
        //desabilitando a camera para fazer nova captura
        botaoScanear.disabled=false;
    }

}
