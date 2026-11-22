/* =========================================================
   app.js — decide QUAL modelo 3D mostrar e cuida dos avisos.

   Como funciona o endereço:
     index.html            -> abre  modelos/teste.glb
     index.html?m=bone     -> abre  modelos/bone.glb
     index.html?demo=1     -> abre um modelo de exemplo do Google
   Opcional: ?t=Boné%20Preto  -> muda o título que aparece no topo
   ========================================================= */

(function () {
  // ---------- 1. Lê o endereço da página ----------
  const params = new URLSearchParams(window.location.search);

  // Por segurança, o nome do modelo só aceita letras, números, - e _
  const nomeBruto = (params.get('m') || 'teste').toLowerCase();
  const nome = nomeBruto.replace(/[^a-z0-9_-]/g, '') || 'teste';
  const modoDemo = params.has('demo');

  // Título: usa ?t= se existir; senão transforma "bone-preto" em "Bone preto"
  const tituloAuto = nome.replace(/[-_]+/g, ' ');
  const titulo = params.get('t') ||
    (modoDemo ? 'Modelo de exemplo' : tituloAuto.charAt(0).toUpperCase() + tituloAuto.slice(1));

  // Caminhos dos arquivos
  const MODELO_EXEMPLO_GLB  = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
  const MODELO_EXEMPLO_USDZ = 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz';
  const arquivoGlb  = modoDemo ? MODELO_EXEMPLO_GLB  : `modelos/${nome}.glb`;
  const arquivoUsdz = modoDemo ? MODELO_EXEMPLO_USDZ : `modelos/${nome}.usdz`;

  // ---------- 2. Pega os elementos da página ----------
  const visor      = document.getElementById('visor');
  const elTitulo   = document.getElementById('titulo');
  const progresso  = document.getElementById('progresso');
  const barra      = document.getElementById('progresso-barra');
  const caixaErro  = document.getElementById('erro');
  const textoErro  = document.getElementById('erro-texto');
  const avisoPc    = document.getElementById('aviso-pc');
  const avisoSemAr = document.getElementById('aviso-sem-ar');
  const linkQr     = document.getElementById('link-qr');
  const info       = document.getElementById('info');

  elTitulo.textContent = titulo;
  document.title = titulo + ' em 3D';
  visor.alt = 'Modelo 3D: ' + titulo;
  linkQr.href = 'qr.html?m=' + encodeURIComponent(nome);

  // ---------- 3. Arquivo especial para iPhone (opcional) ----------
  // Se existir um .usdz com o mesmo nome, o iPhone usa ele (qualidade melhor).
  // Se não existir, o model-viewer converte o .glb sozinho.
  verificarArquivo(arquivoUsdz).then(function (existe) {
    if (existe) visor.setAttribute('ios-src', arquivoUsdz);
  });

  // ---------- 4. Carrega o modelo ----------
  visor.src = arquivoGlb;

  // Mostra o tamanho do arquivo (abaixo de ~8 MB abre rápido no 4G)
  if (!modoDemo) {
    tamanhoArquivo(arquivoGlb).then(function (bytes) {
      if (bytes) {
        const mb = (bytes / 1024 / 1024).toFixed(1);
        info.textContent = `Arquivo: ${nome}.glb · ${mb} MB` + (bytes > 8 * 1024 * 1024 ? ' (pesado para 4G)' : '');
      }
    });
  }

  // Barra de carregamento
  visor.addEventListener('progress', function (e) {
    const p = e.detail.totalProgress;
    barra.style.width = (p * 100) + '%';
    if (p >= 1) progresso.classList.add('oculto');
  });

  // Modelo carregou com sucesso
  visor.addEventListener('load', function () {
    caixaErro.hidden = true;
    // Espera o model-viewer descobrir se o aparelho suporta AR
    setTimeout(atualizarAvisos, 300);
  });

  // Erro ao carregar (arquivo não existe ou está corrompido)
  visor.addEventListener('error', function (e) {
    progresso.classList.add('oculto');
    document.getElementById('botao-ar').style.display = 'none'; // sem modelo, não há o que ver em AR
    if (modoDemo) {
      textoErro.textContent = 'Não foi possível carregar o modelo de exemplo. Verifique a internet.';
      document.getElementById('link-demo').hidden = true;
    } else {
      textoErro.innerHTML =
        'Não encontrei o arquivo <code>modelos/' + nome + '.glb</code>.<br>' +
        'Confira se ele foi enviado para a pasta <strong>modelos</strong> no GitHub ' +
        'com exatamente esse nome (letras minúsculas).';
    }
    caixaErro.hidden = false;
    console.error('Erro no model-viewer:', e.detail);
  });

  // Acompanha a realidade aumentada (útil para depurar no celular)
  visor.addEventListener('ar-status', function (e) {
    if (e.detail.status === 'failed') {
      avisoSemAr.textContent = 'Não foi possível abrir a realidade aumentada. Tente apontar para uma mesa bem iluminada.';
      avisoSemAr.hidden = false;
    }
  });

  // ---------- 5. Avisos: computador x celular sem AR ----------
  function atualizarAvisos() {
    const ehCelular = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad novo
    if (visor.canActivateAR) {
      avisoPc.hidden = true;
      avisoSemAr.hidden = true;
    } else if (ehCelular) {
      avisoSemAr.hidden = false;
    } else {
      avisoPc.hidden = false;
    }
  }

  // ---------- Funções auxiliares ----------
  // Confere se um arquivo existe no servidor sem baixar ele inteiro
  function verificarArquivo(url) {
    return fetch(url, { method: 'HEAD', cache: 'no-store' })
      .then(function (r) { return r.ok; })
      .catch(function () { return false; });
  }

  function tamanhoArquivo(url) {
    return fetch(url, { method: 'HEAD', cache: 'no-store' })
      .then(function (r) { return r.ok ? Number(r.headers.get('content-length')) || 0 : 0; })
      .catch(function () { return 0; });
  }
})();
