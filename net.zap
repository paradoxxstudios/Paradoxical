opt server_output = "src/server/zap/init.lua"
opt client_output = "src/shared/zap/init.lua"
opt typescript = true
opt casing = "camelCase"
opt yield_type = "promise"
opt async_lib = "require(game:GetService('ReplicatedStorage')['rbxts_include'].RuntimeLib)"

event MyEvent = {
	from: Client,
	type: Reliable,
	call: ManyAsync,
	data: struct {
		foo: u32,
		bar: string,
	},
}