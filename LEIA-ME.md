# Teste de Realidade Aumentada (QR → 3D na mesa)

## O que é cada arquivo
| Arquivo | Para que serve |
|---|---|
| `index.html` | A página que o cliente abre ao ler o QR. Mostra o 3D e o botão "Ver na minha mesa". |
| `qr.html` | Página para VOCÊ gerar e baixar o QR Code de cada item. |
| `css/style.css` | A aparência (cores, botões, tamanhos). |
| `js/app.js` | Decide qual modelo 3D abrir e mostra avisos. |
| `js/qr.js` | Desenha o QR Code. |
| `modelos/` | Pasta onde ficam os arquivos 3D (.glb / .usdz). |

## Passo a passo
1. **Escaneie um objeto** (boné, fone, travesseiro) com um app de escaneamento 3D
   (Polycam, KIRI Engine, Luma, Reality Composer etc.) e **exporte em GLB**.
   Se o app também exportar USDZ, exporte também (fica melhor no iPhone).
2. **Renomeie** o arquivo para `teste.glb` (e `teste.usdz`, se tiver).
3. No GitHub, crie um repositório novo (ex.: `ar-teste`) e envie **todas as pastas e arquivos**,
   colocando o `teste.glb` dentro da pasta `modelos`.
4. Em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)` e salve.
   Em 1–2 minutos o site fica no ar em `https://SEU-USUARIO.github.io/ar-teste/`.
5. No computador, abra `https://SEU-USUARIO.github.io/ar-teste/qr.html`,
   leia o QR com o celular e toque em **"Ver na minha mesa"**.

## Testar antes de escanear
Abra `.../index.html?demo=1` ou, no `qr.html`, clique em **"QR do exemplo"**: aparece um modelo de exemplo do Google.

## Vários objetos
- `modelos/bone.glb` → `index.html?m=bone`
- `modelos/fone.glb` → `index.html?m=fone`
- Para um título bonito: `index.html?m=bone&t=Boné preto` (o `qr.html` monta isso para você).

Nomes de arquivo: só letras minúsculas, números, `-` ou `_` (sem acento, sem espaço).
Tamanho ideal: até 8 MB por modelo.
