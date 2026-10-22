import { useNavigate, useSearchParams } from "react-router-dom";
import { Library, Wand2 } from "lucide-react";
import { BackToHomeButton } from "../../components/primitives/navigation/back-to-home-button.tsx";
import { useAppContext } from "../../context/app-context.tsx";
import type { LibraryEntry } from "../../types.ts";
import { LibraryEntryCard } from "./library-entry-card.tsx";

export default function LibraryPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const {
		language,
		content,
		library,
		projects,
		handleOpenLibraryEntry,
		handleDownloadLibraryEntry,
	} = useAppContext();
	const projectId = searchParams.get("projectId");
	const selectedProject = projectId
		? projects.projects.find((item) => item.id === projectId)
		: undefined;
	const selectedEntries = projectId
		? library.library.filter((entry) => entry.projectId === projectId)
		: library.library;
	const groups = new Map<string, Map<string, LibraryEntry[]>>();
	for (const entry of selectedEntries) {
		const groupProject = entry.projectName || content.earlierSaves;
		const username = entry.username || content.unassigned;
		const users = groups.get(groupProject) || new Map<string, LibraryEntry[]>();
		users.set(username, [...(users.get(username) || []), entry]);
		groups.set(groupProject, users);
	}

	return (
		<div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<div className="bg-tsb text-eb-50 border-y-4 border-eb-900 px-5 py-8 sm:px-8 sm:py-10 flex flex-wrap items-end justify-between gap-6 mb-12">
				<div>
					<div className="mb-4">
						<BackToHomeButton navigate={navigate} label={content.backToHome} />
					</div>
					<h2 className="font-display text-5xl md:text-7xl font-black tracking-[-0.07em] leading-[0.85] uppercase">
						{selectedProject
							? `${content.imageLibrary}: ${selectedProject.name}`
							: content.imageLibrary}
					</h2>
					<p className="mt-4 font-bold text-eb-50/75">
						{content.libraryProjectSubtitle}
					</p>
				</div>
			</div>
			{selectedEntries.length === 0 ? (
				<div className="bg-coral-100 border-y-4 border-eb-900 p-12 text-center">
					<Library className="w-10 h-10 mx-auto mb-4" />
					<h3 className="text-3xl font-black tracking-tighter">
						{selectedProject
							? content.projectVisionsEmpty
							: content.libraryEmptyTitle}
					</h3>
					<button
						onClick={() => navigate("/")}
						className="mt-7 inline-flex items-center gap-2 bg-eb-900 text-eb-50 px-6 h-12 text-xs font-black"
					>
						<Wand2 className="w-4 h-4" /> {content.libraryEmptyCta}
					</button>
				</div>
			) : (
				<div className="space-y-14">
					{Array.from(groups.entries()).map(([groupProject, users]) => (
						<section key={groupProject}>
							<div className="flex items-center gap-4 mb-7">
								<h3 className="bg-coral-500 text-eb-50 px-4 py-2 text-xl font-black uppercase tracking-wide">
									{groupProject}
								</h3>
								<div className="h-0.5 flex-1 bg-eb-900/10" />
							</div>
							{Array.from(users.entries()).map(([username, userEntries]) => (
								<div key={username} className="mb-10">
									<h4 className="text-sm font-black uppercase tracking-widest mb-5">
										{username}{" "}
										<span className="text-eb-900/50">
											· {userEntries.length}{" "}
											{userEntries.length === 1
												? content.visionCount
												: content.visionsCountLabel}
										</span>
									</h4>
									<div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
										{userEntries
											.sort((a, b) => b.timestamp - a.timestamp)
											.map((item) => (
												<LibraryEntryCard
													key={item.id}
													item={item}
													thumbUrl={
														library.thumbCache[item.id] ?? item.dataUrl ?? null
													}
													language={language}
													content={content}
													onOpenInEditor={handleOpenLibraryEntry}
													onDownload={handleDownloadLibraryEntry}
													onDelete={(id) => void library.removeFromLibrary(id)}
												/>
											))}
									</div>
								</div>
							))}
						</section>
					))}
				</div>
			)}
		</div>
	);
}
