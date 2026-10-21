import type { LibraryEntry, Project } from "../types.ts";

const DB_NAME = "kiezvision-projects";
const DB_VERSION = 1;
const PROJECTS = "projects";
const LIBRARY = "library";

const openDb = (): Promise<IDBDatabase> =>
	new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(PROJECTS)) {
				db.createObjectStore(PROJECTS, { keyPath: "id" });
			}
			if (!db.objectStoreNames.contains(LIBRARY)) {
				db.createObjectStore(LIBRARY, { keyPath: "id" });
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});

const all = async <T>(storeName: string): Promise<T[]> => {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const request = db
			.transaction(storeName, "readonly")
			.objectStore(storeName)
			.getAll();
		request.onsuccess = () => resolve(request.result as T[]);
		request.onerror = () => reject(request.error);
	});
};

const put = async <T>(storeName: string, value: T): Promise<void> => {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const request = db
			.transaction(storeName, "readwrite")
			.objectStore(storeName)
			.put(value);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
};

const remove = async (storeName: string, id: string): Promise<void> => {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const request = db
			.transaction(storeName, "readwrite")
			.objectStore(storeName)
			.delete(id);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
};

export const getProjects = () => all<Project>(PROJECTS);
export const saveProject = (project: Project) => put(PROJECTS, project);
export const deleteProject = (id: string) => remove(PROJECTS, id);
export const getBrowserLibrary = () => all<LibraryEntry>(LIBRARY);
export const saveBrowserLibraryEntry = (entry: LibraryEntry) =>
	put(LIBRARY, entry);
export const deleteBrowserLibraryEntry = (id: string) => remove(LIBRARY, id);
