return function()
    local Greeter = require(script.Parent.Parent.greeter)

    describe("greet", function()
        it("should include the customary English greeting", function()
            local greeting = Greeter:greet("X")
            expect(greeting:match("Hello")).to.be.ok()
        end)

        it("should include the person being greeted", function()
            local greeting = Greeter:greet("Joe")
            expect(greeting:match("Joe")).to.be.ok()
        end)
    end)
end