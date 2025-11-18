# Script PowerShell para atualizar cores de fonte em massa

Write-Host "Atualizando cores de fonte para preto..." -ForegroundColor Cyan

# Padrões a substituir
$replacements = @{
    'text-gray-800 mb' = 'text-black mb'
    'text-gray-800">' = 'text-black">'
    'text-gray-700 mb' = 'text-black mb'
    'text-sm text-gray-600' = 'text-sm font-bold text-black'
    'text-gray-900">' = 'text-black">'
    'font-medium text-gray-700' = 'font-bold text-black'
    'font-semibold text-gray-800' = 'font-bold text-black'
}

# Arquivos a atualizar
$files = @(
    "src\pages\Agendamentos.tsx",
    "src\pages\Estoque.tsx",
    "src\pages\Calendario.tsx",
    "src\pages\ClienteDetalhes.tsx",
    "src\pages\NovoCliente.tsx",
    "src\pages\EditarCliente.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processando: $file" -ForegroundColor Yellow

        $content = Get-Content $file -Raw

        foreach ($old in $replacements.Keys) {
            $new = $replacements[$old]
            $content = $content -replace [regex]::Escape($old), $new
        }

        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "  ✓ Atualizado!" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Arquivo não encontrado: $file" -ForegroundColor Red
    }
}

Write-Host "`nConcluído! Todas as fontes foram atualizadas para preto." -ForegroundColor Green
