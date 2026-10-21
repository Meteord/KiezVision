import { useCallback, useEffect, useState } from "react";
import {
	deleteProject,
	getProjects,
	saveProject,
} from "../services/projectStorage.ts";
import type { Project } from "../types.ts";

export function useProjects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		let active = true;
		void getProjects()
			.then((items) => {
				if (active)
					setProjects(items.sort((a, b) => b.createdAt - a.createdAt));
			})
			.finally(() => {
				if (active) setLoaded(true);
			});
		return () => {
			active = false;
		};
	}, []);

	const createProject = useCallback(async (project: Project) => {
		await saveProject(project);
		setProjects((current) => [project, ...current]);
	}, []);

	const updateProject = useCallback(async (project: Project) => {
		await saveProject(project);
		setProjects((current) =>
			current.map((item) => (item.id === project.id ? project : item)),
		);
	}, []);

	const removeProject = useCallback(async (id: string) => {
		await deleteProject(id);
		setProjects((current) => current.filter((project) => project.id !== id));
	}, []);

	return { projects, loaded, createProject, updateProject, removeProject };
}
