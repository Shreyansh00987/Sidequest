import type { QuestPack } from '../types';

export const QUEST_PACKS: QuestPack[] = [
  {
    id: 'backyard-explorer',
    title: 'Backyard & Garden Explorer',
    subtitle: 'Micro-adventures right outside your doorstep',
    environment: 'garden',
    recommendedAge: '5-7',
    estimatedMinutes: 20,
    description: 'Designed for younger explorers discovering everyday textures, colors, and organisms in a garden or yard.',
    safetySummary: 'Stay within eyesight of your adult. Touch plants gently with two fingers; never pick living flowers unless permitted.',
    clues: [
      {
        id: 'bg-1-bark',
        order: 1,
        prompt: 'Find something rough that has stood here longer than you.',
        hint: 'Look for tall living giants with wooden coats.',
        targetDescriptions: [
          'rough tree bark on a tree trunk',
          'textured wooden bark of a living tree',
          'a close up photo of tree bark outdoors',
          'weathered rough tree bark'
        ],
        distractorDescriptions: [
          'a human face or portrait',
          'a person wearing clothes',
          'a shoe or sneaker',
          'indoor furniture or room',
          'smooth concrete pavement',
          'a car or vehicle',
          'indoor toy or plastic item'
        ],
        safetyTip: 'Watch out for low hanging branches.',
        fieldNote: 'Tree bark is like a tree’s skin! It protects the tree from cold weather, insects, and hungry animals.'
      },
      {
        id: 'bg-2-veins',
        order: 2,
        prompt: 'Find a green leaf with visible lines running through it like tiny rivers.',
        hint: 'Turn a leaf gently toward the sun to see its water highways.',
        targetDescriptions: [
          'a green leaf showing veins up close',
          'leaf venation pattern on a green plant leaf',
          'a vibrant green leaf with visible rib structure',
          'close up photograph of a fresh green plant leaf'
        ],
        distractorDescriptions: [
          'dry dead brown leaf on the ground',
          'tree bark or wood',
          'concrete or asphalt',
          'a human hand without a leaf',
          'shoes or grass lawn with no single leaf',
          'sky or building'
        ],
        safetyTip: 'Gently hold the leaf without tearing it from the plant.',
        fieldNote: 'Those tiny lines are veins called xylem and phloem. They deliver water up from the roots and sugar down from the sun!'
      },
      {
        id: 'bg-3-pebble',
        order: 3,
        prompt: 'Find a smooth pebble rounded by wind or water.',
        hint: 'Look near flower beds, gravel paths, or under garden borders.',
        targetDescriptions: [
          'a smooth stone or pebble held in hand or on the ground',
          'a rounded river pebble or smooth rock outdoors',
          'a natural smooth stone on soil or gravel',
          'close up of a single rounded garden rock'
        ],
        distractorDescriptions: [
          'a piece of trash or plastic wrapper',
          'sharp jagged broken concrete',
          'a wooden stick or twig',
          'grass lawn or green leaves',
          'a human shoe'
        ],
        safetyTip: 'Leave stones on the ground where you found them after photographing.',
        fieldNote: 'Smooth stones often spent centuries tumbling in rivers or ancient streams before ending up in our soil.'
      },
      {
        id: 'bg-4-moss',
        order: 4,
        prompt: 'Find a patch of soft, damp green moss growing like a tiny forest.',
        hint: 'Look at the shady side of rocks, brick walls, or tree bases.',
        targetDescriptions: [
          'green moss growing on a tree trunk or stone',
          'a lush patch of damp bryophyte moss outdoors',
          'close up photo of velvety green moss on rock or bark',
          'cushion of wild green moss in shaded area'
        ],
        distractorDescriptions: [
          'regular tall grass lawn',
          'a potted indoor houseplant',
          'dry dirt or bare soil',
          'smooth painted wood',
          'a plastic artificial green turf'
        ],
        safetyTip: 'Moss can be slippery on damp steps; walk carefully.',
        fieldNote: 'Moss does not have true roots! It drinks moisture directly out of the air and mist around it like a sponge.'
      },
      {
        id: 'bg-5-petal',
        order: 5,
        prompt: 'Find a colorful flower petal that has fallen to the earth.',
        hint: 'Look under bushes, flower pots, or along the grass edges.',
        targetDescriptions: [
          'a colorful flower petal lying on the ground or soil',
          'a fallen flower blossom on grass or earth',
          'a vibrant flower petal in an outdoor garden',
          'a single petal from a blooming flower'
        ],
        distractorDescriptions: [
          'a colorful piece of plastic or litter',
          'a green leaf with no petals',
          'plain soil or dirt',
          'a building wall or fence',
          'a toy'
        ],
        safetyTip: 'Never put petals or berries into your mouth.',
        fieldNote: 'Fallen petals break down and return nutrients to the soil, helping next season’s flowers grow!'
      }
    ]
  },
  {
    id: 'neighborhood-trail',
    title: 'Neighborhood Walk & Park Trail',
    subtitle: 'Spotting nature reclaiming urban spaces',
    environment: 'park',
    recommendedAge: '8-10',
    estimatedMinutes: 25,
    description: 'Explore the borderlands between human structures and nature: sidewalk cracks, park edges, and hardy urban wildlife.',
    safetySummary: 'Always cross streets holding your adult’s hand. Stay on sidewalks and designated park pathways.',
    clues: [
      {
        id: 'np-1-crack-plant',
        order: 1,
        prompt: 'Find a stubborn plant growing out of a crack in concrete or brick.',
        hint: 'Look at pavement edges, curb gutters, or old stone stairs.',
        targetDescriptions: [
          'a small wild plant or weed growing through a sidewalk crack',
          'green plant sprouting between concrete slabs or brick paving',
          'a dandelion or clover emerging from asphalt or pavement',
          'resilient green vegetation growing in an urban sidewalk gap'
        ],
        distractorDescriptions: [
          'a potted plant on a porch',
          'a clean manicured garden bed',
          'plain empty concrete sidewalk with no plants',
          'a parked bicycle or car',
          'a sewer drain with no vegetation'
        ],
        safetyTip: 'Watch for passing bicycles or scooters when inspecting curbs.',
        fieldNote: 'Pioneer plants have root systems strong enough to break through asphalt, creating micro-habitats for tiny beetles.'
      },
      {
        id: 'np-2-pinecone-twig',
        order: 2,
        prompt: 'Find a fallen pinecone or an interesting Y-shaped twig.',
        hint: 'Search beneath coniferous trees or along the base of mature hedges.',
        targetDescriptions: [
          'a natural pinecone lying on the ground or forest floor',
          'a forked wooden twig shaped like a Y on grass or earth',
          'a fallen conifer cone or weathered tree branch',
          'close up photograph of a pinecone on the earth'
        ],
        distractorDescriptions: [
          'a piece of milled lumber or fence plank',
          'a discarded plastic straw or cigarette butt',
          'a dog toy or tennis ball',
          'a flat smooth stone',
          'plain grass with nothing on it'
        ],
        safetyTip: 'Mind sharp stick ends; keep sticks pointed toward the ground.',
        fieldNote: 'Pinecone scales close tight when the air is humid to protect their seeds, and pop open in dry weather so the wind can carry them!'
      },
      {
        id: 'np-3-shadow',
        order: 3,
        prompt: 'Find a sharp silhouette or shadow cast by a tree branch onto the ground.',
        hint: 'Stand with the sun behind you and look at sunlit grass or paths.',
        targetDescriptions: [
          'the dark shadow of tree branches cast on the ground or grass',
          'silhouetted shadow pattern of leaves on sunny pavement',
          'distinct tree branch shadow across outdoor terrain',
          'high contrast outdoor shadow of foliage'
        ],
        distractorDescriptions: [
          'a blurry uniform indoor shadow',
          'a human shadow without branches',
          'pitch black darkness at night',
          'a solid painted black line on the road'
        ],
        safetyTip: 'Never look directly at the sun while hunting for shadows.',
        fieldNote: 'Shadows change length all day as our Earth spins! Long shadows mean the sun is lower in the morning or late afternoon.'
      },
      {
        id: 'np-4-clover',
        order: 4,
        prompt: 'Find a patch of clover or a bright yellow dandelion bloom.',
        hint: 'Check open sunny lawns, park margins, or roadside verges.',
        targetDescriptions: [
          'a bright yellow dandelion flower head blooming outdoors',
          'a patch of trifoliate green clover leaves in lawn grass',
          'yellow taraxacum dandelion bloom on grass',
          'wild clover cluster in a meadow or park lawn'
        ],
        distractorDescriptions: [
          'plain uniform turf grass with no weeds or flowers',
          'a yellow plastic toy or wrapper',
          'a yellow fire hydrant or street sign',
          'a yellow car or vehicle',
          'bare brown mud'
        ],
        safetyTip: 'Watch for busy honeybees sipping nectar from blooms.',
        fieldNote: 'Dandelion roots can dig ten feet deep, bringing minerals up to the surface that enrich the surrounding soil.'
      },
      {
        id: 'np-5-creature-home',
        order: 5,
        prompt: 'Find a sign of a small outdoor creature’s home or handiwork.',
        hint: 'Look for a spider web in a hedge, an anthill in the path, or a bird nest in high branches.',
        targetDescriptions: [
          'a delicate spiderweb spun between outdoor plants or branches',
          'an anthill made of loose soil or sand grains on the ground',
          'a natural bird nest tucked into tree branches',
          'an insect burrow or wild animal home in nature'
        ],
        distractorDescriptions: [
          'a human house, building, or front door',
          'a dog crate or pet plastic carrier',
          'a garden shed or tool box',
          'a car or garage'
        ],
        safetyTip: 'Never touch nests, webs, or insect mounds. Observe with eyes and camera only.',
        fieldNote: 'Spider silk is ounce-for-ounce stronger than high-grade steel, yet so flexible it stretches without snapping!'
      }
    ]
  },
  {
    id: 'forest-trek',
    title: 'Forest & Woodland Trek',
    subtitle: 'Deep canopy biodiversity investigation',
    environment: 'forest',
    recommendedAge: 'all',
    estimatedMinutes: 30,
    description: 'An immersive walk through woods or dense nature reserves discovering ancient cycles of decomposition and rebirth.',
    safetySummary: 'Stay on the marked trail. Strictly observe "Look, Don’t Touch" for any mushrooms, berries, or unknown plants.',
    clues: [
      {
        id: 'ft-1-fallen-log',
        order: 1,
        prompt: 'Find a decaying fallen tree log returning to the forest floor.',
        hint: 'Look along the trail sides for ancient trunks covered in wood rot and greenery.',
        targetDescriptions: [
          'a rotting fallen tree log lying on the forest floor',
          'a decaying nurse log covered in moss and fungi in woods',
          'a fallen timber trunk decomposing in outdoor woodland',
          'weathered hollow log on soil with forest leaf litter'
        ],
        distractorDescriptions: [
          'a processed cut lumber bench or wooden fence',
          'a living upright healthy tree trunk',
          'a paved asphalt forest trail with no wood',
          'a telephone pole or utility post'
        ],
        safetyTip: 'Do not climb on decaying logs; they can roll or collapse.',
        fieldNote: 'Fallen logs are called "nurse logs"—they become hotels and cafeterias for salamanders, beetles, and seedling trees!'
      },
      {
        id: 'ft-2-fungus',
        order: 2,
        prompt: 'Find a wild mushroom or bracket fungus growing on dead wood.',
        hint: 'Inspect tree stumps and fallen bark. Remember: eyes and camera only!',
        targetDescriptions: [
          'a wild mushroom or toadstool growing from forest soil',
          'a shelf bracket fungus protruding from tree trunk or log',
          'wild fungal fruiting body in woodland habitat',
          'close up photograph of a natural outdoor mushroom'
        ],
        distractorDescriptions: [
          'a grocery store button mushroom on a plate',
          'a human shoe or discarded plastic cup',
          'a round river pebble or rock',
          'a fallen dry brown leaf'
        ],
        safetyTip: 'STRICT RULE: Never touch or eat any wild fungus. AI models cannot verify mushroom safety!',
        fieldNote: 'The mushroom you see is just the flower of a massive hidden underground network called mycelium that links entire forests!'
      },
      {
        id: 'ft-3-fern',
        order: 3,
        prompt: 'Find a feathery green fern or creeping ivy frond.',
        hint: 'Look in humid, damp, shaded hollows beneath the tallest canopy.',
        targetDescriptions: [
          'a wild green fern frond with feathery divided leaves',
          'lush forest fern plants growing in shade',
          'close up photo of fern foliage in woodland',
          'creeping wild ivy or pteridophyte leaves'
        ],
        distractorDescriptions: [
          'a cactus or desert succulent',
          'a plastic decorative faux plant',
          'ordinary grass blades or bare dirt',
          'a bare leafless stick'
        ],
        safetyTip: 'Check your socks for ticks after walking near tall ferns.',
        fieldNote: 'Ferns are ancient living fossils! They existed over 350 million years ago, long before flowering plants or dinosaurs walked the earth.'
      },
      {
        id: 'ft-4-seed-pod',
        order: 4,
        prompt: 'Find a woody seed pod, acorn cap, or winged maple samara.',
        hint: 'Search through the leaf litter under mature oak, maple, or walnut trees.',
        targetDescriptions: [
          'an acorn with its textured wooden cap on forest soil',
          'a woody seed pod or cone from a wild forest tree',
          'winged maple tree seed helicopter samara',
          'close up of a tree nut or wild seed in the woods'
        ],
        distractorDescriptions: [
          'a plastic bottle cap or metal soda tab',
          'a piece of chewing gum or wrapper',
          'a smooth round marble or golf ball',
          'a living green leaf'
        ],
        safetyTip: 'Leave nuts and seeds in the wild for squirrels and forest rodents.',
        fieldNote: 'A single mature oak tree drops up to 10,000 acorns in a good year, but only one or two ever grow into full-grown trees!'
      },
      {
        id: 'ft-5-canopy',
        order: 5,
        prompt: 'Stand still, look straight up, and capture the canopy where branches touch the sky.',
        hint: 'Look up through the green cathedral ceiling where sunlight filters through.',
        targetDescriptions: [
          'looking straight up at tall tree branches and green canopy',
          'tree crowns and leaf canopy viewed against the open sky',
          'treetops and outdoor woodland canopy from below',
          'crown shyness or forest canopy silhouette with sky'
        ],
        distractorDescriptions: [
          'an indoor ceiling with lighting fixtures',
          'a blank cloudless blue sky with no trees at all',
          'the ground, soil, or shoes from above',
          'a wall of a skyscraper or building'
        ],
        safetyTip: 'Stand with feet wide and stable so you don’t get dizzy looking straight up.',
        fieldNote: 'Some species exhibit "crown shyness," leaving narrow visible gaps between trees so each tree’s leaves get equal sun!'
      }
    ]
  }
];
