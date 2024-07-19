-- // Visual Config
local CONE_HEIGHT = 0.25
local LINE_THICKNESS = 2.5
local TRANSPARENCY = 0.5
local ALWAYS_ON_TOP = true

-- // CastVisualiser Class
local CastVisualiser = {}

-- // Private Methods \\ --

-- // Public Methods \\ --
function CastVisualiser:Hide()
	self.CastOriginPart.Parent = nil
end

function CastVisualiser:Raycast(Origin: Vector3, Direction: Vector3, RaycastParameters: RaycastParams?)
	local self: CastVisualiserPrivate = self
	
	local Cast = self.WorldRoot:Raycast(Origin, Direction, RaycastParameters)
	if not Cast then
		self:Hide()
		return
	end
	
	self.CastOriginPart.CFrame = CFrame.lookAt(Origin, Cast.Position)

	self.LineVisual.Length = Cast.Distance - CONE_HEIGHT
	self.ConeVisual.CFrame = CFrame.new(0, 0, -Cast.Distance)
	
	self.BoxVisual.Visible = false
	self.SphereVisual.Visible = false
	
	self.CastOriginPart.Parent = self.WorldRoot:FindFirstChild("Terrain") or self.WorldRoot
end


function CastVisualiser:Blockcast(CF: CFrame, Size: Vector3, Direction: Vector3, RaycastParameters: RaycastParams?)
	local self: CastVisualiserPrivate = self
	
	local Cast = self.WorldRoot:Blockcast(CF, Size, Direction, RaycastParameters)
	if not Cast then
		self:Hide()
		return
	end
	
	self.CastOriginPart.CFrame = CF
	
	local LookAt = CFrame.lookAt(Vector3.zero, Direction.Unit)
	local BoxCF = CFrame.new(Direction.Unit * Cast.Distance)
	
	self.LineVisual.Length = Cast.Distance - CONE_HEIGHT
	self.LineVisual.CFrame = LookAt
	
	self.ConeVisual.CFrame = CFrame.lookAt(BoxCF.Position - (Direction.Unit * CONE_HEIGHT), BoxCF.Position + Direction)
	
	self.BoxVisual.CFrame = BoxCF
	self.BoxVisual.Size = Size
	
	self.BoxVisual.Visible = true
	self.SphereVisual.Visible = false
	
	self.CastOriginPart.Parent = self.WorldRoot:FindFirstChild("Terrain") or self.WorldRoot
end


function CastVisualiser:SphereCast(Origin: Vector3, Radius: number, Direction: Vector3, RaycastParameters: RaycastParams?)
	local self: CastVisualiserPrivate = self
	
	local Cast = self.WorldRoot:Spherecast(Origin, Radius, Direction, RaycastParameters)
	if not Cast then
		self:Hide()
		return
	end
	
	local FinalPos = Origin + (Direction.Unit * Cast.Distance)

	self.CastOriginPart.CFrame = CFrame.lookAt(Origin, FinalPos)

	self.LineVisual.Length = Cast.Distance - CONE_HEIGHT
	self.ConeVisual.CFrame = CFrame.new(0, 0, -Cast.Distance)
	
	self.SphereVisual.CFrame = CFrame.new(0, 0, -Cast.Distance)
	self.SphereVisual.Radius = Radius
	
	self.SphereVisual.Visible = true
	self.BoxVisual.Visible = false
	
	self.CastOriginPart.Parent = self.WorldRoot:FindFirstChild("Terrain") or self.WorldRoot
end

-- Types
export type CastVisualiser = typeof(CastVisualiser)
type CastVisualiserPrivate = CastVisualiser & {
	Color: Color3,
	WorldRoot: WorldRoot,
	CastOriginPart: BasePart,
	
	LineVisual: LineHandleAdornment,
	ConeVisual: ConeHandleAdornment,
	BoxVisual: BoxHandleAdornment,
	SphereVisual: SphereHandleAdornment,
}


-- // Main
local Visuals = {}

--[[

	CastVisualiser Visuals.new(Color: Color3?, WorldRoot: WorldRoot?)
		Creates and returns a CastVisualiser class.

--]]

local Meta = {__index = CastVisualiser}

function Visuals.new(Color: Color3?, WorldRoot: WorldRoot?): CastVisualiser
	local self = setmetatable({
	    Color = Color or Color3.new(1, 0, 0),
		WorldRoot = WorldRoot or workspace,
	}, Meta)
	
	-- Origin Part
	local CastOriginPart = Instance.new("Part")
	CastOriginPart.Transparency = 1
	CastOriginPart.CanCollide = false
	CastOriginPart.CanQuery = false
	CastOriginPart.CanTouch = false
	CastOriginPart.Anchored = true
	CastOriginPart.Size = Vector3.one / 100

	self.CastOriginPart = CastOriginPart
	
	-- Visuals
	local LineHandleAdornment = Instance.new("LineHandleAdornment")
	LineHandleAdornment.Color3 = self.Color
	LineHandleAdornment.AlwaysOnTop = ALWAYS_ON_TOP
	LineHandleAdornment.Transparency = TRANSPARENCY
	LineHandleAdornment.Thickness = LINE_THICKNESS
	LineHandleAdornment.ZIndex = 1
	LineHandleAdornment.Adornee = CastOriginPart
	LineHandleAdornment.Parent = CastOriginPart
	
	self.LineVisual = LineHandleAdornment
	
	local ConeHandleAdornmnet = Instance.new("ConeHandleAdornment")
	ConeHandleAdornmnet.Color3 = self.Color
	ConeHandleAdornmnet.AlwaysOnTop = ALWAYS_ON_TOP
	ConeHandleAdornmnet.Transparency = TRANSPARENCY
	ConeHandleAdornmnet.Radius = 0.05
	ConeHandleAdornmnet.Height = CONE_HEIGHT
	ConeHandleAdornmnet.SizeRelativeOffset = Vector3.new(0, 0, CONE_HEIGHT * 2)
	ConeHandleAdornmnet.ZIndex = 1
	ConeHandleAdornmnet.Adornee = CastOriginPart
	ConeHandleAdornmnet.Parent = CastOriginPart
	
	self.ConeVisual = ConeHandleAdornmnet
	
	local BoxHandleAdornment = Instance.new("BoxHandleAdornment")
	BoxHandleAdornment.Color3 = self.Color
	BoxHandleAdornment.AlwaysOnTop = ALWAYS_ON_TOP
	BoxHandleAdornment.Transparency = TRANSPARENCY
	BoxHandleAdornment.ZIndex = 0
	BoxHandleAdornment.Adornee = CastOriginPart
	BoxHandleAdornment.Parent = CastOriginPart
	
	self.BoxVisual = BoxHandleAdornment
	
	local SphereHandleAdornment = Instance.new("SphereHandleAdornment")
	SphereHandleAdornment.Color3 = self.Color
	SphereHandleAdornment.AlwaysOnTop = ALWAYS_ON_TOP
	SphereHandleAdornment.Transparency = TRANSPARENCY
	SphereHandleAdornment.ZIndex = 0
	SphereHandleAdornment.Adornee = CastOriginPart
	SphereHandleAdornment.Parent = CastOriginPart
	
	self.SphereVisual = SphereHandleAdornment
	
	return self
end

return {
	RaycastVisualizer = Visuals
}
