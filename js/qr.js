/* =========================================================
   qr.js — monta o endereço do produto e desenha o QR Code.
   O QR leva para:  .../index.html?m=NOME  (e &t=TÍTULO se preenchido)
   ========================================================= */

(function () {
  const campoNome   = document.getElementById('campo-nome');
  const campoTitulo = document.getElementById('campo-titulo');
  const canvas      = document.getElementById('qr-canvas');
  const linkUrl     = document.getElementById('qr-url');
  const botaoBaixar = document.getElementById('botao-baixar');
  const botaoDemo   = document.getElementById('botao-demo');

  let usarDemo = false;

  // Se veio da página principal com ?m=nome, já preenche
  const params = new URLSearchParams(window.location.search);
  if (params.get('m')) campoNome.value = params.get('m');

  // Endereço da pasta do site (funciona no GitHub Pages e em qualquer lugar)
  const base = window.location.href.split('?')[0].replace(/qr\.html$/, '');

  function montarUrl() {
    if (usarDemo) return base + 'index.html?demo=1';
    const nome = campoNome.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'teste';
    let url = base + 'index.html?m=' + nome;
    const t = campoTitulo.value.trim();
    if (t) url += '&t=' + encodeURIComponent(t);
    return url;
  }

  function desenhar() {
    const url = montarUrl();
    linkUrl.textContent = url;
    linkUrl.href = url;

    // Correção de erro "M" (15%): bom equilíbrio para impressão em cardápio
    const qr = qrcode(0, 'M');
    qr.addData(url);
    qr.make();

    const modulos = qr.getModuleCount();
    const margem = 4;                       // borda branca obrigatória do QR
    const total = modulos + margem * 2;
    const tamanho = 400;
    const celula = tamanho / total;
    const alturaTexto = 60;

    canvas.width = tamanho;
    canvas.height = tamanho + alturaTexto;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    for (let l = 0; l < modulos; l++) {
      for (let c = 0; c < modulos; c++) {
        if (qr.isDark(l, c)) {
          ctx.fillRect(
            Math.floor((c + margem) * celula),
            Math.floor((l + margem) * celula),
            Math.ceil(celula),
            Math.ceil(celula)
          );
        }
      }
    }

    // Texto embaixo do QR (fica bonito impresso ao lado do prato)
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Aponte a câmera e veja em 3D', tamanho / 2, tamanho + 32);
  }

  function baixar() {
    const nome = usarDemo ? 'exemplo' : (campoNome.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'teste');
    const a = document.createElement('a');
    a.download = 'qr-' + nome + '.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  }

  campoNome.addEventListener('input', function () { usarDemo = false; desenhar(); });
  campoTitulo.addEventListener('input', function () { usarDemo = false; desenhar(); });
  botaoBaixar.addEventListener('click', baixar);
  botaoDemo.addEventListener('click', function () { usarDemo = true; desenhar(); });

  desenhar();
})();
