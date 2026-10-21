import { Pencil, Plus, Upload, Wand2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/app-context.tsx";
import {
	TransformationType,
	type Project,
	type ProjectPreset,
} from "../../types.ts";

export default function HomePage() {
	const { language, content, projects, startProject } = useAppContext();
	const navigate = useNavigate();
	const defaultPresets: ProjectPreset[] = [
		{
			id: "nature",
			label: language === "en" ? "Add nature" : "Natur hinzufügen",
			prompt: TransformationType.ADD_TREES,
		},
		{
			id: "no-cars",
			label: language === "en" ? "No cars" : "Ohne Autos",
			prompt: TransformationType.REMOVE_CARS,
		},
		{
			id: "benches",
			label: language === "en" ? "Add benches" : "Sitzbänke hinzufügen",
			prompt: TransformationType.ADD_BENCH,
		},
		{
			id: "bike-racks",
			label: language === "en" ? "Bike racks" : "Fahrradständer",
			prompt: TransformationType.ADD_BIKE_RACK,
		},
	];
	const [creating, setCreating] = useState(false);
	const [editingProject, setEditingProject] = useState<Project | null>(null);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState("");
	const [selectedPresetIds, setSelectedPresetIds] = useState(
		defaultPresets.map((preset) => preset.id),
	);
	const fileRef = useRef<HTMLInputElement>(null);

	const save = async (event: FormEvent) => {
		event.preventDefault();
		if (
			!name.trim() ||
			!description.trim() ||
			!image ||
			!selectedPresetIds.length
		)
			return;
		const project = {
			id: editingProject?.id ?? crypto.randomUUID(),
			name: name.trim(),
			description: description.trim(),
			defaultImage: image,
			presets: defaultPresets.filter((preset) =>
				selectedPresetIds.includes(preset.id),
			),
			createdAt: editingProject?.createdAt ?? Date.now(),
		};
		if (editingProject) await projects.updateProject(project);
		else await projects.createProject(project);
		setName("");
		setDescription("");
		setImage("");
		setSelectedPresetIds(defaultPresets.map((preset) => preset.id));
		setEditingProject(null);
		setCreating(false);
	};

	const openEdit = (project: Project) => {
		setEditingProject(project);
		setName(project.name);
		setDescription(project.description);
		setImage(project.defaultImage);
		setSelectedPresetIds(project.presets.map((preset) => preset.id));
		setCreating(true);
	};

	const closeForm = () => {
		setCreating(false);
		setEditingProject(null);
		setName("");
		setDescription("");
		setImage("");
		setSelectedPresetIds(defaultPresets.map((preset) => preset.id));
	};

	const pickImage = (file?: File) => {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => setImage(reader.result as string);
		reader.readAsDataURL(file);
	};

	return (
		<div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12 md:py-16">
			<div className="flex flex-wrap items-end justify-between gap-6 mb-12 border-b-4 border-eb-900 pb-8">
				<div>
					<p className="text-xs font-black uppercase tracking-widest text-tsb mb-3">
						{content.projectCatalogEyebrow}
					</p>
					<h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
						{content.projectCatalogTitle}
					</h2>
					<p className="mt-4 max-w-2xl text-lg font-bold text-eb-900/70">
						{content.projectCatalogSubtitle}
					</p>
				</div>
				<button
					type="button"
					onClick={() => (creating ? closeForm() : setCreating(true))}
					className="inline-flex items-center gap-2 bg-eb-900 text-eb-50 px-6 h-12 border-2 border-eb-900 text-xs font-black shadow-[4px_4px_0px_0px_rgba(255,207,214,1)] hover:shadow-none"
				>
					<Plus className="w-4 h-4" />{" "}
					{creating ? content.close : content.createProject}
				</button>
			</div>

			{creating && (
				<form
					onSubmit={(event) => void save(event)}
					className="mb-12 bg-white border-4 border-eb-900 p-6 md:p-8 shadow-[10px_10px_0px_0px_rgba(255,207,214,1)] grid gap-5"
				>
					<h3 className="text-2xl font-black tracking-tighter">
						{editingProject ? content.editProject : content.newProject}
					</h3>
					<input
						required
						value={name}
						onChange={(event) => setName(event.target.value)}
						placeholder={content.projectNamePlaceholder}
						className="h-12 border-2 border-eb-900 px-4 font-bold"
					/>
					<textarea
						required
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						placeholder={content.projectDescriptionPlaceholder}
						className="min-h-24 border-2 border-eb-900 p-4 font-bold"
					/>
					<div>
						<input
							ref={fileRef}
							type="file"
							accept="image/*"
							onChange={(event) => pickImage(event.target.files?.[0])}
							className="hidden"
						/>
						<button
							type="button"
							onClick={() => fileRef.current?.click()}
							className="inline-flex items-center gap-2 h-12 px-4 border-2 border-eb-900 bg-coral-100 text-xs font-black"
						>
							<Upload className="w-4 h-4" />{" "}
							{image ? content.replaceDefaultImage : content.chooseDefaultImage}
						</button>
						{image && (
							<img
								src={image}
								alt={content.projectPreview}
								className="mt-3 h-32 w-48 object-cover border-2 border-eb-900"
							/>
						)}
					</div>
					<fieldset className="border-t-2 border-eb-900 pt-4">
						<legend className="text-xs font-black">
							{content.predefinedPresets}
						</legend>
						<div className="flex flex-wrap gap-3 mt-3">
							{defaultPresets.map((preset) => (
								<label
									key={preset.id}
									className="inline-flex items-center gap-2 text-sm font-bold"
								>
									<input
										type="checkbox"
										checked={selectedPresetIds.includes(preset.id)}
										onChange={() =>
											setSelectedPresetIds((ids) =>
												ids.includes(preset.id)
													? ids.filter((id) => id !== preset.id)
													: [...ids, preset.id],
											)
										}
									/>{" "}
									{preset.label}
								</label>
							))}
						</div>
					</fieldset>
					<button
						type="submit"
						className="justify-self-start bg-tsb text-eb-50 px-6 h-12 border-2 border-eb-900 text-xs font-black disabled:opacity-50"
						disabled={!image || !selectedPresetIds.length}
					>
						{editingProject ? content.updateProject : content.saveProject}
					</button>
				</form>
			)}

			{/* eslint-disable-next-line no-nested-ternary */}
			{!projects.loaded ? (
				<p className="font-black">{content.loadingProjects}</p>
			) : projects.projects.length === 0 ? (
				<div className="border-4 border-dashed border-eb-900 p-12 text-center bg-white">
					<Wand2 className="w-10 h-10 mx-auto mb-4" />
					<h3 className="text-2xl font-black">{content.firstProjectTitle}</h3>
					<p className="mt-2 font-bold text-eb-900/70">
						{content.firstProjectSubtitle}
					</p>
				</div>
			) : (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{projects.projects.map((project) => (
						<article
							key={project.id}
							className="bg-white border-4 border-eb-900 shadow-[8px_8px_0px_0px_rgba(32,32,27,1)]"
						>
							<button
								type="button"
								className="text-left w-full group"
								onClick={() => {
									const username = window
										.prompt(content.projectUsernamePrompt)
										?.trim();
									if (username) startProject(project, username);
								}}
							>
								<img
									src={project.defaultImage}
									alt=""
									className="w-full aspect-[4/3] object-cover border-b-2 border-eb-900 group-hover:opacity-80"
								/>
								<div className="p-6">
									<h3 className="text-2xl font-black tracking-tighter">
										{project.name}
									</h3>
									<p className="mt-3 text-sm font-bold text-eb-900/70">
										{project.description}
									</p>
									<p className="mt-5 text-xs font-black uppercase tracking-widest">
										{project.presets.length} {content.presets.toLowerCase()} ·{" "}
										{content.projectStartEditing}
									</p>
								</div>
							</button>
							<div className="grid grid-cols-2 border-t-2 border-eb-900">
								<button
									type="button"
									onClick={() =>
										navigate(
											`/library?projectId=${encodeURIComponent(project.id)}`,
										)
									}
									className="flex h-12 items-center justify-center border-r-2 border-eb-900 hover:bg-coral-100"
									aria-label={content.viewProjectVisions}
									title={content.viewProjectVisions}
								>
									<Wand2 className="w-4 h-4" />
								</button>
								<button
									type="button"
									onClick={() => openEdit(project)}
									className="flex h-12 items-center justify-center hover:bg-coral-100"
									aria-label={content.editProject}
									title={content.editProject}
								>
									<Pencil className="w-4 h-4" />
								</button>
							</div>
						</article>
					))}
				</div>
			)}
		</div>
	);
}
