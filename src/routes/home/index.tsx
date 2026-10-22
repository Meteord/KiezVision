import { Pencil, Plus, Upload, Wand2, X } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/app-context.tsx";
import { TransformationType, type ProjectPreset } from "../../types.ts";

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
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState("");
	const [selectedPresetIds, setSelectedPresetIds] = useState(
		defaultPresets.map((preset) => preset.id),
	);
	const [customPresets, setCustomPresets] = useState<ProjectPreset[]>([]);
	const [customPresetLabel, setCustomPresetLabel] = useState("");
	const [customPresetPrompt, setCustomPresetPrompt] = useState("");
	const fileRef = useRef<HTMLInputElement>(null);

	const save = async (event: FormEvent) => {
		event.preventDefault();
		if (
			!name.trim() ||
			!description.trim() ||
			!image ||
			(!selectedPresetIds.length && !customPresets.length)
		)
			return;
		const project = {
			id: crypto.randomUUID(),
			name: name.trim(),
			description: description.trim(),
			defaultImage: image,
			presets: [
				...defaultPresets.filter((preset) =>
					selectedPresetIds.includes(preset.id),
				),
				...customPresets,
			],
			createdAt: Date.now(),
		};
		await projects.createProject(project);
		setName("");
		setDescription("");
		setImage("");
		setSelectedPresetIds(defaultPresets.map((preset) => preset.id));
		setCustomPresets([]);
		setCustomPresetLabel("");
		setCustomPresetPrompt("");
		setCreating(false);
	};

	const closeForm = () => {
		setCreating(false);
		setName("");
		setDescription("");
		setImage("");
		setSelectedPresetIds(defaultPresets.map((preset) => preset.id));
		setCustomPresets([]);
		setCustomPresetLabel("");
		setCustomPresetPrompt("");
	};

	const addCustomPreset = () => {
		if (!customPresetLabel.trim() || !customPresetPrompt.trim()) return;
		setCustomPresets((presets) => [
			...presets,
			{
				id: crypto.randomUUID(),
				label: customPresetLabel.trim(),
				prompt: customPresetPrompt.trim(),
			},
		]);
		setCustomPresetLabel("");
		setCustomPresetPrompt("");
	};

	const pickImage = (file?: File) => {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => setImage(reader.result as string);
		reader.readAsDataURL(file);
	};

	return (
		<div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
			<div className="relative overflow-hidden plan-rule-title bg-coral-100 px-5 py-7 sm:px-8 sm:py-10 md:px-12 md:py-12 mb-10 sm:mb-14">
				<div
					className="absolute inset-0 plan-grid opacity-50"
					aria-hidden="true"
				/>
				<div className="relative flex flex-wrap items-end justify-between gap-6">
					<div>
						<h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-black tracking-[-0.07em] leading-[0.86] uppercase max-w-5xl">
							{content.projectCatalogTitle}
						</h2>
						<p className="mt-6 max-w-xl text-base sm:text-lg font-bold text-eb-900/75">
							{content.projectCatalogSubtitle}
						</p>
					</div>
					<button
						type="button"
						onClick={() => (creating ? closeForm() : setCreating(true))}
						className="relative inline-flex items-center gap-2 bg-coral-500 text-eb-50 px-6 h-12 border-2 border-coral-500 text-xs font-black uppercase tracking-[0.08em] hover:bg-eb-900 hover:border-eb-900 transition-colors"
					>
						<Plus className="w-4 h-4" />{" "}
						{creating ? content.close : content.createProject}
					</button>
				</div>
			</div>

			{creating && (
				<form
					onSubmit={(event) => void save(event)}
					className="mb-12 bg-header border-y-4 border-eb-900 p-6 sm:p-8 md:p-10 grid gap-5"
				>
					<h3 className="font-display text-3xl font-black tracking-[-0.05em] uppercase">
						{content.newProject}
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
					<fieldset className="border-t-2 border-eb-900 pt-4">
						<legend className="text-xs font-black">
							{content.customPresets}
						</legend>
						<div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]">
							<input
								value={customPresetLabel}
								onChange={(event) => setCustomPresetLabel(event.target.value)}
								placeholder={content.customPresetName}
								className="h-12 border-2 border-eb-900 px-4 font-bold"
							/>
							<input
								value={customPresetPrompt}
								onChange={(event) => setCustomPresetPrompt(event.target.value)}
								placeholder={content.customPresetPrompt}
								className="h-12 border-2 border-eb-900 px-4 font-bold"
							/>
							<button
								type="button"
								onClick={addCustomPreset}
								disabled={
									!customPresetLabel.trim() || !customPresetPrompt.trim()
								}
								className="h-12 border-2 border-eb-900 bg-coral-100 px-4 text-xs font-black disabled:opacity-50"
							>
								{content.addPreset}
							</button>
						</div>
						{customPresets.length > 0 && (
							<div className="mt-3 grid gap-2">
								{customPresets.map((preset) => (
									<div
										key={preset.id}
										className="flex items-center justify-between gap-4 border-2 border-eb-900 px-4 py-3"
									>
										<div>
											<p className="font-black">{preset.label}</p>
											<p className="text-sm font-bold text-eb-900/70">
												{preset.prompt}
											</p>
										</div>
										<button
											type="button"
											onClick={() =>
												setCustomPresets((presets) =>
													presets.filter((item) => item.id !== preset.id),
												)
											}
											className="shrink-0 p-2 hover:bg-coral-100"
											aria-label={content.removePreset}
											title={content.removePreset}
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								))}
							</div>
						)}
					</fieldset>
					<button
						type="submit"
						className="justify-self-start bg-tsb text-eb-50 px-6 h-12 border-2 border-eb-900 text-xs font-black disabled:opacity-50"
						disabled={
							!image || (!selectedPresetIds.length && !customPresets.length)
						}
					>
						{content.saveProject}
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
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
					{projects.projects.map((project) => (
						<article
							key={project.id}
							className="flex h-full flex-col bg-eb-50 border-t-4 border-b-4 border-eb-900"
						>
							<button
								type="button"
								className="flex flex-1 flex-col text-left w-full group"
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
									className="w-full aspect-[4/3] object-cover border-b-4 border-eb-900 group-hover:opacity-80 transition-opacity"
								/>
								<div className="flex flex-1 flex-col p-6 bg-eb-50">
									<h3 className="font-display text-3xl font-black tracking-[-0.05em] uppercase">
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
							<div className="grid grid-cols-2 border-t-2 border-eb-900 bg-coral-100">
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
									onClick={() =>
										navigate(`/projects/${encodeURIComponent(project.id)}/edit`)
									}
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
