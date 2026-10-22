import React from "react";
import { Download, Info, Library } from "lucide-react";
import type { ContentStrings } from "../../content.ts";
import type { Language } from "../../content.ts";
import { PLANTREFF_LOGO_URL } from "../../constants.ts";

export type AppView = "home" | "editor" | "library" | "image-gallery" | "about";

export interface AppHeaderProps {
	language: Language;
	content: ContentStrings;
	view: AppView;
	currentImage: string | null;
	onGoHome: () => void;
	onGoAbout: () => void;
	onGoLibrary: () => void;
	onDownload: () => void;
	onSetLanguage: (language: Language) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
	language,
	content,
	view,
	currentImage,
	onGoHome,
	onGoAbout,
	onGoLibrary,
	onDownload,
	onSetLanguage,
}) => (
	<header className="border-b-4 border-eb-900 bg-[#2e475f] sticky top-0 z-50 max-w-full overflow-x-hidden">
		<nav
			aria-label={language === "en" ? "Main navigation" : "Hauptnavigation"}
			className="w-full max-w-screen-2xl mx-auto min-w-0 px-3 sm:px-5 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4"
		>
			<div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 shrink">
				<button
					onClick={onGoHome}
					aria-label={language === "en" ? "Go to homepage" : "Zur Startseite"}
					className="bg-[#2e475f] px-1 h-10 w-32 sm:h-12 sm:w-40 flex items-center justify-center hover:bg-coral-100 transition-colors"
				>
					<img
						src={PLANTREFF_LOGO_URL}
						className="w-full h-full object-contain"
						alt="Plantreff München"
					/>
				</button>
			</div>

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
