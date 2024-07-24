local MockDataStoreServiceModule = script.mockDataStore

local shouldUseMock = false
if game.GameId == 0 then -- Local place file
	shouldUseMock = true
elseif game:GetService("RunService"):IsStudio() then -- Published file in Studio
	local status, message = pcall(function()
		-- This will error if current instance has no Studio API access:
		game:GetService("DataStoreService"):GetDataStore("__TEST"):SetAsync("__TEST", "__TEST_" .. os.time())
	end)
	if not status and message:find("403", 1, true) then -- HACK
		-- Can connect to datastores, but no API access
		shouldUseMock = true
	end
end

-- Return the mock or actual service depending on environment:
if shouldUseMock then
	warn("INFO: Using MockDataStoreService instead of DataStoreService")
	return require(MockDataStoreServiceModule).new()
else
	return game:GetService("DataStoreService")
end
