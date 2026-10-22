import React, { useState } from "react";
import { ChevronDown, History } from "lucide-react";
import type { ContentStrings } from "../../content.ts";
import type { GeneratedImage } from "../../types.ts";

export interface VersionHistoryProps {
	content: ContentStrings;
	history: GeneratedImage[];
	currentImage: string | null;
	onSelectVersion: (dataUrl: string) => void;
	onClearHistory: () => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
	content,
	history,
	currentImage,
	onSelectVersion,
	onClearHistory,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const historyId = "version-history";

	return (
		<div className="bg-white border-t-2 border-eb-900">
			<div className="flex items-center justify-between gap-4 p-4 md:px-6 md:py-4">
				<button
					type="button"
					onClick={() => setIsExpanded((expanded) => !expanded)}
					aria-expanded={isExpanded}
					aria-controls={historyId}
					className="flex items-center gap-2 text-xs font-black hover:text-coral-500 transition-colors"
				>
					<History className="w-4 h-4" aria-hidden="true" />
					{content.iterations} ({history.length})
					<ChevronDown
						className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
						aria-hidden="true"
					/>
				</button>
				<button
					type="button"
					onClick={onClearHistory}
					className="text-xs font-black text-red-600 hover:text-red-700 transition-all"
				>
					{content.clearHistory}
				</button>
			</div>
			{isExpanded && (
				<div
					id={historyId}
					className="flex gap-4 overflow-x-auto px-4 pb-4 md:px-6 custom-scrollbar"
				>
					{history.map((img, idx) => {
						const versionNumber = history.length - idx;
						const isCurrent = currentImage === img.dataUrl;
						const predecessorIndex = img.predecessorId
							? history.findIndex((image) => image.id === img.predecessorId)
							: -1;
						const predecessorVersion =
							predecessorIndex >= 0 ? history.length - predecessorIndex : null;
						return (
							<button
								key={img.id}
								type="button"
								onClick={() => onSelectVersion(img.dataUrl)}
								aria-current={isCurrent ? "true" : undefined}
								aria-label={`Version ${versionNumber}: ${img.prompt}`}
								className={`flex-shrink-0 relative w-40 border-2 transition-all text-left ${isCurrent ? "border-coral-500 ring-4 ring-coral-500/25 bg-eb-900" : "border-eb-900/10 grayscale hover:grayscale-0 hover:border-eb-900"}`}
							>
								<div className="aspect-[4/3] w-full bg-gray-100">
									<img
										src={img.dataUrl}
										className="w-full h-full object-cover"
										alt={`Version ${versionNumber}: ${img.prompt}`}
									/>
								</div>
								<div className="p-2 bg-header border-t-2 border-eb-900">
									<p className="text-xs font-black truncate leading-none text-eb-900">
										IDX_{versionNumber} • {img.prompt}
									</p>
									{img.model && (
										<div className="mt-2 space-y-1 text-[10px] font-bold leading-tight text-eb-900/75">
											<p className="truncate">
												{content.generationModel}: {img.model}
											</p>
											<p>
												{content.basedOn}:{" "}
												{predecessorVersion ? `#${predecessorVersion}` : "-"}
											</p>
										</div>
									)}
								</div>
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};
