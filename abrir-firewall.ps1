# Script para abrir a porta 3001 no Firewall do Windows
# Execute este script como Administrador

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Configurando Firewall para API    " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está rodando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERRO: Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Clique com botão direito no PowerShell e escolha 'Executar como Administrador'" -ForegroundColor Yellow
    Write-Host "Depois execute: .\abrir-firewall.ps1" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host "✓ Executando como Administrador" -ForegroundColor Green
Write-Host ""

# Tentar remover regra existente (se houver)
Write-Host "Verificando regras existentes..." -ForegroundColor Yellow
try {
    netsh advfirewall firewall delete rule name="Node.js Server Port 3001" | Out-Null
    Write-Host "  Regra antiga removida" -ForegroundColor Gray
} catch {
    Write-Host "  Nenhuma regra antiga encontrada" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Adicionando nova regra no firewall..." -ForegroundColor Yellow

# Adicionar regra de entrada (Inbound)
try {
    $result = netsh advfirewall firewall add rule name="Node.js Server Port 3001" dir=in action=allow protocol=TCP localport=3001

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Regra de ENTRADA adicionada com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "✗ Erro ao adicionar regra de entrada" -ForegroundColor Red
        Write-Host $result
    }
} catch {
    Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Adicionar regra de saída (Outbound) - opcional mas recomendado
try {
    $result = netsh advfirewall firewall add rule name="Node.js Server Port 3001 Out" dir=out action=allow protocol=TCP localport=3001

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Regra de SAÍDA adicionada com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "✗ Erro ao adicionar regra de saída" -ForegroundColor Red
        Write-Host $result
    }
} catch {
    Write-Host "✗ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Verificando Configuração          " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Listar regras criadas
Write-Host "Regras criadas:" -ForegroundColor Yellow
netsh advfirewall firewall show rule name="Node.js Server Port 3001"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  CONCLUÍDO!                        " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "A porta 3001 agora está aberta no firewall." -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Teste no n8n com a URL: http://192.168.15.7:3001/api/health" -ForegroundColor White
Write-Host "2. Certifique-se de adicionar o header: X-API-Key" -ForegroundColor White
Write-Host ""
pause
