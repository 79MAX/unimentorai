# ==========================================================
# UNIMENTORAI V12 START MANAGER
# DEVOPS BOOT ORCHESTRATOR
# SAFE PRODUCTION START
# ==========================================================

$ErrorActionPreference = "Stop"


Write-Host ""
Write-Host "🚀 STARTING UNIMENTORAI BACKEND V12" -ForegroundColor Cyan
Write-Host ""


# ==========================================================
# ROOT
# ==========================================================

$ROOT = Split-Path -Parent $PSScriptRoot

Set-Location $ROOT


Write-Host "📁 ROOT:"
Write-Host $ROOT -ForegroundColor Gray



# ==========================================================
# NODE CHECK
# ==========================================================

Write-Host ""
Write-Host "🟢 Checking Node..." -ForegroundColor Yellow


try {

    $nodeVersion = node -v

    Write-Host "✅ Node $nodeVersion detected" -ForegroundColor Green

}

catch {

    Write-Host "❌ Node unavailable" -ForegroundColor Red
    exit 1

}



# ==========================================================
# PORT CLEAN
# ==========================================================

$PORT = 3000


Write-Host ""
Write-Host "🔍 Checking port $PORT..." -ForegroundColor Yellow



$conn = Get-NetTCPConnection `
    -LocalPort $PORT `
    -State Listen `
    -ErrorAction SilentlyContinue



if($conn){


    Write-Host "⚠️ Port occupied" -ForegroundColor Yellow



    $processIds = $conn |
        Select-Object -ExpandProperty OwningProcess |
        Sort-Object -Unique



    foreach($processId in $processIds){


        if($processId -gt 0){


            $process = Get-Process `
                -Id $processId `
                -ErrorAction SilentlyContinue



            if($process.ProcessName -eq "node"){


                Write-Host "🛑 Stopping Node PID $processId" -ForegroundColor Red


                Stop-Process `
                    -Id $processId `
                    -Force


            }

        }

    }



    Start-Sleep 2

}



Write-Host "✅ Port $PORT available" -ForegroundColor Green



# ==========================================================
# ENV CHECK
# ==========================================================


Write-Host ""
Write-Host "🔐 Checking environment..." -ForegroundColor Yellow



if(!(Test-Path ".env")){


    Write-Host "❌ .env missing" -ForegroundColor Red

    exit 1

}



Write-Host "✅ .env detected" -ForegroundColor Green




# ==========================================================
# LOG
# ==========================================================


$LOG_DIR = ".\logs"


if(!(Test-Path $LOG_DIR)){


    New-Item `
        -ItemType Directory `
        -Path $LOG_DIR |
        Out-Null

}



$LOG = Join-Path `
    $ROOT `
    "logs\backend-v12.log"



# ==========================================================
# START SERVER
# ==========================================================


Write-Host ""
Write-Host "🚀 Launching UniMentorAI V12..." -ForegroundColor Cyan
Write-Host ""



Start-Process `
    -FilePath "cmd.exe" `
    -ArgumentList "/c node server.js > `"$LOG`" 2>&1"



# ==========================================================
# HEALTH CHECK
# ==========================================================


Write-Host ""
Write-Host "⏳ Waiting for API..." -ForegroundColor Yellow



$ready=$false



for($i=1;$i -le 30;$i++){


    Start-Sleep 1


    try {


        $response = Invoke-RestMethod `
            -Uri "http://localhost:$PORT/" `
            -ErrorAction Stop



        if($response.status -eq "OK"){


            $ready=$true

            break

        }


    }

    catch {

    }

}



# ==========================================================
# RESULT
# ==========================================================


Write-Host ""


if($ready){


    Write-Host "==================================" -ForegroundColor Green
    Write-Host "✅ UNIMENTORAI V12 ONLINE" -ForegroundColor Green
    Write-Host "🌐 http://localhost:$PORT" -ForegroundColor Green
    Write-Host "📄 LOG: $LOG" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green


}
else{


    Write-Host "==================================" -ForegroundColor Red
    Write-Host "❌ BACKEND START FAILED" -ForegroundColor Red
    Write-Host "==================================" -ForegroundColor Red


    if(Test-Path $LOG){

        Write-Host ""
        Write-Host "SERVER LOG:"
        Get-Content $LOG -Tail 80

    }


    exit 1

}