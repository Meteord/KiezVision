import { useNavigate } from "react-router-dom";
import { Wand2 } from "lucide-react";
import { BackToHomeButton } from "../../components/primitives/navigation/back-to-home-button.tsx";
import { useAppContext } from "../../context/app-context.tsx";

export default function ImageGalleryPage() {
	const navigate = useNavigate();
	const {
		language,
		content,
		uploadedGallery,
		selectedGalleryId,
		setSelectedGalleryId,
		editor,
	} = useAppContext();

	const selected =
		uploadedGallery.find((x) => x.id === selectedGalleryId) ??
		uploadedGallery[0] ??
		null;

	return (
		<div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
			<div className="bg-coral-100 border-y-4 border-eb-900 px-5 py-6 sm:px-8 sm:py-8 mb-8 flex-shrink-0">
				<h2 className="font-display text-5xl md:text-7xl font-black tracking-[-0.07em] leading-[0.85] uppercase">
					{content.imageGallery}
				</h2>
			</div>

			{uploadedGallery.length === 0 ? (
				<div className="bg-header border-y-4 border-eb-900 p-10">
					<p className="text-lg font-black tracking-tight text-eb-900">
						{language === "en"
							? "No folder images loaded yet. Go back and select a folder."
							: "Noch keine Ordnerbilder geladen. Gehen Sie zurück und wählen Sie einen Ordner."}
					</p>
					<div className="mt-8">
						<BackToHomeButton navigate={navigate} label={content.backToHome} />
					</div>
				</div>
			) : (
				<div className="grid grid-cols-12 gap-4 md:gap-8 flex-1 min-h-0 overflow-hidden">
					<div className="col-span-12 md:col-span-4 min-h-0 overflow-hidden">
						<div className="bg-eb-50 border-y-4 border-eb-900 overflow-hidden h-full flex flex-col min-h-0">
							<div className="bg-tsb text-eb-50 px-4 py-2 text-xs font-black">
								{language === "en" ? "Uploaded images" : "Hochgeladene Bilder"}{" "}
								• {uploadedGallery.length}
							</div>
							<div className="overflow-y-auto custom-scrollbar p-4 flex flex-col gap-5 flex-1 min-h-0">
								{uploadedGallery.map((img) => (
									<button
										key={img.id}
										type="button"
										onClick={() => setSelectedGalleryId(img.id)}
										aria-current={
											selectedGalleryId === img.id ? "true" : undefined
										}
										aria-label={img.prompt}
										className={`w-full h-36 sm:h-40 md:h-48 flex-shrink-0 overflow-hidden transition-all ${
											selectedGalleryId === img.id
												? "border-4 border-coral-500"
												: "border-2 border-eb-900/20 hover:border-eb-900"
										}`}
										title={img.prompt}
									>
										<img
											src={img.dataUrl}
											className="w-full h-full object-cover"
											alt={img.prompt}
										/>
									</button>
								))}
							</div>
						</div>
					</div>

					<div className="col-span-12 md:col-span-8 min-h-0 overflow-hidden">
						<div className="bg-eb-50 border-y-4 border-eb-900 overflow-hidden h-full flex flex-col min-h-0">
							<div className="flex items-center justify-between gap-4 border-b-4 border-eb-900 p-5 bg-header">
								<div className="min-w-0">
									<div className="text-xs font-black text-eb-900/70 uppercase tracking-widest">
										{language === "en" ? "Selected" : "Ausgewählt"}
									</div>
									<div className="text-lg md:text-xl font-black tracking-tighter truncate">
										{selected?.prompt || (language === "en" ? "Image" : "Bild")}
									</div>
								</div>
								<button
									type="button"
									onClick={() =>
										selected &&
										editor.loadImageIntoEditor(
											selected.dataUrl,
											selected.prompt,
										)
									}
									disabled={!selected}
									className="bg-eb-900 text-eb-50 px-6 h-12 border-2 border-eb-900 text-xs font-black transition-all shadow-[4px_4px_0px_0px_rgba(254,68,65,0.35)] hover:shadow-none hover:bg-coral-500 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
								>
									<Wand2 className="w-4 h-4" /> {content.editThisImage}
								</button>
							</div>
							<div className="w-full bg-gray-100 flex-1 min-h-0">
								{selected && (
									<img
										src={selected.dataUrl}
										className="w-full h-full object-contain"
										alt={selected.prompt}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
