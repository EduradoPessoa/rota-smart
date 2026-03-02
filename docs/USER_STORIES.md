# User Stories - RotaSmart

## US-001: Importação Inteligente de Pedidos

**Como** Operador de Dispatch  
**Quero** fazer upload de uma lista desorganizada de endereços  
**Para** que a IA crie automaticamente uma tabela estruturada

### Critérios de Aceite
- [ ] Tabela gerada contém Cliente, Endereço, CEP e Valor para ≥ 90% dos registros
- [ ] Campos que falham extração são destacados em vermelho
- [ ] Sistema exibe resumo: sucesso vs erros
- [ ] Importação completa em < 30 segundos (arquivos até 5MB)

### Fluxo
1. Operador faz upload do arquivo (TXT/CSV/PDF)
2. Sistema envia para Gemini API
3. IA extrai dados e retorna tabela
4. Operador revisa e corrige erros
5. Operador confirma importação
6. Pedidos são salvos no localStorage

---

## US-002: Configuração de Regiões

**Como** Gerente de Logística  
**Quero** definir que CEPs 01000 a 02000 pertencem a "Região Centro"  
**Para** que novos pedidos sejam automaticamente classificados

### Critérios de Aceite
- [ ] Interface permite criar, editar e excluir regiões
- [ ] Pedidos importados após configuração recebem região automaticamente
- [ ] Ranges de CEP sobrepostos são detectados com warning
- [ ] Configurações persistem após reload (localStorage)

### Fluxo
1. Gerente acessa tela de Regiões
2. Cria região com nome, CEP inicial e CEP final
3. Sistema valida range (sem sobreposição)
4. Região é salva
5. Próximos imports atribuem região automaticamente

---

## US-003: Visualização de Rota

**Como** Motorista / Entregador  
**Quero** ver a sequência exata de entregas no mapa  
**Para** não perder tempo em trânsito

### Critérios de Aceite
- [ ] Mapa exibe marcadores numerados na sequência otimizada
- [ ] Clicar no marcador mostra endereço completo
- [ ] Botão "Abrir no Google Maps" inicia navegação
- [ ] Rota exibe em < 5 segundos após otimização

### Fluxo
1. Operador seleciona pedidos para rota
2. Clica em "Otimizar Rota"
3. Gemini API retorna sequência otimizada
4. Mapa exibe marcadores numerados
5. Motorista clica para ver detalhes e navegar

---

## US-004: Tratamento de Erros de Extração

**Como** Operador de Dispatch  
**Quando** a IA falha em extrair um campo  
**Quero** ser alertado e poder corrigir manualmente antes de confirmar

### Critérios de Aceite
- [ ] Campos com falha são destacados em vermelho na tabela de revisão
- [ ] Campos com falha são editáveis inline
- [ ] Botão "Confirmar Importação" permanece desabilitado enquanto campos obrigatórios estão vazios
- [ ] Sistema registra qtd de correções manuais por sessão

### Fluxo
1. Upload de arquivo falha parcialmente
2. Sistema destaca campos problemáticos em vermelho
3. Operador clica no campo para editar
4. Operador corrige dado
5. Sistema remove destaque quando corrigido
6. Quando todos obrigatórios preenchidos, botão habilitar

---

## Métricas de Sucesso (MVP)

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Acurácia IA | ≥ 90% | Auditoria manual |
| Tempo montagem rota | < 3 min | Cronômetro |
| Redução distância | ≥ 15% | Comparação manual vs IA |
| Adoção (semana 2) | ≥ 70% | Sessões únicas |
| NPS | ≥ 40 | Pesquisa in-app |
