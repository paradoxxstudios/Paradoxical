import { DataStoreService } from "@rbxts/services";

/*
	Since MockDataStoreService is 
	designed to mock DataStoreService,
	we can just use its typings.
*/
declare const DataStoreWrapper: DataStoreService;

export = DataStoreWrapper;
