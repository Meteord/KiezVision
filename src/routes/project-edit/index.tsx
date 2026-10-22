import { ArrowLeft, Upload, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../context/app-context.tsx";
import { TransformationType, type ProjectPreset } from "../../types.ts";

export default function ProjectEditPage() {
	const { language, content, projects } = useAppContext();
	const { projectId } = useParams();
	const navigate = useNavigate();
	const project = projects.projects.find((item) => item.id === projectId);
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
	const [name, setName] = useState(project?.name ?? "");
	const [description, setDescription] = useState(project?.description ?? "");
	const [image, setImage] = useState(project?.defaultImage ?? "");
	const [selectedPresetIds, setSelectedPresetIds] = useState(
		() =>
			project?.presets
				.filter((preset) =>
					defaultPresets.some((item) => item.id === preset.id),
				)
				.map((preset) => preset.id) ?? [],
	);
	const [customPresets, setCustomPresets] = useState<ProjectPreset[]>(
		() =>
			project?.presets.filter(
				(preset) => !defaultPresets.some((item) => item.id === preset.id),
			) ?? [],
	);
	const [customPresetLabel, setCustomPresetLabel] = useState("");
	const [customPresetPrompt, setCustomPresetPrompt] = useState("");
	const fileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!project) return;
		setName(project.name);
		setDescription(project.description);
		setImage(project.defaultImage);
		setSelectedPresetIds(
			project.presets
				.filter((preset) =>
					defaultPresets.some((item) => item.id === preset.id),
				)
				.map((preset) => preset.id),
		);
		setCustomPresets(
			project.presets.filter(
				(preset) => !defaultPresets.some((item) => item.id === preset.id),
			),
		);
	}, [project]);

	if (!projects.loaded) {
		return <p className="p-8 font-black">{content.loadingProjects}</p>;
	}

	if (!project) {
		return (
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				<button
					type="button"
					onClick={() => navigate("/")}
					className="inline-flex items-center gap-2 border-2 border-eb-900 px-4 h-10 font-black bg-coral-100"
				>
					<ArrowLeft className="w-4 h-4" /> {content.backToHome}
				</button>
			</div>
		);
	}

	const save = async (event: FormEvent) => {
		event.preventDefault();
		if (
			!name.trim() ||
			!description.trim() ||
			!image ||
			(!selectedPresetIds.length && !customPresets.length)
		)
			return;
		await projects.updateProject({
			...project,
			name: name.trim(),
			description: description.trim(),
			defaultImage: image,
			presets: [
				...defaultPresets.filter((preset) =>
					selectedPresetIds.includes(preset.id),
				),
				...customPresets,
			],
		});
		navigate("/");
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
			<div className="mb-8 flex items-center justify-between gap-4">
				<h2 className="font-display text-4xl sm:text-5xl font-black tracking-[-0.07em] uppercase">
					{content.editProject}
				</h2>
				<button
					type="button"
					onClick={() => navigate("/")}
					className="inline-flex items-center gap-2 border-2 border-eb-900 px-4 h-10 font-black bg-coral-100"
				>
					<ArrowLeft className="w-4 h-4" /> {content.backToHome}
				</button>
			</div>
			<form
				onSubmit={(event) => void save(event)}
				className="bg-header border-y-4 border-eb-900 p-6 sm:p-8 md:p-10 grid gap-5"
			>
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
							disabled={!customPresetLabel.trim() || !customPresetPrompt.trim()}
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
					disabled={
						!image || (!selectedPresetIds.length && !customPresets.length)
					}
					className="justify-self-start bg-tsb text-eb-50 px-6 h-12 border-2 border-eb-900 text-xs font-black disabled:opacity-50"
				>
					{content.saveAndGoBack}
				</button>
			</form>
		</div>
	);
}
