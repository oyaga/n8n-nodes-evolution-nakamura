# n8n-nodes-evolution-nakamura

Fork customizado do [n8n-nodes-evolution-api](https://github.com/oriondesign2015/n8n-nodes-evolution-api) com operações adicionais para a Evolution API.

## 🆕 Novas Operações

Este fork adiciona as seguintes operações que não existem no pacote original:

> [!NOTE]
> O nome do node no n8n será **"Evolution API NK"** para não conflitar com o node original.
> Você pode ter ambos instalados simultaneamente.

| Operação | Descrição | Endpoint |
|----------|-----------|----------|
| **sendCarousel** | Envia mensagem com múltiplos cards deslizáveis | `/message/sendCarousel` |
| **sendLocation** | Envia localização com coordenadas GPS | `/message/sendLocation` |
| **sendSticker** | Envia figurinha/sticker | `/message/sendSticker` |

---

## 📦 Instalação

### Via npm:

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-evolution-nakamura
```

### Manual:

```bash
cd ~/.n8n/nodes
git clone https://github.com/oyaga/n8n-nodes-evolution-nakamura.git
cd n8n-nodes-evolution-nakamura
pnpm install
pnpm build
```

---

## 🔧 Operações Disponíveis

### Messages (15 operações)

- ✅ Enviar Texto
- ✅ Enviar Imagem
- ✅ Enviar Video
- ✅ Enviar Audio
- ✅ Enviar Documento
- ✅ Enviar Enquete (Poll)
- ✅ Enviar Contato
- ✅ Enviar Lista
- ✅ Enviar Botões
- ✅ Enviar PIX
- ✅ Enviar Status/Stories
- ✅ Reagir Mensagem
- 🆕 **Enviar Carousel**
- 🆕 **Enviar Localização**
- 🆕 **Enviar Sticker**

### Instance (9 operações)

- Criar Instância Básica
- Conectar Instância (QR Code)
- Reiniciar Instância
- Logout Instância
- Definir Presença
- Deletar Instância
- Listar Instâncias
- Configurações da Instância
- Configurar Proxy

### Groups (14 operações)

- Criar Grupo
- Atualizar Foto do Grupo
- Atualizar Nome do Grupo
- Atualizar Descrição do Grupo
- Obter Link de Convite
- Revogar Link de Convite
- Enviar Link de Convite
- Listar Grupos
- Listar Participantes
- Atualizar Participantes
- Atualizar Configurações
- Mensagens Temporárias
- Entrar em Grupo
- Sair do Grupo

### Chat (14 operações)

- Verificar Número
- Marcar como Lida
- Gerenciar Arquivo
- Marcar como Não Lida
- Deletar Mensagem
- Obter Foto de Perfil
- Download de Mídia (Base64)
- Editar Mensagem
- Enviar Presença (digitando...)
- Bloquear Contato
- Buscar Contatos
- Buscar Mensagens
- Buscar Status de Mensagens
- Buscar Chats

### Integrations (5 operações)

- Chatwoot
- Typebot
- Evolution Bot
- DifyBot
- Flowise Bot

### Events (2 operações)

- Webhook
- RabbitMQ

### Profile (8 operações)

- Obter Perfil
- Obter Perfil Comercial
- Atualizar Nome
- Atualizar Status
- Atualizar Foto
- Remover Foto
- Obter Configurações de Privacidade
- Atualizar Configurações de Privacidade

---

## 📋 Exemplo: Enviar Carousel

```json
{
  "instanceName": "MinhaInstancia",
  "remoteJid": "5544999999999",
  "cards": [
    {
      "header": "Card 1",
      "title": "Produto A",
      "description": "Descrição do produto A",
      "footer": "R$ 99,00",
      "thumbnailUrl": "https://exemplo.com/imagem1.jpg"
    },
    {
      "header": "Card 2",
      "title": "Produto B",
      "description": "Descrição do produto B",
      "footer": "R$ 149,00",
      "thumbnailUrl": "https://exemplo.com/imagem2.jpg"
    }
  ]
}
```

---

## 📋 Exemplo: Enviar Localização

```json
{
  "instanceName": "MinhaInstancia",
  "remoteJid": "5544999999999",
  "locationName": "Loja Central",
  "locationAddress": "Rua das Flores, 123 - Centro",
  "latitude": -23.550520,
  "longitude": -46.633308
}
```

---

## 📋 Exemplo: Enviar Sticker

```json
{
  "instanceName": "MinhaInstancia",
  "remoteJid": "5544999999999",
  "stickerUrl": "https://exemplo.com/sticker.webp"
}
```

---

## 🔗 Créditos

- Fork baseado em [n8n-nodes-evolution-api](https://github.com/oriondesign2015/n8n-nodes-evolution-api) by OrionDesign
- Operações adicionais por Oyaga/Nakamura

---

## 📝 Licença

MIT License
