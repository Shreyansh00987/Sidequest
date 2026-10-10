import { describe, it, expect } from 'vitest';
import { QUEST_PACKS } from './questPacks';

describe('Quest Packs Data Validation', () => {
  it('contains at least 3 distinct curated quest packs', () => {
    expect(QUEST_PACKS.length).toBeGreaterThanOrEqual(3);
  });

  it('ensures each pack has 5 clues and complete fields', () => {
    const packIds = new Set<string>();

    for (const pack of QUEST_PACKS) {
      expect(pack.id).toBeTruthy();
      expect(packIds.has(pack.id)).toBe(false);
      packIds.add(pack.id);

      expect(pack.title).toBeTruthy();
      expect(pack.subtitle).toBeTruthy();
      expect(pack.description).toBeTruthy();
      expect(pack.safetySummary).toBeTruthy();
      expect(pack.clues.length).toBe(5);

      const clueIds = new Set<string>();
      let expectedOrder = 1;

      for (const clue of pack.clues) {
        expect(clue.id).toBeTruthy();
        expect(clueIds.has(clue.id)).toBe(false);
        clueIds.add(clue.id);

        expect(clue.order).toBe(expectedOrder);
        expectedOrder++;

        expect(clue.prompt.length).toBeGreaterThan(10);
        expect(clue.hint.length).toBeGreaterThan(5);
        expect(clue.targetDescriptions.length).toBeGreaterThanOrEqual(3);
        expect(clue.distractorDescriptions.length).toBeGreaterThanOrEqual(3);
        expect(clue.fieldNote.length).toBeGreaterThan(15);
      }
    }
  });

  it('includes safety guidance that warns about wild fungi and plants', () => {
    const forestPack = QUEST_PACKS.find(p => p.id === 'forest-trek');
    expect(forestPack).toBeDefined();

    const fungusClue = forestPack?.clues.find(c => c.id === 'ft-2-fungus');
    expect(fungusClue).toBeDefined();
    expect(fungusClue?.safetyTip).toContain('Never touch or eat any wild fungus');
  });
});
