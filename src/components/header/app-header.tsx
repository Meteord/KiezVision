import React from "react";
import {
	Download,
	Info,
	Library,
	MousePointer2,
	Paintbrush2,
	Save,
} from "lucide-react";
import type { ContentStrings } from "../../content.ts";
import type { Language } from "../../content.ts";
import { KIEZVISION_LOGO_URL } from "../../constants.ts";

export type AppView = "home" | "editor" | "library" | "image-gallery" | "about";

export interface AppHeaderProps {
	language: Language;
	content: ContentStrings;
	view: AppView;
	editMode: "comparison" | "mask";
	originalImage: string | null;
	currentImage: string | null;
	onGoHome: () => void;
	onGoAbout: () => void;
	onGoLibrary: () => void;
	onSetEditModeComparison: () => void;
	onSetEditModeMask: () => void;
	onSave: () => void;
	onDownload: () => void;
	onSetLanguage: (language: Language) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
	language,
	content,
	view,
	editMode,
	originalImage,
	currentImage,
	onGoHome,
	onGoAbout,
	onGoLibrary,
	onSetEditModeComparison,
	onSetEditModeMask,
	onSave,
	onDownload,
	onSetLanguage,
}) => (
	<header className="border-b-4 border-eb-900 bg-eb-50 sticky top-0 z-50 max-w-full overflow-x-hidden">
		<nav
			aria-label={language === "en" ? "Main navigation" : "Hauptnavigation"}
			className="w-full max-w-screen-2xl mx-auto min-w-0 px-3 sm:px-5 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4"
		>
			<div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 shrink">
				<button
					onClick={onGoHome}
					aria-label={language === "en" ? "Go to homepage" : "Zur Startseite"}
					className="bg-coral-500 p-0 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center border-2 border-eb-900 hover:bg-coral-100 transition-colors overflow-hidden"
				>
					<img
						src={KIEZVISION_LOGO_URL}
						className="w-full h-full object-cover"
						alt=""
						aria-hidden="true"
					/>
				</button>
				<div>
					<h1 className="font-display text-lg sm:text-xl lg:text-2xl font-black tracking-[-0.07em] leading-none mb-1 text-eb-900 truncate uppercase">
						KiezVision
					</h1>
					<div className="hidden lg:flex items-center gap-3">
						<span className="text-[10px] font-black uppercase tracking-[0.12em] text-eb-900/70 whitespace-nowrap">
							{content.tagline}
						</span>
					</div>
				</div>
			</div>

			{view === "editor" && originalImage && (
				<div
					role="group"
					aria-label={language === "en" ? "Edit mode" : "Bearbeitungsmodus"}
					className="flex items-center gap-1 sm:gap-2 bg-header p-1 border-2 border-eb-900 h-10 lg:h-12 shrink-0"
				>
					<button
						onClick={onSetEditModeComparison}
						aria-pressed={editMode === "comparison"}
						className={`flex items-center gap-1.5 px-2.5 sm:px-3 lg:px-6 h-full text-xs font-black uppercase tracking-wide transition-colors ${editMode === "comparison" ? "bg-eb-900 text-eb-50" : "text-eb-900 hover:bg-coral-100"}`}
					>
						<MousePointer2 className="w-4 h-4 shrink-0" aria-hidden="true" />
						<span className="hidden lg:inline">{content.compare}</span>
						<span className="sr-only lg:hidden">{content.compare}</span>
					</button>
					<button
						onClick={onSetEditModeMask}
						aria-pressed={editMode === "mask"}
						className={`flex items-center gap-1.5 px-2.5 sm:px-3 lg:px-6 h-full text-xs font-black uppercase tracking-wide transition-colors ${editMode === "mask" ? "bg-eb-900 text-eb-50" : "text-eb-900 hover:bg-coral-100"}`}
					>
						<Paintbrush2 className="w-4 h-4 shrink-0" aria-hidden="true" />
						<span className="hidden lg:inline">{content.areaEdit}</span>
						<span className="sr-only lg:hidden">{content.areaEdit}</span>
					</button>
				</div>
			)}

			<div className="flex items-center gap-2 lg:gap-4 h-10 shrink-0">
				<button
					onClick={onGoAbout}
					aria-current={view === "about" ? "page" : undefined}
					className={`flex items-center gap-1.5 px-2.5 sm:px-3 lg:px-6 h-full border-2 border-eb-900 text-xs font-black uppercase tracking-wide transition-colors ${view === "about" ? "bg-eb-900 text-eb-50" : "bg-eb-50 text-eb-900 hover:bg-coral-100"}`}
				>
					<Info className="w-4 h-4 shrink-0" aria-hidden="true" />
					<span className="hidden lg:inline">{content.about}</span>
					<span className="sr-only lg:hidden">{content.about}</span>
				</button>
				<button
					onClick={onGoLibrary}
					aria-current={view === "library" ? "page" : undefined}
					className={`flex items-center gap-1.5 px-2.5 sm:px-3 lg:px-6 h-full border-2 border-eb-900 text-xs font-black uppercase tracking-wide transition-colors ${view === "library" ? "bg-eb-900 text-eb-50" : "bg-eb-50 text-eb-900 hover:bg-coral-100"}`}
				>
					<Library className="w-4 h-4 shrink-0" aria-hidden="true" />
					<span className="hidden lg:inline">{content.library}</span>
					<span className="sr-only lg:hidden">{content.library}</span>
				</button>

				{view === "editor" && currentImage && (
					<div className="flex items-center gap-1.5 sm:gap-2 h-full">
						<button
							onClick={onSave}
							aria-label={
								language === "en" ? "Save to library" : "In Galerie speichern"
							}
							className="bg-coral-500 text-eb-50 px-2.5 sm:px-3 lg:px-6 h-full border-2 border-coral-500 text-xs font-black uppercase tracking-wide transition-colors hover:bg-eb-900 hover:border-eb-900 flex items-center gap-1.5"
						>
							<Save className="w-4 h-4 shrink-0" aria-hidden="true" />
							<span className="hidden lg:inline">{content.save}</span>
						</button>
						<button
							onClick={onDownload}
							aria-label={
								language === "en" ? "Download image" : "Bild herunterladen"
							}
							className="bg-eb-900 text-eb-50 px-2.5 sm:px-3 lg:px-4 h-full border-2 border-eb-900 text-xs font-black transition-colors hover:bg-tsb flex items-center justify-center"
						>
							<Download className="w-4 h-4" aria-hidden="true" />
						</button>
					</div>
				)}

				<div
					role="group"
					aria-label={language === "en" ? "Language" : "Sprache"}
					className="flex items-center border-2 border-eb-900 bg-eb-50 overflow-hidden h-full"
				>
					<button
						onClick={() => onSetLanguage("en")}
						aria-pressed={language === "en"}
						aria-label="English"
						className={`px-2 sm:px-3 h-full text-xs font-black transition-all ${language === "en" ? "bg-eb-900 text-eb-50" : "text-eb-900 hover:bg-coral-100"}`}
					>
						EN
					</button>
					<button
						onClick={() => onSetLanguage("de")}
						aria-pressed={language === "de"}
						aria-label="Deutsch"
						className={`px-2 sm:px-3 h-full text-xs font-black transition-all border-l-2 border-eb-900 ${language === "de" ? "bg-eb-900 text-eb-50" : "text-eb-900 hover:bg-coral-100"}`}
					>
						DE
					</button>
				</div>
			</div>
		</nav>
	</header>
);
