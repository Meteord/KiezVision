import { describe, expect, it } from "vitest";
import {
	URBAN_CATEGORIES,
	URBAN_PRESETS,
	buildUrbanPresetPrompt,
	type UrbanStrength,
} from "./urbanPresets.ts";

const levels: UrbanStrength[] = ["low", "medium", "high"];

describe("STEP 2040 design presets", () => {
	it("contains 22 distinct public-space concepts in six categories", () => {
		expect(URBAN_CATEGORIES).toHaveLength(6);
		expect(URBAN_PRESETS).toHaveLength(22);
		expect(new Set(URBAN_PRESETS.map((preset) => preset.id)).size).toBe(22);
		expect(new Set(URBAN_CATEGORIES.map((category) => category.id)).size).toBe(
			6,
		);
	});

	it("contains a valid category, bilingual labels and three distinct levels", () => {
		const knownCategories = new Set(
			URBAN_CATEGORIES.map((category) => category.id),
		);
		for (const preset of URBAN_PRESETS) {
			expect(knownCategories.has(preset.category)).toBe(true);
			expect(preset.title.de.trim()).not.toBe("");
			expect(preset.title.en.trim()).not.toBe("");
			expect(preset.description.de.trim()).not.toBe("");
			expect(preset.description.en.trim()).not.toBe("");
			expect(Object.keys(preset.levels).sort()).toEqual([...levels].sort());
			const variants = levels.map((level) => preset.levels[level].instruction);
			expect(new Set(variants).size).toBe(3);
			for (const level of levels) {
				expect(preset.levels[level].summary.de.trim()).not.toBe("");
				expect(preset.levels[level].summary.en.trim()).not.toBe("");
				expect(preset.levels[level].instruction.trim()).not.toBe("");
			}
		}
	});

	it("generates a specific, masked, camera-stable prompt for each intensity", () => {
		for (const preset of URBAN_PRESETS) {
			for (const level of levels) {
				const prompt = buildUrbanPresetPrompt(preset, level);
				expect(prompt).toContain(preset.basePrompt);
				expect(prompt).toContain(preset.levels[level].instruction);
				expect(prompt).toContain("editable region");
				expect(prompt).toContain("original viewpoint");
				expect(prompt).toContain("Do not block building entrances");
			}
		}
	});

	it("keeps the park bench options materially different", () => {
		const bench = URBAN_PRESETS.find((preset) => preset.id === "park-bench");
		expect(bench).toBeDefined();
		if (!bench) return;
		expect(bench.levels.low.instruction).toContain("exactly one");
		expect(bench.levels.medium.instruction).toContain("two or three");
		expect(bench.levels.high.instruction).toContain("seating cluster");
	});
});
