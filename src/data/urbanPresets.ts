/**
 * Public-space visualization ideas inspired by the strategic directions of
 * Munich's Stadtentwicklungsplan 2040 (STEP 2040).
 * These are KiezVision design concepts, not official City of Munich presets.
 * All text instructions are visualization-only, not engineering approval.
 * https://stadt.muenchen.de/infos/stadtentwicklungsplan-2040
 */

export type UrbanLanguage = "de" | "en";
export type UrbanStrength = "low" | "medium" | "high";
export type UrbanCategoryId =
	"stay" | "play" | "green" | "mobility" | "places" | "comfort";

export interface LocalizedUrbanText {
	de: string;
	en: string;
}

export interface UrbanCategory {
	id: UrbanCategoryId;
	title: LocalizedUrbanText;
	description: LocalizedUrbanText;
}

export interface UrbanStrengthLevel {
	/** Short, localized user-facing description of the effect. */
	summary: LocalizedUrbanText;
	/** Precise English instruction sent to the image generation model. */
	instruction: string;
}

export interface UrbanPreset {
	id: string;
	category: UrbanCategoryId;
	title: LocalizedUrbanText;
	description: LocalizedUrbanText;
	basePrompt: string;
	levels: Record<UrbanStrength, UrbanStrengthLevel>;
}

export const URBAN_CATEGORIES: readonly UrbanCategory[] = [
	{
		id: "stay",
		title: {
			de: "Aufenthalt & Begegnung",
			en: "Stay & meet",
		},
		description: {
			de: "Sitzen, verweilen und sich begegnen.",
			en: "Places to sit, linger and meet.",
		},
	},
	{
		id: "play",
		title: {
			de: "Spielen & Familien",
			en: "Play & families",
		},
		description: {
			de: "Spiel- und Aufenthaltsorte für alle Generationen.",
			en: "Play and everyday gathering spaces for families.",
		},
	},
	{
		id: "green",
		title: {
			de: "Grün & Klima",
			en: "Green & climate",
		},
		description: {
			de: "Begrünung, Schatten und weniger Versiegelung.",
			en: "Vegetation, shade and less hard surfacing.",
		},
	},
	{
		id: "mobility",
		title: {
			de: "Mobilität & Sicherheit",
			en: "Mobility & safety",
		},
		description: {
			de: "Mehr Raum für Fuß- und Radverkehr.",
			en: "More space for people walking and cycling.",
		},
	},
	{
		id: "places",
		title: {
			de: "Plätze & Stadträume",
			en: "Squares & public spaces",
		},
		description: {
			de: "Vorplätze, Treffpunkte und Quartiersmitten.",
			en: "Forecourts, meeting places and neighborhood centers.",
		},
	},
	{
		id: "comfort",
		title: {
			de: "Komfort & Versorgung",
			en: "Comfort & amenities",
		},
		description: {
			de: "Praktische Ausstattung und bessere Zugänglichkeit.",
			en: "Useful amenities and better accessibility.",
		},
	},
];

