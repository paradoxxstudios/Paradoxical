import coreCall from "shared/utils/coreCall";

const resetBindable = new Instance("BindableEvent");
resetBindable.Name = "ResetBindable";
coreCall("SetCore", ...["ResetButtonCallback", resetBindable]);
resetBindable.Event.Connect(() => {
	
});
