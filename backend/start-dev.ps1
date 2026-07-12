# ==========================================================
# UNIMENTORAI BACKEND V12
# DEVELOPMENT STARTER
# CLEAN PORT + START SERVER
# ==========================================================


Write-Host ""
Write-Host "🚀 UNIMENTORAI BACKEND V12 STARTER"
Write-Host ""


# ==========================================================
# CLEAN PORT 3000
# ==========================================================


Write-Host "🧹 Checking port 3000..."



$connections = Get-NetTCPConnection `
    -LocalPort 3000 `
    -ErrorAction SilentlyContinue



if($connections){


    $processIds =
        $connections |
        Select-Object -ExpandProperty OwningProcess -Unique



    foreach($processId in $processIds){


        if($processId -and $processId -ne 0){


            Write-Host "⚠️ Killing Node PID $processId"


            Stop-Process `
                -Id $processId `
                -Force `
                -ErrorAction SilentlyContinue


        }


    }



    Start-Sleep -Seconds 2



    Write-Host "✅ Port 3000 cleaned"



}
else{


    Write-Host "✅ Port 3000 already free"


}





# ==========================================================
# ENV CHECK
# ==========================================================


if(!(Test-Path ".env")){


    Write-Host "❌ .env missing"

    exit 1


}



Write-Host "✅ Environment file detected"






# ==========================================================
# START SERVER
# ==========================================================


Write-Host ""
Write-Host "🚀 Starting Node backend..."
Write-Host ""


node server.js