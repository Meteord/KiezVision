import React, { type RefObject } from "react";
import type { ContentStrings } from "../../content.ts";
import type { Language } from "../../content.ts";
import type { EditMode, InpaintCanvasHandle } from "../../hooks/use-editor.ts";
import type {
	GeneratedImage,
	ProcessingState,
	ProjectPreset,
} from "../../types.ts";
import type { OpenAIImageModel } from "../../services/imageModels.ts";
import { BeforeAfterSlider } from "./before-after-slider.tsx";
import { EditorSourceOverlay } from "./editor-source-overlay.tsx";
import { InpaintCanvas } from "./inpaint-canvas.tsx";
import { UrbanPresetCatalog } from "./quick-actions/urban-preset-catalog.tsx";
import { TransformationPanel } from "./transformation-panel.tsx";
import { VersionHistory } from "./version-history.tsx";
import { ProcessingOverlay } from "../primitives/overlays/processing-overlay.tsx";

export interface EditorViewProps {
	language: Language;
	content: ContentStrings;
	originalImage: string;
	currentImage: string | null;
	history: GeneratedImage[];
	editMode: EditMode;
	processing: ProcessingState;
	brushSize: number;
	isAreaEditEraser: boolean;
	inpaintMountKey: number;
	imageSource: string | null;
	locationLabel: string;
	mapillaryMetadata: { link: string; capturedAt?: string } | null;
	canvasRef: RefObject<InpaintCanvasHandle | null>;
	onOverlayChange: (data: { mask?: string } | null) => void;
	onTransform: (prompt: string) => void | Promise<void>;
	onSelectVersion: (dataUrl: string) => void;
	onClearHistory: () => void;
	onReopenImageryPicker: () => void;
	presets?: ProjectPreset[];
	imageModel: OpenAIImageModel;
	onImageModelChange: (model: OpenAIImageModel) => void;
	onSetEditModeComparison: () => void;
	onSetEditModeMask: () => void;
	onSave: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
	language,
	content,
	originalImage,
	currentImage,
	history,
	editMode,
	processing,
	brushSize,
	isAreaEditEraser,
	inpaintMountKey,
	imageSource,
	locationLabel,
	mapillaryMetadata,
	canvasRef,
	onOverlayChange,
	onTransform,
	onSelectVersion,
	onClearHistory,
	onReopenImageryPicker,
	presets,
	imageModel,
	onImageModelChange,
	onSetEditModeComparison,
	onSetEditModeMask,
	onSave,
}) => (
	<div className="flex flex-col md:grid md:grid-cols-12 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] md:max-h-[calc(100vh-80px)] border-b-4 border-eb-900">
		<div className="order-1 md:order-none col-span-12 md:col-span-9 flex flex-col flex-1 min-h-0 w-full md:h-full md:max-h-full bg-header border-r-0 md:border-r-2 border-eb-900">
			<div className="relative flex-1 min-h-[min(42vh,320px)] md:min-h-0 bg-header overflow-hidden">
				{processing.isProcessing && (
					<ProcessingOverlay
						title=""
						statusMessage={processing.statusMessage}
						variant="inline"
					/>
				)}

				<div className="absolute inset-0 min-h-0 bg-header">
					{editMode !== "comparison" ? (
						<InpaintCanvas
							key={inpaintMountKey}
							ref={canvasRef}
							image={currentImage || originalImage}
							onOverlayChange={onOverlayChange}
							brushSize={brushSize}
							isEraser={isAreaEditEraser}
							ariaLabel={content.drawingCanvasLabel}
							ariaRoleDescription={content.drawingCanvasRoleDescription}
							imageDescription={locationLabel}
						/>
					) : (
						<BeforeAfterSlider
							originalImage={originalImage}
							modifiedImage={currentImage || originalImage}
							labelBefore={content.before}
							labelAfter={content.after}
							ariaLabelSlider={content.beforeAfterComparison}
						/>
					)}
				</div>

				{imageSource && !processing.isProcessing && (
					<EditorSourceOverlay
						content={content}
						imageSource={imageSource}
						locationLabel={locationLabel}
						mapillaryLink={mapillaryMetadata?.link}
						onChangeImagery={onReopenImageryPicker}
					/>
				)}
			</div>

			<VersionHistory
				content={content}
				history={history}
				currentImage={currentImage}
				onSelectVersion={onSelectVersion}
				onClearHistory={onClearHistory}
			/>
		</div>

		<div className="order-2 md:order-none col-span-12 md:col-span-3 w-full shrink-0 md:h-full md:min-h-0 bg-header flex flex-col p-4 sm:p-5 md:p-5 lg:p-6 overflow-y-auto custom-scrollbar border-t-2 md:border-t-0 border-eb-900">
			<TransformationPanel
				onTransform={onTransform}
				isProcessing={processing.isProcessing}
				placeholder={
					editMode === "mask"
						? content.placeholderMask
						: content.placeholderEditor
				}
				language={language}
				presets={presets}
				imageModel={imageModel}
				onImageModelChange={onImageModelChange}
				editMode={editMode}
				onSetEditModeComparison={onSetEditModeComparison}
				onSetEditModeMask={onSetEditModeMask}
				onSave={onSave}
				compareLabel={content.compare}
				areaEditLabel={content.areaEdit}
				saveLabel={content.save}
			/>
			<UrbanPresetCatalog
				onAction={onTransform}
				disabled={processing.isProcessing}
				language={language}
				isMaskMode={editMode === "mask"}
				hasSelection={canvasRef.current?.hasMaskPaint() ?? false}
			/>
		</div>
	</div>
);