export const URBAN_PRESETS: readonly UrbanPreset[] = [
	{
		id: "park-bench",
		category: "stay",
		title: {
			de: "Parkbank",
			en: "Park bench",
		},
		description: {
			de: "Eine robuste Bank passend zur Umgebung.",
			en: "A durable bench that fits the streetscape.",
		},
		basePrompt:
			"Add weather-resistant urban public benches using realistic timber and/or metal materials, placed on stable accessible ground.",
		levels: {
			low: {
				summary: {
					de: "Eine Bank",
					en: "One bench",
				},
				instruction:
					"Add exactly one modest bench with clear pedestrian passage.",
			},
			medium: {
				summary: {
					de: "Zwei bis drei Bänke",
					en: "Two or three benches",
				},
				instruction:
					"Place two or three benches in a coordinated layout, only if they fit without blocking access.",
			},
			high: {
				summary: {
					de: "Kleine Sitzgruppe",
					en: "Small seating area",
				},
				instruction:
					"Create a coherent small seating cluster with several benches and low seating edges, only to the extent the selected footprint allows.",
			},
		},
	},
	{
		id: "seating-island",
		category: "stay",
		title: {
			de: "Sitzinsel",
			en: "Seating island",
		},
		description: {
			de: "Eine kleine Aufenthaltszone im Straßenraum.",
			en: "A small resting zone in public space.",
		},
		basePrompt:
			"Create a welcoming urban seating island with seating edges and carefully arranged elements.",
		levels: {
			low: {
				summary: {
					de: "Eine Sitznische",
					en: "One seating nook",
				},
				instruction:
					"Add one discreet seating nook against the edge of the selected space.",
			},
			medium: {
				summary: {
					de: "Kompakte Sitzinsel",
					en: "Compact seating island",
				},
				instruction:
					"Arrange two complementary seating elements into one compact and legible sitting area.",
			},
			high: {
				summary: {
					de: "Vielfältige Sitzzone",
					en: "Varied seating zone",
				},
				instruction:
					"Build a varied cluster of integrated seats, low walls and informal perches, while keeping routes clear.",
			},
		},
	},
	{
		id: "place-to-linger",
		category: "stay",
		title: {
			de: "Platz zum Verweilen",
			en: "Place to linger",
		},
		description: {
			de: "Aus Durchgangsfläche wird ein angenehmer Aufenthaltsort.",
			en: "Turn a pass-through area into a pleasant place to stay.",
		},
		basePrompt:
			"Make the selected space more inviting and comfortable for a short rest, using urban furniture and appropriate ground treatment.",
		levels: {
			low: {
				summary: {
					de: "Kleine Aufwertung",
					en: "Small improvement",
				},
				instruction:
					"Add one small resting element and tidy only the immediate paving.",
			},
			medium: {
				summary: {
					de: "Sitzgelegenheiten und Grün",
					en: "Seats and greenery",
				},
				instruction:
					"Add a modest seating element and one or two contained planters.",
			},
			high: {
				summary: {
					de: "Zusammenhängender Aufenthaltsort",
					en: "Integrated resting space",
				},
				instruction:
					"Create a cohesive resting zone with varied seating, planted elements and coordinated paving.",
			},
		},
	},
	{
		id: "neighborhood-meeting",
		category: "stay",
		title: {
			de: "Nachbarschaftstreff",
			en: "Neighborhood meeting spot",
		},
		description: {
			de: "Ein offener Ort für kurze Gespräche.",
			en: "An open spot for casual encounters.",
		},
		basePrompt:
			"Visualize a low-key public meeting point suitable for neighbors to sit and chat, with no private barriers.",
		levels: {
			low: {
				summary: {
					de: "Zwei Gesprächsplätze",
					en: "Two places to chat",
				},
				instruction:
					"Introduce two facing or slightly angled seating positions.",
			},
			medium: {
				summary: {
					de: "Treffpunkt mit Sitzgruppe",
					en: "Gathering point with seats",
				},
				instruction:
					"Arrange an approachable small group of seats with a little greenery.",
			},
			high: {
				summary: {
					de: "Offene Begegnungszone",
					en: "Open gathering zone",
				},
				instruction:
					"Form a clear accessible gathering zone with varied seating and natural elements that do not crowd the area.",
			},
		},
	},
	{
		id: "playground",
		category: "play",
		title: {
			de: "Spielplatz",
			en: "Playground",
		},
		description: {
			de: "Schaukeln, klettern und rutschen auf passender Fläche.",
			en: "Age-appropriate climbing, swings and slides.",
		},
		basePrompt:
			"Create a realistic, age-appropriate public playground with plausible play equipment and visible protective play surfacing where required.",
		levels: {
			low: {
				summary: {
					de: "Ein Spielgerät",
					en: "One play element",
				},
				instruction:
					"Add one compact play element with appropriately sized protective surfacing and clearance.",
			},
			medium: {
				summary: {
					de: "Kleiner Spielplatz",
					en: "Small playground",
				},
				instruction:
					"Combine two or three play elements such as a short slide, small climbing frame or balance element, with suitable safety zones.",
			},
			high: {
				summary: {
					de: "Mehrere Spielzonen",
					en: "Several play zones",
				},
				instruction:
					"Create distinct small-scale play zones with varied equipment, protective ground treatments and space between items, only where the marked area is large enough.",
			},
		},
	},
	{
		id: "micro-play",
		category: "play",
		title: {
			de: "Mini-Spielpunkt",
			en: "Pocket play spot",
		},
		description: {
			de: "Ein kompakter Spielanreiz für Restflächen.",
			en: "A compact play feature for leftover space.",
		},
		basePrompt:
			"Integrate low-footprint public play or movement elements into a small urban leftover space.",
		levels: {
			low: {
				summary: {
					de: "Ein Balancierelement",
					en: "One balancing element",
				},
				instruction:
					"Add one modest balancing or stepping element with safe clearance.",
			},
			medium: {
				summary: {
					de: "Zwei Spielelemente",
					en: "Two play elements",
				},
				instruction:
					"Combine two compact elements such as stepping posts and a low balancing beam, without blocking pedestrian movement.",
			},
			high: {
				summary: {
					de: "Kleine Bewegungsinsel",
					en: "Small activity island",
				},
				instruction:
					"Create a tightly arranged but uncluttered group of compact play and movement elements with suitable ground treatment.",
			},
		},
	},
	{
		id: "family-forecourt",
		category: "play",
		title: {
			de: "Familienfreundlicher Vorplatz",
			en: "Family-friendly forecourt",
		},
		description: {
			de: "Sitzen, warten und kurz spielen.",
			en: "Places to sit, wait and play briefly.",
		},
		basePrompt:
			"Improve the selected public forecourt for families with practical waiting and resting amenities.",
		levels: {
			low: {
				summary: {
					de: "Sitzgelegenheit",
					en: "Seating",
				},
				instruction:
					"Introduce one bench and leave doors, sightlines and access unobstructed.",
			},
			medium: {
				summary: {
					de: "Sitzen und Spielen",
					en: "Seats and playful detail",
				},
				instruction:
					"Introduce comfortable seating and one modest child-friendly play detail.",
			},
			high: {
				summary: {
					de: "Familienfreundlicher Aufenthaltsort",
					en: "Family-friendly resting area",
				},
				instruction:
					"Arrange several seating choices, shaded or planted accents and small play details into a coherent accessible forecourt.",
			},
		},
	},
	{
		id: "add-greenery",
		category: "green",
		title: {
			de: "Begrünung",
			en: "Add greenery",
		},
		description: {
			de: "Stauden, Pflanzkübel oder Beete.",
			en: "Planting beds, perennials or planters.",
		},
		basePrompt:
			"Introduce climate-suitable, realistic urban planting with species and planting-bed dimensions appropriate to the visible location.",
		levels: {
			low: {
				summary: {
					de: "Einzelne Pflanzinseln",
					en: "A few planting patches",
				},
				instruction:
					"Add one or two modest planters or small perennial planting islands.",
			},
			medium: {
				summary: {
					de: "Mehrere Beete",
					en: "Several planted beds",
				},
				instruction:
					"Form a connected pattern of multiple planting beds or planters without cutting off existing routes.",
			},
			high: {
				summary: {
					de: "Grün geprägter Bereich",
					en: "Green-dominant area",
				},
				instruction:
					"Transform much of the permitted space into lush but maintainable mixed urban planting with legible paths.",
			},
		},
	},
	{
		id: "street-trees",
		category: "green",
		title: {
			de: "Straßenbäume",
			en: "Street trees",
		},
		description: {
			de: "Mehr Baumschatten im Straßenraum.",
			en: "More tree canopy and shade.",
		},
		basePrompt:
			"Add realistic urban street trees with plausible trunks, canopies, planting pits and shadows aligned to the original light.",
		levels: {
			low: {
				summary: {
					de: "Ein Baum",
					en: "One tree",
				},
				instruction:
					"Place one tree with a realistic planting pit, only if the entire visible trunk and canopy fit inside the marked region.",
			},
			medium: {
				summary: {
					de: "Zwei bis drei Bäume",
					en: "Two or three trees",
				},
				instruction:
					"Add two or three coherently spaced street trees, only where their full canopies fit in the editable area.",
			},
			high: {
				summary: {
					de: "Baumgeprägter Straßenraum",
					en: "Tree-lined space",
				},
				instruction:
					"Suggest a tree-lined character with as many appropriately spaced trees as can fit fully in the designated space without blocking access.",
			},
		},
	},
	{
		id: "pocket-park",
		category: "green",
		title: {
			de: "Pocket Park",
			en: "Pocket park",
		},
		description: {
			de: "Eine kleine grüne Oase mit Aufenthalt.",
			en: "A small pocket of urban green with seating.",
		},
		basePrompt:
			"Convert the marked area into a compact urban pocket park with planted ground, a readable path and optional simple seating.",
		levels: {
			low: {
				summary: {
					de: "Grüne Ecke",
					en: "Green corner",
				},
				instruction:
					"Add a small planted corner with a restrained seat or edge.",
			},
			medium: {
				summary: {
					de: "Kleiner Mikropark",
					en: "Small pocket park",
				},
				instruction:
					"Balance planting, a clear walking route and one or two places to sit.",
			},
			high: {
				summary: {
					de: "Grüner Quartiersort",
					en: "Green neighborhood nook",
				},
				instruction:
					"Create a cohesive lush pocket park with layered planting, comfortable seating and a clear accessible route.",
			},
		},
	},
	{
		id: "de-sealing",
		category: "green",
		title: {
			de: "Entsiegelung",
			en: "De-paving",
		},
		description: {
			de: "Versiegelten Boden durch Grün oder durchlässige Beläge ersetzen.",
			en: "Replace impermeable surfacing with planting or permeable paving.",
		},
		basePrompt:
			"Visually replace selected impermeable surface with plausible permeable materials and planting, while retaining necessary walking and access routes.",
		levels: {
			low: {
				summary: {
					de: "Kleine Teilflächen",
					en: "Small patches",
				},
				instruction:
					"Open a few limited planting pockets within the chosen hard surface.",
			},
			medium: {
				summary: {
					de: "Teils entsiegelt",
					en: "Partly de-paved",
				},
				instruction:
					"Replace a noticeable share of the selected surface with a blend of permeable paving and planted strips.",
			},
			high: {
				summary: {
					de: "Überwiegend entsiegelt",
					en: "Mostly de-paved",
				},
				instruction:
					"Convert most of the suitable marked hard surface to permeable materials and planting, retaining continuous safe access paths.",
			},
		},
	},
	{
		id: "shade",
		category: "green",
		title: {
			de: "Schattiger Aufenthaltsort",
			en: "Shaded resting spot",
		},
		description: {
			de: "Aufenthaltsbereiche wirksam verschatten.",
			en: "Make a place to rest more shaded.",
		},
		basePrompt:
			"Create a plausible shaded public sitting spot using vegetation or lightweight shading features that fit the scene.",
		levels: {
			low: {
				summary: {
					de: "Kleines Schattendach",
					en: "Small shaded patch",
				},
				instruction:
					"Provide one shade-giving element over a compact resting point.",
			},
			medium: {
				summary: {
					de: "Schatten und Sitzbank",
					en: "Shade with seating",
				},
				instruction:
					"Combine a shaded bench area with an additional planting element where spatially feasible.",
			},
			high: {
				summary: {
					de: "Gut verschatteter Bereich",
					en: "Substantially shaded area",
				},
				instruction:
					"Organize the available space as a visibly shaded resting zone with coordinated planting, seating and coherent sunlight/shadow.",
			},
		},
	},
	{
		id: "bike-parking",
		category: "mobility",
		title: {
			de: "Fahrradstellplätze",
			en: "Bicycle parking",
		},
		description: {
			de: "Geordnete Fahrradbügel ergänzen.",
			en: "Add tidy public bicycle stands.",
		},
		basePrompt:
			"Install realistic anchored public bicycle stands at ground level, with credible spacing and unobstructed pedestrian paths.",
		levels: {
			low: {
				summary: {
					de: "Zwei Fahrradbügel",
					en: "Two bicycle stands",
				},
				instruction: "Add two modest bicycle stands at a suitable edge.",
			},
			medium: {
				summary: {
					de: "Kleine Abstellanlage",
					en: "Small bicycle parking area",
				},
				instruction:
					"Add a compact line of several cycle stands, neatly aligned with the paving.",
			},
			high: {
				summary: {
					de: "Mehr Abstellmöglichkeiten",
					en: "Expanded bicycle parking",
				},
				instruction:
					"Lay out a larger but plausible bicycle parking cluster, only if the selected space provides enough maneuvering clearance.",
			},
		},
	},
	{
		id: "sidewalk-space",
		category: "mobility",
		title: {
			de: "Breiterer Gehweg",
			en: "Wider sidewalk",
		},
		description: {
			de: "Mehr Platz für Menschen zu Fuß.",
			en: "More room for walking.",
		},
		basePrompt:
			"Reallocate the selected ground surface toward a wider, continuous, unobstructed walking zone without changing building alignment.",
		levels: {
			low: {
				summary: {
					de: "Engstelle entschärfen",
					en: "Ease one pinch point",
				},
				instruction:
					"Remove or reorganize a minor obstacle and visually widen one narrow walking segment.",
			},
			medium: {
				summary: {
					de: "Gehweg verbreitern",
					en: "Widen the sidewalk",
				},
				instruction:
					"Widen the walking zone within the selected roadway or verge, with a plausible curb edge.",
			},
			high: {
				summary: {
					de: "Fußgängerorientierter Raum",
					en: "Pedestrian-oriented space",
				},
				instruction:
					"Dedicate most of the suitable selected area to a generous coherent walking zone with consistent accessible surfaces.",
			},
		},
	},
	{
		id: "traffic-calming",
		category: "mobility",
		title: {
			de: "Verkehrsberuhigung",
			en: "Traffic calming",
		},
		description: {
			de: "Ruhigerer Straßencharakter mit mehr Aufenthaltsqualität.",
			en: "A calmer street with more space for people.",
		},
		basePrompt:
			"Visualize a calm and legible streetscape through plausible surface organization, planted elements and slower-speed design cues.",
		levels: {
			low: {
				summary: {
					de: "Dezente Aufwertung",
					en: "Subtle calming",
				},
				instruction:
					"Add modest edge planting or spatial cues without changing the overall street layout.",
			},
			medium: {
				summary: {
					de: "Ruhigere Straßenfläche",
					en: "Calmer street section",
				},
				instruction:
					"Suggest narrowed vehicle-dominant visual space and a more pedestrian-friendly ground treatment in the marked area.",
			},
			high: {
				summary: {
					de: "Stark beruhigter Abschnitt",
					en: "Strongly traffic-calmed segment",
				},
				instruction:
					"Visualize a coherent low-speed streetscape with generous pedestrian space and integrated planting, avoiding unsupported regulatory signs or markings.",
			},
		},
	},
	{
		id: "crossing",
		category: "mobility",
		title: {
			de: "Sichere Querung",
			en: "Safer pedestrian crossing",
		},
		description: {
			de: "Querungssituation übersichtlicher gestalten.",
			en: "Make crossing points easier to understand.",
		},
		basePrompt:
			"Visualize a clear pedestrian crossing environment with realistic geometry, visible sightlines, and uninterrupted accessible footpaths.",
		levels: {
			low: {
				summary: {
					de: "Querung deutlicher",
					en: "Clearer crossing",
				},
				instruction:
					"Improve contrast and legibility of one small crossing approach using surface detailing.",
			},
			medium: {
				summary: {
					de: "Querungsstelle aufwerten",
					en: "Improve crossing zone",
				},
				instruction:
					"Show a better organized crossing area with clear approaches and plausible curb design, without inventing official road markings.",
			},
			high: {
				summary: {
					de: "Fußgängerfreundliche Querung",
					en: "Pedestrian-priority crossing",
				},
				instruction:
					"Create a coherent pedestrian-priority crossing concept across the suitable marked section, leaving road markings and legal status subject to separate planning.",
			},
		},
	},
	{
		id: "upgrade-square",
		category: "places",
		title: {
			de: "Platz aufwerten",
			en: "Refresh a square",
		},
		description: {
			de: "Einladende Platzgestaltung mit Grün und Sitzen.",
			en: "An inviting square with planting and seating.",
		},
		basePrompt:
			"Revitalize the selected urban square surface with coordinated paving, simple seating and climate-appropriate greenery.",
		levels: {
			low: {
				summary: {
					de: "Kleine Verbesserungen",
					en: "Small upgrades",
				},
				instruction:
					"Improve a small corner through one seating or planting intervention.",
			},
			medium: {
				summary: {
					de: "Neue Platzmöblierung",
					en: "New square furniture",
				},
				instruction:
					"Coordinate a few seats and planters with an upgraded ground treatment.",
			},
			high: {
				summary: {
					de: "Einladender Quartiersplatz",
					en: "Inviting neighborhood square",
				},
				instruction:
					"Redesign much of the selected space as an integrated public square with coherent materials, informal seating and planted areas.",
			},
		},
	},
	{
		id: "activate-forecourt",
		category: "places",
		title: {
			de: "Vorplatz aktivieren",
			en: "Activate a forecourt",
		},
		description: {
			de: "Eingangsnahe Freiräume besser nutzen.",
			en: "Make entrance-adjacent space more useful.",
		},
		basePrompt:
			"Activate an existing urban forecourt while preserving entrances, doorstep clearance, deliveries, and accessible paths.",
		levels: {
			low: {
				summary: {
					de: "Einladender Eingang",
					en: "Welcoming entrance",
				},
				instruction:
					"Add one small improvement such as a seating or planted element set back from entrances.",
			},
			medium: {
				summary: {
					de: "Freundlicher Vorplatz",
					en: "More inviting forecourt",
				},
				instruction:
					"Arrange light seating and landscaping along the margins, keeping the entrance zone open.",
			},
			high: {
				summary: {
					de: "Lebendiger Vorplatz",
					en: "Lively forecourt",
				},
				instruction:
					"Make a coherent, inviting public forecourt with comfortable edges, seating and greenery while leaving important access lines free.",
			},
		},
	},
	{
		id: "market-place",
		category: "places",
		title: {
			de: "Markt- und Begegnungsplatz",
			en: "Market and gathering square",
		},
		description: {
			de: "Flexibel nutzbarer Platz für Begegnungen.",
			en: "A flexible square for everyday gatherings.",
		},
		basePrompt:
			"Visualize a flexible multifunctional neighborhood square with generous open ground and movable or unobtrusive infrastructure.",
		levels: {
			low: {
				summary: {
					de: "Offene Platzfläche",
					en: "Open square",
				},
				instruction:
					"Organize a clean, uncluttered open area for temporary uses.",
			},
			medium: {
				summary: {
					de: "Flexibler Treffpunkt",
					en: "Flexible gathering area",
				},
				instruction:
					"Add modest seating at the edges while preserving a central flexible open area.",
			},
			high: {
				summary: {
					de: "Vielseitiger Quartiersplatz",
					en: "Multifunctional square",
				},
				instruction:
					"Shape a versatile public square with seating, shade, high-quality paving and a usable open area for occasional small gatherings.",
			},
		},
	},
	{
		id: "drinking-fountain",
		category: "comfort",
		title: {
			de: "Trinkbrunnen",
			en: "Drinking fountain",
		},
		description: {
			de: "Öffentlicher Trinkbrunnen als praktische Ergänzung.",
			en: "A useful public drinking fountain.",
		},
		basePrompt:
			"Add a small realistic accessible public drinking water fountain with practical drainage and a plausible connection to the paved ground.",
		levels: {
			low: {
				summary: {
					de: "Ein Trinkbrunnen",
					en: "One fountain",
				},
				instruction:
					"Add exactly one small drinking fountain and leave a clear accessible approach.",
			},
			medium: {
				summary: {
					de: "Brunnen und Sitzmöglichkeit",
					en: "Fountain with seating",
				},
				instruction:
					"Combine the drinking fountain with a modest nearby resting element, if space allows.",
			},
			high: {
				summary: {
					de: "Kleine Trink- und Aufenthaltszone",
					en: "Small refreshment area",
				},
				instruction:
					"Integrate the fountain into a compact, landscaped resting area with seating, where the selected area is large enough.",
			},
		},
	},
	{
		id: "lighting",
		category: "comfort",
		title: {
			de: "Beleuchtung verbessern",
			en: "Improve lighting",
		},
		description: {
			de: "Dezente städtische Beleuchtung ergänzen.",
			en: "Add subtle public lighting.",
		},
		basePrompt:
			"Introduce realistic, understated modern public lighting fixtures at coherent scale and orientation, matching the existing time of day.",
		levels: {
			low: {
				summary: {
					de: "Eine Leuchte",
					en: "One lamp",
				},
				instruction:
					"Add one well-positioned modest light fixture without changing daylight conditions.",
			},
			medium: {
				summary: {
					de: "Mehrere Leuchten",
					en: "Several fixtures",
				},
				instruction:
					"Add a small coordinated set of light fixtures in the marked area, without excessive brightness.",
			},
			high: {
				summary: {
					de: "Einheitliches Lichtkonzept",
					en: "Coordinated light scheme",
				},
				instruction:
					"Create a coherent set of appropriately placed modern lighting fixtures and subtle, physically plausible light effects.",
			},
		},
	},
	{
		id: "accessibility",
		category: "comfort",
		title: {
			de: "Barriereärmer gestalten",
			en: "Improve accessibility",
		},
		description: {
			de: "Stolperstellen und Hindernisse reduzieren.",
			en: "Reduce obstacles and improve access.",
		},
		basePrompt:
			"Visually improve accessibility of the selected public area with continuous, obstacle-free routes, plausible level changes and suitable surface textures.",
		levels: {
			low: {
				summary: {
					de: "Ein Hindernis beseitigen",
					en: "Remove one obstacle",
				},
				instruction:
					"Resolve one obvious minor obstruction along an existing passage.",
			},
			medium: {
				summary: {
					de: "Durchgehender Weg",
					en: "Continuous accessible path",
				},
				instruction:
					"Create a clear continuous walking route with plausible low curb transitions in the marked area.",
			},
			high: {
				summary: {
					de: "Umfassend barrierefreundlich",
					en: "More accessible layout",
				},
				instruction:
					"Reorganize most of the selected usable surface into a legible, step-free and less cluttered public-space layout, without altering protected building entrances.",
			},
		},
	},
];

/**
 * An explicit, conservative generation prompt. The mask itself is enforced by
 * the existing area-edit pipeline; this text is NOT a security boundary.
 */
export function buildUrbanPresetPrompt(
	preset: UrbanPreset,
	strength: UrbanStrength,
): string {
	return [
		`Create a realistic photographic urban-design visualization. Modify only the user-confirmed editable region; preserve every pixel outside the region, the original viewpoint, geometry, perspective, lighting and overall photo style. Maintain surrounding building facades, doors, windows, building footprints, road alignment and unselected objects.`,
		preset.basePrompt,
		preset.levels[strength].instruction,
		`This is a proposed visual concept, not a claim of legal, technical or traffic-planning feasibility. Fit all objects entirely inside the editable mask (including canopies, play-equipment extents and shadows); omit any object that cannot fit. Do not block building entrances, accessibility routes or fire access. Do not add unrelated elements, labels, logos, fictitious signs or written text. Keep materials, contact shadows and scale photorealistic.`,
	].join("\n\n");
}
