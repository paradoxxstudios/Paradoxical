local fs = require("@lune/fs" :: string)
local task = require("@lune/task" :: string)

return function(dir)
    print("\nRemoving files from:", dir)
    for _, file in fs.readDir(dir) do
        print("Removing " .. file)
        fs.removeFile(dir .. "/" .. file)
    end
    print("Removing finished\n")
    task.wait(2)
end
