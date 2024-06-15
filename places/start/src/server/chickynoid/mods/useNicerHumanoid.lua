local module = {}

function module:Setup(server)
    server.OnPlayerConnected:Connect(function(serv, playerRecord)
        playerRecord:SetCharacterMod("nicerHumanoid")
    end)
end

return module
